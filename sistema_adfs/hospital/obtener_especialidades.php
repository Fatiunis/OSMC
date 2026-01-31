<?php
include(__DIR__ . "/../cors.php");
include(__DIR__ . "/../db.php");

$result = $conn->query("SELECT * FROM especialidades");
$especialidades = [];

while ($row = $result->fetch_assoc()) {
    $especialidades[] = $row;
}
echo json_encode(["success" => true, "especialidades" => $especialidades]);
$conn->close();
?>