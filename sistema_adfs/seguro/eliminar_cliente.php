<?php
// Habilitar CORS correctamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
    exit;
}

$id = intval($data['id']);

// Obtener usuario_id y num_afiliacion antes de eliminar
$stmt = $conn->prepare("SELECT usuario_id, num_afiliacion FROM clientes_seguro WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Cliente no encontrado"]);
    exit;
}

$row = $result->fetch_assoc();
$usuario_id = $row['usuario_id'];
$num_afiliacion = $row['num_afiliacion'];
$stmt->close();

// Eliminar el cliente del seguro
$delete = $conn->prepare("DELETE FROM clientes_seguro WHERE id = ?");
$delete->bind_param("i", $id);
$deleteSuccess = $delete->execute();
$delete->close();

if ($deleteSuccess) {
    // Actualizar paciente para quitar seguro y código
    $updatePaciente = $conn->prepare("
        UPDATE pacientes 
        SET tiene_seguro = 0, 
            codigo_paciente_unico = REPLACE(codigo_paciente_unico, CONCAT('-', ?), '') 
        WHERE usuario_id = ?
    ");
    $updatePaciente->bind_param("si", $num_afiliacion, $usuario_id);
    $updatePaciente->execute();
    $updatePaciente->close();

    echo json_encode(["success" => true, "message" => "Cliente del seguro eliminado y paciente actualizado"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar cliente del seguro"]);
}

$conn->close();
?>
