<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");
    exit();
}

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['doctor_id']) || !isset($data['fecha'])) {
  echo json_encode(["success" => false, "message" => "doctor_id y fecha son requeridos"]);
  exit;
}

$doctor_id = $data['doctor_id'];
$fecha = $data['fecha'];

$query = "SELECT c.*, p.nombre AS nombre_paciente
          FROM citas c
          JOIN pacientes p ON c.paciente_id = p.id
          WHERE c.doctor_id = ? AND c.fecha = ?
          ORDER BY c.hora_inicio";

$stmt = $conn->prepare($query);
$stmt->bind_param("is", $doctor_id, $fecha);
$stmt->execute();

$result = $stmt->get_result();
$citas = [];

while ($row = $result->fetch_assoc()) {
  $citas[] = $row;
}

echo json_encode($citas);

$stmt->close();
$conn->close();
?>