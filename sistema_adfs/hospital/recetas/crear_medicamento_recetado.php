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
    if (!$data || !isset($data['receta_id']) || !is_array($data['medicamentos'])) {
        throw new Exception("Datos inválidos o incompletos");
    }

    $stmt = $conn->prepare("INSERT INTO medicamentos_recetados (
        receta_id, principio_activo, concentracion, presentacion, forma_farmaceutica,
        dosis, frecuencia, duracion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($data["medicamentos"] as $med) {
        $stmt->bind_param("isssssss",
            $data["receta_id"],
            $med["principio_activo"],
            $med["concentracion"],
            $med["presentacion"],
            $med["forma_farmaceutica"],
            $med["dosis"],
            $med["frecuencia"],
            $med["duracion"]
        );

        if (!$stmt->execute()) {
            throw new Exception("Error al insertar medicamento: " . $stmt->error);
        }
    }

    echo json_encode(["success" => true]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
