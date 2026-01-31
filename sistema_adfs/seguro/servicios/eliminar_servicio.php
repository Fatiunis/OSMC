<?php
include(__DIR__ . "/../../cors.php");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include(__DIR__ . "/../../db.php");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$query = "DELETE FROM servicios_seguro WHERE id=$id";
echo json_encode(["success" => mysqli_query($conn, $query)]);
