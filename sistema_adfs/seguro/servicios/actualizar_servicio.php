<?php
include(__DIR__ . "/../../db.php");

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

// Validar que se recibió todo lo necesario
if (
  !isset($data['id']) ||
  !isset($data['categoria']) ||
  !isset($data['subcategoria']) ||
  !isset($data['descripcion']) ||
  !isset($data['precio_seguro']) ||
  !isset($data['tipo_cobertura']) ||
  !isset($data['activo'])
) {
  echo json_encode(["success" => false, "message" => "Datos incompletos"]);
  exit;
}

$id = $data['id'];
$categoria = $data['categoria'];
$subcategoria = $data['subcategoria'];
$descripcion = $data['descripcion'];
$precio_seguro = $data['precio_seguro'];
$tipo_cobertura = $data['tipo_cobertura'];
$activo = $data['activo'];

$query = "UPDATE servicios_seguro
          SET categoria = ?, subcategoria = ?, descripcion = ?, precio_seguro = ?, tipo_cobertura = ?, activo = ?
          WHERE id = ?";

$stmt = $conn->prepare($query);
if (!$stmt) {
  echo json_encode(["success" => false, "message" => "Error en prepare", "error" => $conn->error]);
  exit;
}

$stmt->bind_param("sssdsii", $categoria, $subcategoria, $descripcion, $precio_seguro, $tipo_cobertura, $activo, $id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Error al ejecutar", "error" => $stmt->error]);
}
