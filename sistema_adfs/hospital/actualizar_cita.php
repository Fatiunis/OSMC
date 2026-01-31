<?php
include(__DIR__ . "/../cors.php");
date_default_timezone_set('America/Guatemala');

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID requerido"]);
    exit;
}

// Forzar fecha como string plano
$fecha = strval($data['fecha']);

$query = "UPDATE citas 
          SET paciente_id=?, doctor_id=?, fecha=?, hora_inicio=?, hora_fin=?, estado=?, observaciones=?, resultados=?, creada_por=? 
          WHERE id=?";

$stmt = $conn->prepare($query);

$stmt->bind_param("iisssssssi",
    $data['paciente_id'],
    $data['doctor_id'],
    $fecha,
    $data['hora_inicio'],
    $data['hora_fin'],
    $data['estado'],
    $data['observaciones'],
    $data['resultados'],
    $data['creada_por'],
    $data['id']
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
