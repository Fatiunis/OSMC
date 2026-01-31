<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID del medicamento no proporcionado."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM medicamentos WHERE id = ?");
$stmt->bind_param("i", $data['id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Medicamento eliminado."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar.", "error" => $stmt->error]);
}