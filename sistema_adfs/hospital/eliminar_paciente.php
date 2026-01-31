<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID es requerido']);
    exit;
}

// Obtener usuario_id del paciente
$get = $conn->prepare("SELECT usuario_id FROM pacientes WHERE id = ?");
$get->bind_param("i", $data['id']);
$get->execute();
$res = $get->get_result();

if ($res->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Paciente no encontrado']);
    exit;
}

$usuario_id = $res->fetch_assoc()['usuario_id'];
$get->close();

// Eliminar paciente
$del = $conn->prepare("DELETE FROM pacientes WHERE id = ?");
$del->bind_param("i", $data['id']);
$del->execute();
$del->close();

// Desactivar usuario
$upd = $conn->prepare("UPDATE usuarios SET estado = 0 WHERE id = ?");
$upd->bind_param("i", $usuario_id);
$upd->execute();
$upd->close();

echo json_encode(["success" => true, "message" => "Paciente eliminado y usuario desactivado"]);
?>
