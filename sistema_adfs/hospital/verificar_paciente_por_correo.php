<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);
$correo = trim($data["correo"] ?? "");

if (!$correo) {
    echo json_encode(["existe" => false]);
    exit;
}

// Verifica que ya exista como paciente, sin importar si ya existe en usuarios
$stmt = $conn->prepare("SELECT p.id FROM pacientes p JOIN usuarios u ON p.usuario_id = u.id WHERE u.correo = ?");

$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode(["existe" => $result->num_rows > 0]);
exit;