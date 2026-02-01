<?php
// Crear usuario vía web (POST JSON preferido). También soporta GET para pruebas rápidas.
// Uso (POST JSON): {"nombre":"Admin","correo":"admin@ejemplo.com","password":"admin123","rol":"admin"}
// Uso (GET): crear_usuario.php?nombre=Admin&correo=admin@ejemplo.com&password=admin123&rol=admin

include(__DIR__ . "/../cors.php");
include(__DIR__ . "/../db.php");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$input = file_get_contents('php://input');
if (!empty($input)) {
    $data = json_decode($input, true);
} else {
    // Permitir GET/POST form para pruebas rápidas en el navegador
    $data = $_REQUEST;
}

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "No data provided"]);
    exit;
}

$nombre = isset($data['nombre']) ? trim($data['nombre']) : null;
$correo = isset($data['correo']) ? trim($data['correo']) : null;
$password = isset($data['password']) ? $data['password'] : null;
$rol = isset($data['rol']) ? trim($data['rol']) : 'paciente';

if (!$nombre || !$correo || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Campos requeridos: nombre, correo, password"]);
    exit;
}

// Validación mínima de correo
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Correo inválido"]);
    exit;
}

try {
    // Verificar si correo ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? LIMIT 1");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res && $res->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "Correo ya registrado"]);
        exit;
    }
    $stmt->close();

    // Hashear contraseña
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, contrasena, rol, estado) VALUES (?, ?, ?, ?, 1)");
    $stmt->bind_param("ssss", $nombre, $correo, $hash, $rol);
    $ok = $stmt->execute();

    if (!$ok) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Error al insertar usuario: " . $stmt->error]);
        exit;
    }

    $insertId = $stmt->insert_id;
    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "id" => $insertId, "correo" => $correo]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
