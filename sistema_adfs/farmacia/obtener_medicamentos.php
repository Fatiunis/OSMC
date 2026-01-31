<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$sql = "SELECT * FROM medicamentos";
$result = $conn->query($sql);
$medicamentos = [];

while($row = $result->fetch_assoc()) {
    $medicamentos[] = $row;
}

echo json_encode($medicamentos);
