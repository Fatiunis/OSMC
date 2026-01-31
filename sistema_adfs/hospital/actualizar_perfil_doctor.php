<?php
include(__DIR__ . "/../cors.php");
header('Content-Type: application/json');

include(__DIR__ . '/../db.php');

// Leer datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar campos obligatorios
if (
    !isset($data['doctor_id']) ||
    !isset($data['nombre']) ||
    !isset($data['universidad']) ||
    !isset($data['telefono']) ||
    !isset($data['foto_url']) ||
    !isset($data['titulo_url'])
) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$doctor_id = $data['doctor_id'];
$nombre = $data['nombre'];
$universidad = $data['universidad'];
$telefono = $data['telefono'];
$foto_url = $data['foto_url'];
$titulo_url = $data['titulo_url'];

// Consulta preparada para actualizar campos específicos
$query = "UPDATE medicos SET 
            nombre = ?, 
            universidad = ?, 
            telefono = ?, 
            foto_url = ?, 
            titulo_url = ?
          WHERE usuario_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sssssi", $nombre, $universidad, $telefono, $foto_url, $titulo_url, $doctor_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>