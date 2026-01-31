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

if (!isset($input['correo']) || !isset($input['contrasena']) || !isset($input['rol'])) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos",
        "debug" => $input
    ]);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

$correo = $input['correo'];
$contrasena = password_hash($input['contrasena'], PASSWORD_DEFAULT);
$rol = $input['rol'];

$sql = "INSERT INTO usuarios (correo, contrasena, rol, estado) VALUES (?, ?, ?, 1)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode([
        "success" => false,
        "message" => "Error en prepare()",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("sss", $correo, $contrasena, $rol);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario creado"]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al ejecutar el INSERT",
        "error" => $stmt->error
    ]);
}

$conn->close();
?>
