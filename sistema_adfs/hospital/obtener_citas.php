<?php
include(__DIR__ . "/../cors.php");

// Si la solicitud es preflight (OPTIONS), responder sin más
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include(__DIR__ . "/../db.php");

$query = "SELECT * FROM citas ORDER BY fecha DESC, hora_inicio";
$result = $conn->query($query);

$citas = [];
while ($row = $result->fetch_assoc()) {
  $citas[] = $row;
}

echo json_encode($citas);
$conn->close();
?>