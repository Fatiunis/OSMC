<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['correo'])) {
    echo json_encode(["success" => false, "message" => "Correo no proporcionado"]);
    exit;
}

$correo = trim($data['correo']);
$response = ["success" => true, "usuario" => null];

$stmtUser = $conn->prepare("SELECT id, rol FROM usuarios WHERE correo = ?");
$stmtUser->bind_param("s", $correo);
$stmtUser->execute();
$resUser = $stmtUser->get_result();

if ($resUser->num_rows === 0) {
    echo json_encode($response); // Usuario no existe
    exit;
}

$usuario = $resUser->fetch_assoc();
$usuario_id = $usuario['id'];
$rol = strtolower($usuario['rol']);

// Si el rol no es permitido para pacientes
if (in_array($rol, ['admin', 'empleado', 'doctor'])) {
    echo json_encode([
        "success" => true,
        "usuario" => [
            "rol" => $rol,
            "no_permitido" => true
        ]
    ]);
    exit;
}

// Si es cliente del seguro
$stmtSeguro = $conn->prepare("SELECT nombre, fecha_nacimiento, documento_identidad, num_afiliacion FROM clientes_seguro WHERE usuario_id = ?");
$stmtSeguro->bind_param("i", $usuario_id);
$stmtSeguro->execute();
$resSeguro = $stmtSeguro->get_result();

if ($resSeguro->num_rows > 0) {
    $cliente = $resSeguro->fetch_assoc();

    echo json_encode([
        "success" => true,
        "usuario" => [
            "rol" => "clienteseguro",
            "datos_cliente" => [
                "nombre" => $cliente['nombre'],
                "fecha_nacimiento" => $cliente['fecha_nacimiento'],
                "documento_identidad" => $cliente['documento_identidad'],
                "num_afiliacion" => $cliente['num_afiliacion']
            ]
        ]
    ]);
    exit;
}

// Si el usuario es paciente (ya registrado pero sin seguro)
$stmtPaciente = $conn->prepare("SELECT nombre, fecha_nacimiento, documento_identidad FROM pacientes WHERE usuario_id = ?");
$stmtPaciente->bind_param("i", $usuario_id);
$stmtPaciente->execute();
$resPaciente = $stmtPaciente->get_result();

if ($resPaciente->num_rows > 0) {
    $paciente = $resPaciente->fetch_assoc();

    echo json_encode([
        "success" => true,
        "usuario" => [
            "rol" => "paciente",
            "datos_cliente" => [
                "nombre" => $paciente['nombre'],
                "fecha_nacimiento" => $paciente['fecha_nacimiento'],
                "documento_identidad" => $paciente['documento_identidad']
            ]
        ]
    ]);
    exit;
}

// Usuario válido pero sin datos adicionales
echo json_encode([
    "success" => true,
    "usuario" => [
        "rol" => $rol
    ]
]);
