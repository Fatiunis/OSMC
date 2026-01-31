<?php
include(__DIR__ . "/../../cors.php");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include(__DIR__ . "/../../db.php");
$data = json_decode(file_get_contents("php://input"), true);

$result = mysqli_query($conn, "SELECT * FROM servicios_seguro ORDER BY id DESC");
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($data);
