<?php
// Mostrar errores en desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Manejo de preflight CORS
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
    if (!$data) throw new Exception("Datos no válidos");

    $correo            = trim($data['correo'] ?? '');
    $contrasena        = trim($data['contrasena'] ?? '');
    $telefono          = $data['telefono'] ?? '';
    $poliza_id         = (int)($data['poliza_id'] ?? 0);
    $servicio_activo   = (int)($data['servicio_activo'] ?? 1);
    $fecha_vencimiento = $data['fecha_vencimiento'] ?? '';
    $estado            = (int)($data['estado'] ?? 1);
    $num_afiliacion    = $data['num_afiliacion'] ?? '';

    if (!$correo || !$fecha_vencimiento || !$num_afiliacion) {
        throw new Exception("Faltan campos obligatorios.");
    }

    $stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmtCheck->bind_param("s", $correo);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    $usuarioExiste = $resultCheck->num_rows > 0;
    $stmtCheck->close();

    if (!$usuarioExiste && (!$contrasena || $contrasena[0] !== 'S')) {
        throw new Exception("La contraseña debe comenzar con la letra 'S'.");
    }

    $hash = password_hash($contrasena, PASSWORD_DEFAULT);
    $usuario_id = null;
    $nombre = '';
    $fecha_nacimiento = '';
    $documento_identidad = '';
    $paciente_id = null;

    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT id, rol FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuarioExiste = $result->num_rows > 0;

    if ($usuarioExiste) {
        $row = $result->fetch_assoc();
        $usuario_id = $row['id'];
        $rol = strtolower($row['rol']);

        if (in_array($rol, ['admin', 'empleado', 'doctor', 'clienteseguro'])) {
            throw new Exception("Este correo ya pertenece a otro tipo de usuario.");
        }

        if ($rol === 'paciente') {
            $stmtPaciente = $conn->prepare("SELECT nombre, fecha_nacimiento, documento_identidad FROM pacientes WHERE usuario_id = ?");
            $stmtPaciente->bind_param("i", $usuario_id);
            $stmtPaciente->execute();
            $resPaciente = $stmtPaciente->get_result();

            if ($resPaciente->num_rows > 0) {
                $paciente = $resPaciente->fetch_assoc();
                $nombre = $paciente['nombre'];
                $fecha_nacimiento = $paciente['fecha_nacimiento'];
                $documento_identidad = $paciente['documento_identidad'];

                $stmtDatosPaciente = $conn->prepare("SELECT id, codigo_paciente_unico FROM pacientes WHERE usuario_id = ?");
                $stmtDatosPaciente->bind_param("i", $usuario_id);
                $stmtDatosPaciente->execute();
                $resDatos = $stmtDatosPaciente->get_result();

                if ($resDatos->num_rows > 0) {
                    $p = $resDatos->fetch_assoc();
                    $paciente_id = $p['id'];
                    $codigo_actual = $p['codigo_paciente_unico'];

                    if (strpos($codigo_actual, $num_afiliacion) === false) {
                        $nuevo_codigo = $codigo_actual . '-' . $num_afiliacion;
                        $update = $conn->prepare("UPDATE pacientes SET tiene_seguro = 1, codigo_paciente_unico = ?, id_seguro = ? WHERE id = ?");
                        $update->bind_param("ssi", $nuevo_codigo, $num_afiliacion, $paciente_id);
                        $update->execute();
                        $update->close();
                    } else {
                        $update = $conn->prepare("UPDATE pacientes SET tiene_seguro = 1, id_seguro = ? WHERE id = ?");
                        $update->bind_param("si", $num_afiliacion, $paciente_id);
                        $update->execute();
                        $update->close();
                    }
                }
                $stmtDatosPaciente->close();
            } else {
                throw new Exception("El usuario tiene rol paciente pero no tiene datos registrados.");
            }
        }
    } else {
        $rol = 'clienteseguro';
        $stmtNuevo = $conn->prepare("INSERT INTO usuarios (correo, contrasena, rol, estado, fecha_registro) VALUES (?, ?, ?, ?, NOW())");
        $stmtNuevo->bind_param("sssi", $correo, $hash, $rol, $estado);
        if (!$stmtNuevo->execute()) throw new Exception("Error al crear usuario.");
        $usuario_id = $stmtNuevo->insert_id;
        $stmtNuevo->close();

        $nombre = $data['nombre'] ?? '';
        $fecha_nacimiento = $data['fecha_nacimiento'] ?? '';
        $documento_identidad = $data['documento_identidad'] ?? '';
        if (!$nombre || !$fecha_nacimiento || !$documento_identidad) {
            throw new Exception("Faltan datos personales para nuevo usuario.");
        }
    }

    $verificaPoliza = $conn->prepare("SELECT id FROM polizas WHERE id = ? AND activa = 1");
    $verificaPoliza->bind_param("i", $poliza_id);
    $verificaPoliza->execute();
    $resPoliza = $verificaPoliza->get_result();
    if ($resPoliza->num_rows === 0) throw new Exception("La póliza seleccionada no es válida o está inactiva.");
    $verificaPoliza->close();

    $insert = $conn->prepare("INSERT INTO clientes_seguro (
        usuario_id, nombre, telefono, poliza_id, servicio_activo,
        fecha_vencimiento, estado, fecha_registro,
        fecha_nacimiento, documento_identidad, num_afiliacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)");

    $insert->bind_param("issiisssss",
        $usuario_id, $nombre, $telefono, $poliza_id, $servicio_activo,
        $fecha_vencimiento, $estado,
        $fecha_nacimiento, $documento_identidad, $num_afiliacion
    );

    if (!$insert->execute()) {
        throw new Exception("Error al registrar cliente del seguro: " . $insert->error);
    }

    $insert->close();

    echo json_encode(["success" => true, "message" => "Cliente registrado con éxito."]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>