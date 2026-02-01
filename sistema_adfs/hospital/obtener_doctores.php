<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    $query = "SELECT m.*, u.correo
              FROM medicos m
              LEFT JOIN usuarios u ON m.id_usuario = u.id";

    $result = $conn->query($query);

    $medicos = [];
    while ($row = $result->fetch_assoc()) {
        $medicos[] = $row;
    }

    echo json_encode([
        'success' => true,
        'doctor' => $medicos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>
