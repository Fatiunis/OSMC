<?php
include(__DIR__ . "/../../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["paciente_id"])) {
        throw new Exception("Falta el ID del paciente.");
    }

    $paciente_id = $data["paciente_id"];

    $stmt = $conn->prepare("SELECT id, nombre, documento_identidad, foto_url FROM pacientes WHERE id = ?");
    $stmt->bind_param("i", $paciente_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Paciente no encontrado.");
    }

    $paciente = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "paciente" => $paciente
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
