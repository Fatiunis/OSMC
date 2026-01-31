<?php
// Responder correctamente a peticiones preflight CORS
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

$data = json_decode(file_get_contents("php://input"), true);

try {
    if (!$data) throw new Exception("Datos vacíos");

    $stmt = $conn->prepare("INSERT INTO procesos_clinicos (
        paciente_id, doctor_id, detalle, costo, forma_pago, aprobacion_seguro,
        diagnostico, resultados_url, fecha
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("iisdsssss",
        $data["paciente_id"],
        $data["doctor_id"],
        $data["detalle"],
        $data["costo"],
        $data["forma_pago"],
        $data["aprobacion_seguro"],
        $data["diagnostico"],
        $data["resultados_url"],
        $data["fecha"]
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "proceso_id" => $conn->insert_id]);
    } else {
        throw new Exception("Error al insertar: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
