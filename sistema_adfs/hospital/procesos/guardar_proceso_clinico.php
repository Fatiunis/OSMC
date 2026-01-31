<?php
// Mostrar errores durante desarrollo (comenta esto en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Manejo CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) throw new Exception("No se recibió información JSON válida");

    $requeridos = ["paciente_id", "doctor_id", "detalle", "diagnostico", "fecha"];
    foreach ($requeridos as $campo) {
        if (!isset($data[$campo]) || $data[$campo] === "") {
            throw new Exception("Falta el campo requerido: $campo");
        }
    }

    $paciente_id = $data["paciente_id"];
    $doctor_id = $data["doctor_id"];
    $detalle = $data["detalle"];
    $costo = $data["costo"];
    $forma_pago = $data["forma_pago"] ?? "";
    $diagnostico = $data["diagnostico"];
    $resultados_url = $data["resultados_url"] ?? "";
    $fecha = $data["fecha"];

    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $fecha)) {
        throw new Exception("Formato de fecha inválido: $fecha");
    }

    $stmt = $conn->prepare("INSERT INTO procesos_clinicos (
        paciente_id, doctor_id, detalle, costo, forma_pago,
        diagnostico, resultados_url, fecha
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisdssss", $paciente_id, $doctor_id, $detalle, $costo, $forma_pago, $diagnostico, $resultados_url, $fecha);
    if (!$stmt->execute()) throw new Exception("Error al insertar proceso clínico");
    $proceso_id = $stmt->insert_id;
    $stmt->close();

    // Historial de aprobación
    if (!empty($data["codigo_paciente_unico"]) && !empty($data["especialidad"])) {
        $codigo_paciente_unico = $data["codigo_paciente_unico"];
        $especialidad = $data["especialidad"];
        $porcentaje_cobertura = $data["cobertura_seguro"] ?? 0;
        $monto_cubierto = $data["monto_cubierto_seguro"] ?? 0;
        $monto_paciente = $data["monto_pagado_paciente"] ?? 0;
        $codigo_aprobacion = $data["codigo_aprobacion"] ?? "";
        $mensaje_aprobado = $data["mensaje_aprobado"] ?? "";

        $stmtCheck = $conn->prepare("SELECT id FROM historial_aprobaciones WHERE id_seguro_paciente = ? AND id_proceso IS NULL ORDER BY id DESC LIMIT 1");
        $stmtCheck->bind_param("s", $codigo_paciente_unico);
        $stmtCheck->execute();
        $resCheck = $stmtCheck->get_result();

        if ($resCheck->num_rows > 0) {
            $filaExistente = $resCheck->fetch_assoc();
            $historial_id = $filaExistente['id'];

            $stmtUpdate = $conn->prepare("UPDATE historial_aprobaciones SET
                id_proceso = ?, especialidad = ?, costo = ?, porcentaje_cobertura = ?,
                monto_cubierto = ?, monto_paciente = ?, codigo_aprobacion = ?, mensaje = ?
                WHERE id = ?");
            $stmtUpdate->bind_param(
                "isdddsssi",
                $proceso_id,
                $especialidad,
                $costo,
                $porcentaje_cobertura,
                $monto_cubierto,
                $monto_paciente,
                $codigo_aprobacion,
                $mensaje_aprobado,
                $historial_id
            );
            $stmtUpdate->execute();
            $stmtUpdate->close();
        } else {
            $stmt_historial = $conn->prepare("INSERT INTO historial_aprobaciones (
                id_proceso, id_seguro_paciente, especialidad, costo,
                porcentaje_cobertura, monto_cubierto, monto_paciente,
                codigo_aprobacion, mensaje
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt_historial->bind_param(
                "issddddss",
                $proceso_id,
                $codigo_paciente_unico,
                $especialidad,
                $costo,
                $porcentaje_cobertura,
                $monto_cubierto,
                $monto_paciente,
                $codigo_aprobacion,
                $mensaje_aprobado
            );
            $stmt_historial->execute();
            $historial_id = $stmt_historial->insert_id;
            $stmt_historial->close();
        }

        $stmt_update = $conn->prepare("UPDATE procesos_clinicos SET historial_aprobacion_id = ? WHERE id_proceso = ?");
        $stmt_update->bind_param("ii", $historial_id, $proceso_id);
        $stmt_update->execute();
        $stmt_update->close();
    }

    $codigo_receta_final = null;
    if (!empty($data["receta"])) {
        $receta = $data["receta"];

        if (empty($receta["codigo_receta"])) {
            $timestamp = substr(strval(time()), -5);
            $base_codigo = "{$paciente_id}-1001";
            if (!empty($data["cobertura_seguro"])) $base_codigo .= "-2002";
            $receta["codigo_receta"] = "{$base_codigo}-{$timestamp}";
        }

        $fecha_emision = $receta["fecha_emision"];
        $fechaValida = DateTime::createFromFormat("Y-m-d", $fecha_emision);
        if (!$fechaValida || $fechaValida->format("Y-m-d") !== $fecha_emision) {
            throw new Exception("Fecha de receta inválida: $fecha_emision");
        }

        $stmtReceta = $conn->prepare("INSERT INTO recetas_medicas (
            proceso_id, codigo_receta, fecha_emision, nombre_paciente,
            nombre_doctor, numero_colegiado, especialidad,
            diagnostico, anotaciones, comentarios, notas_especiales
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmtReceta->bind_param(
            "issssssssss",
            $proceso_id,
            $receta["codigo_receta"],
            $receta["fecha_emision"],
            $receta["nombre_paciente"],
            $receta["nombre_doctor"],
            $receta["numero_colegiado"],
            $receta["especialidad"],
            $receta["diagnostico"],
            $receta["anotaciones"],
            $receta["comentarios"],
            $receta["notas_especiales"]
        );
        $stmtReceta->execute();
        $receta_id = $stmtReceta->insert_id;
        $stmtReceta->close();

        $codigo_receta_final = $receta["codigo_receta"];

        if (!empty($receta["medicamentos"])) {
            foreach ($receta["medicamentos"] as $med) {
                $dosis_valor = match($med["dosis"]) {
                    "1/4" => 0.25,
                    "1/2" => 0.5,
                    "1"   => 1,
                    "2"   => 2,
                    default => is_numeric($med["dosis"]) ? floatval($med["dosis"]) : null
                };

                preg_match('/\d+/', $med["frecuencia"], $fMatch);
                $frecuencia_horas = isset($fMatch[0]) ? intval($fMatch[0]) : null;

                preg_match('/\d+/', $med["duracion"], $dMatch);
                $duracion_dias = isset($dMatch[0]) ? intval($dMatch[0]) : null;

                $dosis_formato = !empty($med["dosis"]) ? $med["dosis"] . " tableta(s)" : null;
                $frecuencia_formato = !empty($med["frecuencia"]) ? "cada " . $med["frecuencia"] . " horas" : null;
                $duracion_formato = !empty($med["duracion"]) ? $med["duracion"] . " días" : null;

                $stmtMed = $conn->prepare("INSERT INTO medicamentos_recetados (
                    receta_id, codigo_receta, principio_activo, concentracion, presentacion,
                    forma_farmaceutica, dosis, frecuencia, duracion,
                    dosis_valor, frecuencia_horas, duracion_dias,
                    dosis_formato, frecuencia_formato, duracion_formato
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmtMed->bind_param(
                    "isssssssiidssss",
                    $receta_id,
                    $receta["codigo_receta"],
                    $med["principio_activo"],
                    $med["concentracion"],
                    $med["presentacion"],
                    $med["forma_farmaceutica"],
                    $med["dosis"],
                    $med["frecuencia"],
                    $med["duracion"],
                    $dosis_valor,
                    $frecuencia_horas,
                    $duracion_dias,
                    $dosis_formato,
                    $frecuencia_formato,
                    $duracion_formato
                );
                $stmtMed->execute();
                $stmtMed->close();
            }
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Proceso clínico guardado con éxito",
        "proceso_id" => $proceso_id,
        "codigo_receta" => $codigo_receta_final,
        "monto_cubierto_seguro" => $data["monto_cubierto_seguro"] ?? 0,
        "monto_pagado_paciente" => $data["monto_pagado_paciente"] ?? 0
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}