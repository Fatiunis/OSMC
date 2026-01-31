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

if (!isset($input['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID no recibido",
        "debug" => $input
    ]);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

$id = $input['id'];

// 1. Eliminar relaciones en pacientes si existen
$sqlRelacion = "DELETE FROM pacientes WHERE usuario_id = ?";
$stmtRelacion = $conn->prepare($sqlRelacion);
if ($stmtRelacion) {
    $stmtRelacion->bind_param("i", $id);
    $stmtRelacion->execute();
}

// 2. Eliminar usuario
$sql = "DELETE FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode([
        "success" => false,
        "message" => "Error en prepare() del DELETE",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario eliminado"]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al ejecutar DELETE",
        "error" => $stmt->error
    ]);
}

$conn->close();
?>
