<?php
include(__DIR__ . "/../cors.php");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    //  Este JOIN une pacientes con su usuario para obtener el correo
    $query = "SELECT p.*, u.correo 
              FROM pacientes p
              LEFT JOIN usuarios u ON p.usuario_id = u.id";

    $result = $conn->query($query);

    $pacientes = [];
    while ($row = $result->fetch_assoc()) {
        $pacientes[] = $row;
    }

    echo json_encode([
        'success' => true,
        'paciente' => $pacientes
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
