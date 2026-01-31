<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include(__DIR__ . "/../db.php");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id']) || !isset($input['correo']) || !isset($input['rol']) || !isset($input['estado'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$id = $input['id'];
$correo = $input['correo'];
$rol = $input['rol'];
$estado = $input['estado'];

$sql = "UPDATE usuarios SET correo = ?, rol = ?, estado = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $correo, $rol, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar usuario"]);
}

$conn->close();
?>
