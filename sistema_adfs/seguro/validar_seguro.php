<?php
include(__DIR__ . "/../cors.php");

ini_set('display_errors', 1);
error_reporting(E_ALL);
include(__DIR__ . "/../db.php");

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) throw new Exception("Datos no recibidos");

    $usuario_id = intval($data["paciente_id"] ?? 0);
    $especialidad = trim($data["especialidad"] ?? "");
    $costo = floatval($data["costo"] ?? 0);

    if (!$usuario_id || !$especialidad || !$costo) {
        throw new Exception("Faltan datos: usuario_id, especialidad o costo");
    }

    // Buscar relación paciente - cliente_seguro
    $stmt = $conn->prepare("
        SELECT 
            p.codigo_paciente_unico,
            TRIM(p.id_seguro) AS id_seguro,
            TRIM(c.num_afiliacion) AS num_afiliacion,
            c.servicio_activo,
            c.poliza_id
        FROM pacientes p
        INNER JOIN clientes_seguro c 
            ON TRIM(p.id_seguro) = TRIM(c.num_afiliacion)
        WHERE p.id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $stmt->close();

    $datos = $resultado->fetch_assoc();
    $codigo_unico = $datos["codigo_paciente_unico"] ?? "desconocido";

    // Si no hay datos
    if (!$datos) {
        $mensaje_error = "❌ No se encontró coincidencia entre el paciente y su seguro.";
        $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
            id_seguro_paciente, especialidad, costo,
            porcentaje_cobertura, monto_cubierto, monto_paciente,
            codigo_aprobacion, mensaje
        ) VALUES (?, ?, ?, 0, 0.00, ?, '0', ?)");
        $stmt->bind_param("ssdds", $codigo_unico, $especialidad, $costo, $costo, $mensaje_error);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "estado" => "rechazado",
            "mensaje" => $mensaje_error
        ]);
        exit;
    }

    if ((int)$datos["servicio_activo"] !== 1) {
        $mensaje_error = "❌ El cliente no tiene servicio activo con el seguro.";
        $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
            id_seguro_paciente, especialidad, costo,
            porcentaje_cobertura, monto_cubierto, monto_paciente,
            codigo_aprobacion, mensaje
        ) VALUES (?, ?, ?, 0, 0.00, ?, '0', ?)");
        $stmt->bind_param("ssdds", $codigo_unico, $especialidad, $costo, $costo, $mensaje_error);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "estado" => "rechazado",
            "mensaje" => $mensaje_error
        ]);
        exit;
    }

    $poliza_id = $datos["poliza_id"];

    // Buscar porcentaje de cobertura
    $stmt = $conn->prepare("SELECT cobertura_porcentaje FROM polizas WHERE id = ? AND activa = 1");
    $stmt->bind_param("i", $poliza_id);
    $stmt->execute();
    $poliza = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$poliza) {
        $mensaje_error = "❌ Póliza no activa o inexistente.";
        $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
            id_seguro_paciente, especialidad, costo,
            porcentaje_cobertura, monto_cubierto, monto_paciente,
            codigo_aprobacion, mensaje
        ) VALUES (?, ?, ?, 0, 0.00, ?, '0', ?)");
        $stmt->bind_param("ssdds", $codigo_unico, $especialidad, $costo, $costo, $mensaje_error);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "estado" => "rechazado",
            "mensaje" => $mensaje_error
        ]);
        exit;
    }

    $porcentaje = intval($poliza["cobertura_porcentaje"]);

    // Validar si la especialidad está cubierta
    $stmt = $conn->prepare("SELECT precio_seguro FROM servicios_seguro WHERE categoria = ? AND activo = 1");
    $stmt->bind_param("s", $especialidad);
    $stmt->execute();
    $servicio = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$servicio) {
        $mensaje_error = "❌ La especialidad '$especialidad' no está cubierta por el seguro o está inactiva.";
        $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
            id_seguro_paciente, especialidad, costo,
            porcentaje_cobertura, monto_cubierto, monto_paciente,
            codigo_aprobacion, mensaje
        ) VALUES (?, ?, ?, 0, 0.00, ?, '0', ?)");
        $stmt->bind_param("ssdds", $codigo_unico, $especialidad, $costo, $costo, $mensaje_error);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "estado" => "rechazado",
            "mensaje" => $mensaje_error
        ]);
        exit;
    }

    $precio_minimo = floatval($servicio["precio_seguro"]);
    if ($costo < $precio_minimo) {
        $mensaje_error = "❌ El costo del procedimiento (Q$costo) no cumple con el mínimo requerido (Q$precio_minimo).";
        $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
            id_seguro_paciente, especialidad, costo,
            porcentaje_cobertura, monto_cubierto, monto_paciente,
            codigo_aprobacion, mensaje
        ) VALUES (?, ?, ?, 0, 0.00, ?, '0', ?)");
        $stmt->bind_param("ssdds", $codigo_unico, $especialidad, $costo, $costo, $mensaje_error);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "estado" => "rechazado",
            "mensaje" => $mensaje_error
        ]);
        exit;
    }

    // APROBACIÓN: se cumplen todos los criterios
    $monto_cubierto = round($costo * ($porcentaje / 100), 2);
    $monto_paciente = round($costo - $monto_cubierto, 2);
    $codigo_aprobacion = "SG" . date("YmdHis") . rand(100, 999);
    $mensaje_aprobado = "✅ Cobertura aprobada: $porcentaje% para '$especialidad'";

    // Registrar en historial
    $stmt = $conn->prepare("INSERT INTO historial_aprobaciones (
        id_seguro_paciente, especialidad, costo,
        porcentaje_cobertura, monto_cubierto, monto_paciente,
        codigo_aprobacion, mensaje
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssiddiis",
        $codigo_unico,
        $especialidad,
        $costo,
        $porcentaje,
        $monto_cubierto,
        $monto_paciente,
        $codigo_aprobacion,
        $mensaje_aprobado
    );
    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "estado" => "aprobado",
        "codigo_aprobacion" => $codigo_aprobacion,
        "porcentaje" => $porcentaje,
        "monto_cubierto" => $monto_cubierto,
        "monto_paciente" => $monto_paciente,
        "mensaje" => $mensaje_aprobado
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error interno: " . $e->getMessage()]);
}
