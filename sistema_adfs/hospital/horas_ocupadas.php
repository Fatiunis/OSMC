<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . '/../db.php');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['doctor_id'], $data['fecha'])) {
    echo json_encode([]);
    exit();
}

$doctor_id = $data['doctor_id'];
$fecha = $data['fecha'];

$query = "SELECT hora_inicio FROM citas WHERE doctor_id = ? AND fecha = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("is", $doctor_id, $fecha);
$stmt->execute();

$result = $stmt->get_result();
$horas = [];

while ($row = $result->fetch_assoc()) {
    $horas[] = $row;
}

echo json_encode($horas);

$stmt->close();
$conn->close();
?>
