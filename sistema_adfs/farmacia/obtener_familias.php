<?php
include(__DIR__ . "/../cors.php");

include(__DIR__ . "/../db.php");
header("Content-Type: application/json");

$result = $conn->query("SELECT id, nombre FROM familias_medicamentos");
$familias = [];

while ($row = $result->fetch_assoc()) {
    $familias[] = $row;
}

echo json_encode([
    "success" => true,
    "familias" => $familias
]);

$conn->close();
