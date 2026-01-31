<?php
include(__DIR__ . "/../cors.php");
header('Content-Type: application/json');

include(__DIR__ . "/../db.php");

$id = $_GET['id'] ?? '';

if (empty($id)) {
    echo json_encode(['error' => 'ID de paciente requerido']);
    exit;
}

$query = "SELECT 
    c.id,
    c.fecha,
    c.tipo_consulta,
    c.diagnostico,
    c.estado,
    CONCAT(d.nombre, ' ', d.apellido) as doctor_nombre,
    CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as tiene_receta,
    r.id as receta_id
FROM consultas c
LEFT JOIN doctores d ON c.doctor_id = d.id
LEFT JOIN recetas r ON c.id = r.consulta_id
WHERE c.paciente_id = ?
ORDER BY c.fecha DESC";

$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$historial = [];
while ($row = $result->fetch_assoc()) {
    $historial[] = $row;
}

echo json_encode($historial);

$stmt->close();
$conexion->close();
?>