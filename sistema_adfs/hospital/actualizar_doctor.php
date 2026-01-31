<?php
include(__DIR__ . "/../cors.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || empty($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID del doctor es requerido']);
    exit;
}

$required = ['nombre', 'especialidad', 'fecha_graduacion', 'universidad',
             'numero_colegiado', 'telefono', 'foto_url', 'titulo_url', 'activo', 'codigo_hospital'];

foreach ($required as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Campo requerido faltante: $field"]);
        exit;
    }
}

$query = "UPDATE medicos SET
    usuario_id = ?, nombre = ?, especialidad = ?, fecha_graduacion = ?, universidad = ?,
    numero_colegiado = ?, telefono = ?, foto_url = ?, titulo_url = ?, activo = ?, codigo_hospital = ?
WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("issssssssiii",
    $data['usuario_id'],
    $data['nombre'],
    $data['especialidad'],
    $data['fecha_graduacion'],
    $data['universidad'],
    $data['numero_colegiado'],
    $data['telefono'],
    $data['foto_url'],
    $data['titulo_url'],
    $data['activo'],
    $data['codigo_hospital'],
    $data['id']
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar doctor', 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>
