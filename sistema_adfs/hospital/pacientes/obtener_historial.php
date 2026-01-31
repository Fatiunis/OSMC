<?php
include(__DIR__ . "/../../cors.php");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include(__DIR__ . "/../../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["paciente_id"])) {
        throw new Exception("ID de paciente no proporcionado.");
    }

    $paciente_id = intval($data["paciente_id"]);
    $procesos = [];

    // 📌 Obtener procesos clínicos con datos del doctor, paciente y receta
    $query = "
        SELECT 
            pc.*, 
            d.nombre AS nombre_doctor,
            d.especialidad,
            d.numero_colegiado,
            p.nombre AS nombre_paciente,
            p.foto_url,
            r.codigo_receta,
            r.diagnostico AS diagnostico_receta,
            r.anotaciones,
            r.comentarios,
            r.notas_especiales,
            ha.monto_cubierto AS monto_cubierto_seguro,
            ha.monto_paciente AS monto_pagado_paciente,
            ha.porcentaje_cobertura,
            ha.codigo_aprobacion
        FROM procesos_clinicos pc
        JOIN medicos d ON d.id = pc.doctor_id
        JOIN pacientes p ON p.id = pc.paciente_id
        LEFT JOIN recetas_medicas r ON r.proceso_id = pc.id_proceso
        LEFT JOIN historial_aprobaciones ha ON ha.id = pc.historial_aprobacion_id
        WHERE pc.paciente_id = ?
        ORDER BY pc.fecha DESC
    ";


    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $paciente_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $proceso_id = $row["id_proceso"];

        // 🔎 Obtener medicamentos recetados si hay receta asociada
        $medicamentos = [];
        if (!empty($row["codigo_receta"])) {
            $med_query = "
                SELECT * FROM medicamentos_recetados 
                WHERE receta_id = (
                    SELECT id_receta FROM recetas_medicas WHERE proceso_id = ?
                )
            ";
            $med_stmt = $conn->prepare($med_query);
            $med_stmt->bind_param("i", $proceso_id);
            $med_stmt->execute();
            $med_result = $med_stmt->get_result();

            while ($med = $med_result->fetch_assoc()) {
                $medicamentos[] = $med;
            }

            $med_stmt->close();
        }

        $row["medicamentos"] = $medicamentos;
        $procesos[] = $row;
    }

    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "procesos" => $procesos]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>