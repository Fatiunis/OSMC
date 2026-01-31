<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID es requerido"]);
    exit;
}

$stmt = $conn->prepare("UPDATE especialidades SET nombre = ?, descripcion = ?, icono_url = ? WHERE id = ?");
$stmt->bind_param("sssi", $data['nombre'], $data['descripcion'], $data['icono_url'], $data['id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}
$stmt->close();
$conn->close();
?>