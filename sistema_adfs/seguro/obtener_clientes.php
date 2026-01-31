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

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$sql = "SELECT 
            cs.id,
            u.correo,
            u.rol,
            cs.nombre,
            cs.telefono,
            cs.poliza_id,
            p.nombre AS nombre_poliza,
            cs.fecha_vencimiento,
            cs.fecha_nacimiento,
            cs.documento_identidad,
            cs.num_afiliacion,
            cs.servicio_activo,
            cs.estado
        FROM clientes_seguro cs
        INNER JOIN usuarios u ON cs.usuario_id = u.id
        INNER JOIN polizas p ON cs.poliza_id = p.id
        ORDER BY cs.id DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Error en la consulta", "error" => $conn->error]);
    exit;
}

$clientes = [];

while ($row = $result->fetch_assoc()) {
    $clientes[] = [
        "id" => $row["id"],
        "correo" => $row["correo"],
        "rol" => strtolower($row["rol"]), // ✅ Asegura que esté en minúscula para comparaciones
        "nombre" => $row["nombre"],
        "telefono" => $row["telefono"],
        "poliza_id" => $row["poliza_id"],
        "nombre_poliza" => $row["nombre_poliza"],
        "fecha_vencimiento" => $row["fecha_vencimiento"],
        "fecha_nacimiento" => $row["fecha_nacimiento"],
        "documento_identidad" => $row["documento_identidad"],
        "num_afiliacion" => $row["num_afiliacion"],
        "servicio_activo" => $row["servicio_activo"],
        "estado" => $row["estado"]
    ];
}

echo json_encode(["success" => true, "clientes" => $clientes]);
$conn->close();
?>
