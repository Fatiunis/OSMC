<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || empty($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID es requerido']);
    exit;
}

// Obtener el usuario_id del doctor a eliminar
$getUserQuery = "SELECT usuario_id FROM medicos WHERE id = ?";
$getStmt = $conn->prepare($getUserQuery);
$getStmt->bind_param("i", $data['id']);
$getStmt->execute();
$getResult = $getStmt->get_result();

if ($getResult->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Doctor no encontrado']);
    exit;
}

$usuario_id = $getResult->fetch_assoc()['usuario_id'];
$getStmt->close();

// Eliminar al doctor
$query = "DELETE FROM medicos WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $data['id']);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar doctor', 'error' => $stmt->error]);
    exit;
}
$stmt->close();

// Desactivar al usuario
$deactivateQuery = "UPDATE usuarios SET estado = 0 WHERE id = ?";
$deactivateStmt = $conn->prepare($deactivateQuery);
$deactivateStmt->bind_param("i", $usuario_id);

if ($deactivateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Doctor eliminado y usuario desactivado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Doctor eliminado, pero error al desactivar usuario', 'error' => $deactivateStmt->error]);
}

$deactivateStmt->close();
$conn->close();
?>
