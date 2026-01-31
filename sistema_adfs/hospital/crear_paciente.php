<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) throw new Exception("Datos vacíos o mal formateados");

    $correo = trim($data['correo']);
    $foto_url = $data['foto_url'] ?? '';
    $codigo_hospital = 1001;

    // Validar existencia en tabla usuarios
    $checkUser = $conn->prepare("SELECT id, rol FROM usuarios WHERE correo = ?");
    $checkUser->bind_param("s", $correo);
    $checkUser->execute();
    $resUser = $checkUser->get_result();

    $usuario_id = null;
    $rol = '';
    $estado = 1;

    if ($resUser->num_rows > 0) {
        $usuario = $resUser->fetch_assoc();
        $usuario_id = $usuario['id'];
        $rol = strtolower($usuario['rol']);

        // ❌ Bloqueo si el rol es no permitido
        if (in_array($rol, ['admin', 'empleado', 'doctor'])) {
            throw new Exception("Este usuario ya tiene un rol incompatible con 'paciente'");
        }

        // Si está inactivo, activarlo
        $activar = $conn->prepare("UPDATE usuarios SET estado = 1 WHERE id = ?");
        $activar->bind_param("i", $usuario_id);
        $activar->execute();
        $activar->close();

    } else {
        // Crear usuario
        $rol = 'paciente';
        $hashedPassword = password_hash('Paciente123', PASSWORD_DEFAULT);

        $crearUsuario = $conn->prepare("INSERT INTO usuarios (correo, contrasena, rol, estado) VALUES (?, ?, ?, ?)");
        $crearUsuario->bind_param("sssi", $correo, $hashedPassword, $rol, $estado);
        if (!$crearUsuario->execute()) throw new Exception("Error al crear usuario.");
        $usuario_id = $crearUsuario->insert_id;
        $crearUsuario->close();
    }

    // Verificar si es cliente del seguro
    $tiene_seguro = 0;
    $id_seguro = null;
    $nombre = $data['nombre'] ?? '';
    $fecha_nacimiento = $data['fecha_nacimiento'] ?? '';
    $documento_identidad = $data['documento_identidad'] ?? '';

    $verificarSeguro = $conn->prepare("SELECT num_afiliacion, nombre, fecha_nacimiento, documento_identidad FROM clientes_seguro WHERE usuario_id = ?");
    $verificarSeguro->bind_param("i", $usuario_id);
    $verificarSeguro->execute();
    $resSeguro = $verificarSeguro->get_result();

    if ($resSeguro->num_rows > 0) {
        $seguro = $resSeguro->fetch_assoc();
        $tiene_seguro = 1;
        $id_seguro = $seguro['num_afiliacion'];
        $nombre = $seguro['nombre'];
        $fecha_nacimiento = $seguro['fecha_nacimiento'];
        $documento_identidad = $seguro['documento_identidad'];
    }

    // Si se intenta marcar como tiene_seguro = 1 pero no existe en clientes_seguro
    if ($data['tiene_seguro'] == 1 && $tiene_seguro === 0) {
        throw new Exception("No se puede registrar como paciente con seguro si no está registrado en clientes_seguro.");
    }

    // Verificar si ya está registrado como paciente
    $checkPaciente = $conn->prepare("SELECT id FROM pacientes WHERE usuario_id = ?");
    $checkPaciente->bind_param("i", $usuario_id);
    $checkPaciente->execute();
    $resPaciente = $checkPaciente->get_result();

    if ($resPaciente->num_rows > 0) {
        throw new Exception("Este usuario ya está registrado como paciente.");
    }


    // Insertar paciente
    $insert = $conn->prepare("INSERT INTO pacientes (
        usuario_id, nombre, fecha_nacimiento, documento_identidad,
        tiene_seguro, foto_url, activo, codigo_hospital, codigo_paciente_unico, id_seguro
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, '', ?)");
    
    $insert->bind_param("isssisss", $usuario_id, $nombre, $fecha_nacimiento, $documento_identidad, $tiene_seguro, $foto_url, $codigo_hospital, $id_seguro);

    if (!$insert->execute()) {
        throw new Exception("Error al crear paciente: " . $insert->error);
    }

    $paciente_id = $conn->insert_id;

    // Código paciente único
    $codigo = $paciente_id . '-' . $codigo_hospital;
    if ($tiene_seguro && $id_seguro) {
        $codigo .= '-' . $id_seguro;
    }

    $updateCodigo = $conn->prepare("UPDATE pacientes SET codigo_paciente_unico = ? WHERE id = ?");
    $updateCodigo->bind_param("si", $codigo, $paciente_id);
    $updateCodigo->execute();
    $updateCodigo->close();

    echo json_encode([
        "success" => true,
        "message" => "Paciente creado con éxito.",
        "codigo" => $codigo
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
