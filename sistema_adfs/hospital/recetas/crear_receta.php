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
    if (!$data) throw new Exception("Datos inválidos");

    $stmt = $conn->prepare("INSERT INTO recetas_medicas (
        proceso_id, codigo_receta, fecha_emision, nombre_paciente, nombre_doctor,
        numero_colegiado, especialidad, diagnostico, anotaciones, comentarios, notas_especiales
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("issssssssss",
        $data["proceso_id"],
        $data["codigo_receta"],
        $data["fecha_emision"],
        $data["nombre_paciente"],
        $data["nombre_doctor"],
        $data["numero_colegiado"],
        $data["especialidad"],
        $data["diagnostico"],
        $data["anotaciones"],
        $data["comentarios"],
        $data["notas_especiales"]
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "receta_id" => $conn->insert_id]);
    } else {
        throw new Exception("Error al insertar receta: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
