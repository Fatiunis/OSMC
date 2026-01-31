<?php
include(__DIR__ . "/../../cors.php");
include(__DIR__ . "/../../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["cita_id"])) {
        throw new Exception("Falta el ID de la cita.");
    }

    $cita_id = $data["cita_id"];

    $stmt = $conn->prepare("
        SELECT 
            c.id, c.fecha, c.hora_inicio, c.hora_fin, c.estado, 
            p.id AS paciente_id, p.nombre AS nombre_paciente, p.documento_identidad, p.foto_url,
            p.tiene_seguro, p.codigo_paciente_unico, p.id_seguro,
            m.id AS doctor_id, m.nombre AS nombre_doctor, m.numero_colegiado, m.especialidad
        FROM citas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.doctor_id = m.id
        WHERE c.id = ?
    ");

    $stmt->bind_param("i", $cita_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Cita no encontrada.");
    }

    $cita = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "cita" => $cita
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
