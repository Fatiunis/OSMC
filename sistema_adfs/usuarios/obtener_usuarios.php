<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include(__DIR__ . "/../db.php");

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos"
    ]);
    exit;
}

$sql = "SELECT id, correo, rol, estado FROM usuarios";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode([
        "success" => false,
        "message" => "Error al ejecutar la consulta",
        "error" => $conn->error
    ]);
    exit;
}

$usuarios = [];

while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode([
    "success" => true,
    "usuarios" => $usuarios
]);

$conn->close();
?>
