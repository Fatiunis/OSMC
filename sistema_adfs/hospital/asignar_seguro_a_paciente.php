<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['usuario_id'])) {
    echo json_encode(["success" => false, "message" => "usuario_id no proporcionado"]);
    exit;
}

$usuario_id = intval($data['usuario_id']);

// 1. Verificar que el paciente exista
$stmtPaciente = $conn->prepare("SELECT id, codigo_paciente_unico FROM pacientes WHERE usuario_id = ?");
$stmtPaciente->bind_param("i", $usuario_id);
$stmtPaciente->execute();
$resPaciente = $stmtPaciente->get_result();

if ($resPaciente->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "El usuario no está registrado como paciente."]);
    exit;
}

$paciente = $resPaciente->fetch_assoc();
$paciente_id = $paciente['id'];
$codigo_actual = $paciente['codigo_paciente_unico'];

// 2. Verificar si tiene cliente del seguro
$stmtSeguro = $conn->prepare("SELECT num_afiliacion FROM clientes_seguro WHERE usuario_id = ?");
$stmtSeguro->bind_param("i", $usuario_id);
$stmtSeguro->execute();
$resSeguro = $stmtSeguro->get_result();

if ($resSeguro->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "El usuario no está registrado como cliente del seguro."]);
    exit;
}

$seguro = $resSeguro->fetch_assoc();
$num_afiliacion = $seguro['num_afiliacion'];

// 3. Revisar si ya tiene afiliación en su código
if (strpos($codigo_actual, $num_afiliacion) !== false) {
    echo json_encode(["success" => true, "message" => "El paciente ya tiene el número de afiliación en su código."]);
    exit;
}

// 4. Actualizar paciente: tiene_seguro = 1, agregar num_afiliacion al código
$codigo_actualizado = $codigo_actual . '-' . $num_afiliacion;

$stmtUpdate = $conn->prepare("UPDATE pacientes SET tiene_seguro = 1, codigo_paciente_unico = ? WHERE id = ?");
$stmtUpdate->bind_param("si", $codigo_actualizado, $paciente_id);
$success = $stmtUpdate->execute();
$stmtUpdate->close();

if ($success) {
    echo json_encode(["success" => true, "message" => "Seguro asignado al paciente correctamente", "nuevo_codigo" => $codigo_actualizado]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar paciente"]);
}

$conn->close();
?>
