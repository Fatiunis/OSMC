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

$result = mysqli_query($conn, "SELECT * FROM polizas ORDER BY id DESC");

$polizas = [];
while ($row = $result->fetch_assoc()) {
    $polizas[] = [
        "id" => (int)$row["id"],
        "nombre" => $row["nombre"],
        "cobertura_porcentaje" => (int)$row["cobertura_porcentaje"],
        "monto_minimo" => (float)$row["monto_minimo"],
        "activa" => (int)$row["activa"]
    ];
}
echo json_encode(["success" => true, "polizas" => $polizas]);

