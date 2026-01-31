<?php
// CORS preflight
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
    if (!isset($data["paciente_id"])) {
        throw new Exception("ID de paciente requerido.");
    }

    $paciente_id = $data["paciente_id"];

    // Obtener datos del paciente una sola vez
    $stmtPaciente = $conn->prepare("SELECT id, nombre, documento_identidad, foto_url FROM pacientes WHERE id = ?");
    $stmtPaciente->bind_param("i", $paciente_id);
    $stmtPaciente->execute();
    $resPaciente = $stmtPaciente->get_result();

    if ($resPaciente->num_rows === 0) {
        throw new Exception("Paciente no encontrado.");
    }

    $infoPaciente = $resPaciente->fetch_assoc();

    // Obtener historial clínico
    $queryProcesos = "SELECT pc.*, m.nombre AS nombre_doctor, m.numero_colegiado, m.especialidad
                      FROM procesos_clinicos pc
                      JOIN medicos m ON pc.doctor_id = m.id
                      WHERE pc.paciente_id = ?
                      ORDER BY pc.fecha DESC";

    $stmtProcesos = $conn->prepare($queryProcesos);
    $stmtProcesos->bind_param("i", $paciente_id);
    $stmtProcesos->execute();
    $resultProcesos = $stmtProcesos->get_result();

    $historial = [];

    while ($proceso = $resultProcesos->fetch_assoc()) {
        $proceso_id = $proceso["id_proceso"];

        // Obtener receta si existe
        $queryReceta = "SELECT * FROM recetas_medicas WHERE proceso_id = ?";
        $stmtReceta = $conn->prepare($queryReceta);
        $stmtReceta->bind_param("i", $proceso_id);
        $stmtReceta->execute();
        $resultReceta = $stmtReceta->get_result();
        $receta = $resultReceta->fetch_assoc();

        // Obtener medicamentos si hay receta
        $medicamentos = [];
        if ($receta) {
            $receta_id = $receta["id_receta"];
            $queryMeds = "SELECT * FROM medicamentos_recetados WHERE receta_id = ?";
            $stmtMeds = $conn->prepare($queryMeds);
            $stmtMeds->bind_param("i", $receta_id);
            $stmtMeds->execute();
            $resultMeds = $stmtMeds->get_result();
            while ($med = $resultMeds->fetch_assoc()) {
                $medicamentos[] = $med;
            }
            $receta["medicamentos"] = $medicamentos;
        }

        $proceso["receta"] = $receta;
        $historial[] = $proceso;
    }

    echo json_encode([
        "success" => true,
        "paciente" => $infoPaciente,
        "historial" => $historial
    ]);

    $stmtPaciente->close();
    $stmtProcesos->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}