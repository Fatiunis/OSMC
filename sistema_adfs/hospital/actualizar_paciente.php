<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID requerido']);
    exit;
}

$query = "UPDATE pacientes SET
    nombre = ?,
    fecha_nacimiento = ?,
    documento_identidad = ?,
    tiene_seguro = ?,
    foto_url = ?,
    activo = ?,
    codigo_hospital = ?
WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sssisiii",
    $data['nombre'],
    $data['fecha_nacimiento'],
    $data['documento_identidad'],
    $data['tiene_seguro'],
    $data['foto_url'],
    $data['activo'],
    $data['codigo_hospital'],
    $data['id']
);

if ($stmt->execute()) {
    // Regenerar código único
    $codigo = $data['id'] . '-1001';
    if ($data['tiene_seguro'] == 1 && isset($data['id_seguro'])) {
        $codigo .= '-' . $data['id_seguro'];
    }
    $updateCodigo = $conn->prepare("UPDATE pacientes SET codigo_paciente_unico = ? WHERE id = ?");
    $updateCodigo->bind_param("si", $codigo, $data['id']);
    $updateCodigo->execute();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
