<?php
include(__DIR__ . "/../../db.php");

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$nombre = $data["nombre"];
$cobertura = $data["cobertura_porcentaje"];
$monto_minimo = $data["monto_minimo"];
$activa = $data["activa"];

$query = "UPDATE polizas
          SET nombre = ?, cobertura_porcentaje = ?, monto_minimo = ?, activa = ?
          WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sidii", $nombre, $cobertura, $monto_minimo, $activa, $id);

$success = $stmt->execute();
echo json_encode(["success" => $success]);