<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) throw new Exception("No se recibieron datos.");

    $correo             = trim($data['correo'] ?? '');
    $telefono           = $data['telefono'] ?? '';
    $poliza_id          = (int)($data['poliza_id'] ?? 0);
    $servicio_activo    = (int)($data['servicio_activo'] ?? 1);
    $fecha_vencimiento  = $data['fecha_vencimiento'] ?? '';
    $estado             = (int)($data['estado'] ?? 1);
    $fecha_nacimiento   = $data['fecha_nacimiento'] ?? '';
    $documento_identidad = $data['documento_identidad'] ?? '';
    $num_afiliacion     = $data['num_afiliacion'] ?? '';
    $nombre             = $data['nombre'] ?? '';

    if (!$correo || !$fecha_vencimiento || !$fecha_nacimiento || !$documento_identidad || !$num_afiliacion || !$nombre) {
        throw new Exception("Faltan campos obligatorios.");
    }

    // Verificar si el usuario existe
    $stmt = $conn->prepare("SELECT id, rol FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) throw new Exception("El usuario no existe.");
    $usuario = $res->fetch_assoc();
    $usuario_id = $usuario['id'];
    $rol = strtolower($usuario['rol']);
    $stmt->close();

    // Verificar que la póliza exista y esté activa
    $verificaPoliza = $conn->prepare("SELECT id FROM polizas WHERE id = ? AND activa = 1");
    $verificaPoliza->bind_param("i", $poliza_id);
    $verificaPoliza->execute();
    $resPoliza = $verificaPoliza->get_result();
    if ($resPoliza->num_rows === 0) throw new Exception("La póliza no es válida o está inactiva.");
    $verificaPoliza->close();

    // Actualizar datos en clientes_seguro
    $update = $conn->prepare("UPDATE clientes_seguro SET
        nombre = ?, telefono = ?, poliza_id = ?, servicio_activo = ?,
        fecha_vencimiento = ?, estado = ?, fecha_nacimiento = ?,
        documento_identidad = ?, num_afiliacion = ?
        WHERE usuario_id = ?");

    $update->bind_param("ssiisssssi",
        $nombre, $telefono, $poliza_id, $servicio_activo,
        $fecha_vencimiento, $estado, $fecha_nacimiento,
        $documento_identidad, $num_afiliacion, $usuario_id
    );

    if (!$update->execute()) {
        throw new Exception("Error al actualizar cliente: " . $update->error);
    }
    $update->close();

    // Si es paciente, actualizar también su id_seguro y tiene_seguro
    if ($rol === 'paciente') {
        $stmtPaciente = $conn->prepare("SELECT id, codigo_paciente_unico FROM pacientes WHERE usuario_id = ?");
        $stmtPaciente->bind_param("i", $usuario_id);
        $stmtPaciente->execute();
        $resPaciente = $stmtPaciente->get_result();

        if ($resPaciente->num_rows > 0) {
            $paciente = $resPaciente->fetch_assoc();
            $paciente_id = $paciente['id'];
            $codigo_actual = $paciente['codigo_paciente_unico'];

            if (strpos($codigo_actual, $num_afiliacion) === false) {
                $nuevo_codigo = $codigo_actual . '-' . $num_afiliacion;
                $updatePaciente = $conn->prepare("UPDATE pacientes SET tiene_seguro = 1, id_seguro = ?, codigo_paciente_unico = ? WHERE id = ?");
                $updatePaciente->bind_param("ssi", $num_afiliacion, $nuevo_codigo, $paciente_id);
            } else {
                $updatePaciente = $conn->prepare("UPDATE pacientes SET tiene_seguro = 1, id_seguro = ? WHERE id = ?");
                $updatePaciente->bind_param("si", $num_afiliacion, $paciente_id);
            }

            $updatePaciente->execute();
            $updatePaciente->close();
        }
        $stmtPaciente->close();
    }

    echo json_encode(["success" => true, "message" => "Cliente actualizado correctamente."]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
