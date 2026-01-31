<?php
include(__DIR__ . "/../cors.php");
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) throw new Exception("Datos inválidos");

    $correo = $data['correo'];
    $rol = 'doctor';
    $estado = 1;
    $usuario_id = null;

    // Verificar si ya existe el usuario
    $checkQuery = "SELECT id, estado FROM usuarios WHERE correo = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("s", $correo);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $usuarioExistente = $checkResult->fetch_assoc();
        $usuario_id = $usuarioExistente['id'];

        if ($usuarioExistente['estado'] == 0) {
            // Reactivar usuario
            $activarStmt = $conn->prepare("UPDATE usuarios SET estado = 1 WHERE id = ?");
            $activarStmt->bind_param("i", $usuario_id);
            $activarStmt->execute();
            $activarStmt->close();
        } else {
            echo json_encode(["success" => false, "error" => "El correo ya está registrado."]);
            exit;
        }
    } else {
        // Crear nuevo usuario
        $hashedPassword = password_hash('Doctor123', PASSWORD_DEFAULT);
        $insertUser = $conn->prepare("INSERT INTO usuarios (correo, contrasena, rol, estado) VALUES (?, ?, ?, ?)");
        $insertUser->bind_param("sssi", $correo, $hashedPassword, $rol, $estado);
        if (!$insertUser->execute()) throw new Exception("Error al crear usuario");
        $usuario_id = $conn->insert_id;
        $insertUser->close();
    }

    // Crear registro en tabla medicos
    $query = "INSERT INTO medicos (
        usuario_id, nombre, especialidad, fecha_graduacion, universidad,
        numero_colegiado, telefono, foto_url, titulo_url, activo, codigo_hospital
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("issssssssii",
        $usuario_id,
        $data['nombre'],
        $data['especialidad'],
        $data['fecha_graduacion'],
        $data['universidad'],
        $data['numero_colegiado'],
        $data['telefono'],
        $data['foto_url'],
        $data['titulo_url'],
        $data['activo'],
        $data['codigo_hospital']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Doctor creado correctamente."]);
    } else {
        throw new Exception("Error al insertar doctor: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
