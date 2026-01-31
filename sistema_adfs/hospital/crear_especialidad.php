<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nombre']) || !$data['nombre']) {
    echo json_encode(["success" => false, "message" => "Nombre es requerido"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO especialidades (nombre, descripcion, icono_url) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $data['nombre'], $data['descripcion'], $data['icono_url']);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}
$stmt->close();
$conn->close();
?>