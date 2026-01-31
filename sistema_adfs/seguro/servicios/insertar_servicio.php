<?php
include(__DIR__ . "/../../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../../db.php");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

// Validar que se recibió todo lo necesario
if (
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

$categoria = $data['categoria'];
$subcategoria = $data['subcategoria'];
$descripcion = $data['descripcion'];
$precio_seguro = $data['precio_seguro'];
$tipo_cobertura = $data['tipo_cobertura'];
$activo = $data['activo'];

$query = "INSERT INTO servicios_seguro (categoria, subcategoria, descripcion, precio_seguro, tipo_cobertura, activo)
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);
if (!$stmt) {
  echo json_encode(["success" => false, "message" => "Error en prepare", "error" => $conn->error]);
  exit;
}

$stmt->bind_param("sssdsi", $categoria, $subcategoria, $descripcion, $precio_seguro, $tipo_cobertura, $activo);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Error al ejecutar", "error" => $stmt->error]);
}
