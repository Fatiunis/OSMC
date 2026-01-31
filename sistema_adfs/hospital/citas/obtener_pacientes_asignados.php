<?php
// CORS headers
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

include(__DIR__ . "/../../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["doctor_usuario_id"])) {
        throw new Exception("Falta el ID del usuario doctor.");
    }

    $doctor_usuario_id = $data["doctor_usuario_id"];

    // Buscar ID real del médico
    $stmt = $conn->prepare("SELECT id FROM medicos WHERE usuario_id = ?");
    $stmt->bind_param("i", $doctor_usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("No se encontró al doctor.");
    }

    $doctor = $result->fetch_assoc();
    $doctor_id = $doctor["id"];

    // 🔥 Consulta con foto incluida
    $query = "
        SELECT DISTINCT p.id, p.nombre, p.documento_identidad, p.foto_url
        FROM citas c
        JOIN pacientes p ON c.paciente_id = p.id
        WHERE c.doctor_id = ?
    ";

    $stmtPacientes = $conn->prepare($query);
    $stmtPacientes->bind_param("i", $doctor_id);
    $stmtPacientes->execute();
    $resultPacientes = $stmtPacientes->get_result();

    $pacientes = [];
    while ($row = $resultPacientes->fetch_assoc()) {
        $pacientes[] = $row;
    }

    echo json_encode([
        "success" => true,
        "pacientes" => $pacientes
    ]);

    $stmt->close();
    $stmtPacientes->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
