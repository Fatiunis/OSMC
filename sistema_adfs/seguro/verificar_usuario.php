<?php
// Habilitar CORS correctamente para todos los métodos
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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['correo'])) {
    echo json_encode(["success" => false, "message" => "Correo no proporcionado"]);
    exit;
}

$correo = $data['correo'];
$response = ["success" => true, "usuario" => null];

// Verificar si el usuario existe
$query = "SELECT id, rol FROM usuarios WHERE correo = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode($response); // Usuario no existe
    exit;
}

$usuario = $result->fetch_assoc();
$usuario_id = $usuario['id'];
$rol = strtolower($usuario['rol']);

// Verificar si ya está registrado como cliente del seguro
$queryCheckCliente = "SELECT id FROM clientes_seguro WHERE usuario_id = ?";
$stmtCheck = $conn->prepare($queryCheckCliente);
$stmtCheck->bind_param("i", $usuario_id);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    echo json_encode([
        "success" => true,
        "usuario" => [
            "ya_es_cliente_seguro" => true,
            "rol" => $rol
        ]
    ]);
    exit;
}

// Si el rol es paciente, extraer datos de la tabla pacientes
if ($rol === "paciente") {
    $queryPaciente = "SELECT nombre, fecha_nacimiento, documento_identidad FROM pacientes WHERE usuario_id = ?";
    $stmtPaciente = $conn->prepare($queryPaciente);
    $stmtPaciente->bind_param("i", $usuario_id);
    $stmtPaciente->execute();
    $resPaciente = $stmtPaciente->get_result();

    if ($resPaciente->num_rows > 0) {
        $datosPaciente = $resPaciente->fetch_assoc();

        echo json_encode([
            "success" => true,
            "usuario" => [
                "rol" => $rol,
                "usuario_id" => $usuario_id,
                "ya_es_cliente_seguro" => false,
                "nombre" => $datosPaciente['nombre'],
                "fecha_nacimiento" => $datosPaciente['fecha_nacimiento'],
                "documento_identidad" => $datosPaciente['documento_identidad'],
                "bloquear_nombre" => true,
                "bloquear_fecha_nacimiento" => true,
                "bloquear_documento_identidad" => true,
                "bloquear_telefono" => false // porque no existe en pacientes
            ]
        ]);
        exit;
    }
}

// Si el rol no es permitido
if (in_array($rol, ['admin', 'empleado', 'doctor'])) {
    echo json_encode([
        "success" => true,
        "usuario" => [
            "rol" => $rol,
            "ya_es_cliente_seguro" => false,
            "no_permitido" => true
        ]
    ]);
    exit;
}

// Usuario válido, pero no paciente ni registrado aún
echo json_encode([
    "success" => true,
    "usuario" => [
        "rol" => $rol,
        "usuario_id" => $usuario_id,
        "ya_es_cliente_seguro" => false
    ]
]);
?>
