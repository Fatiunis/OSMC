<?php
include(__DIR__ . "/../cors.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include(__DIR__ . "/../db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    // Verificar si se recibió el ID
    if (!isset($data["id"]) || empty($data["id"])) {
        throw new Exception("Falta el ID del medicamento.");
    }

    $id = (int) $data["id"];

    // Lista de campos requeridos
    $required = [
        "codigo", "nombre", "principio_activo", "descripcion", "fotografia_url",
        "concentracion", "presentacion", "unidades", "marca",
        "en_stock", "precio", "categorias"
    ];

    $missing = [];
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === "") {
            $missing[] = $field;
        }
    }

    if (!empty($missing)) {
        throw new Exception("Faltan campos obligatorios: " . implode(", ", $missing));
    }

    // Asignar variables
    $codigo = $data["codigo"];
    $nombre = $data["nombre"];
    $principio_activo = $data["principio_activo"];
    $descripcion = $data["descripcion"];
    $foto = $data["fotografia_url"];
    $concentracion = $data["concentracion"];
    $presentacion = $data["presentacion"];
    $unidades = (int) $data["unidades"];
    $marca = $data["marca"];
    $requiere_receta = isset($data["requiere_receta"]) ? (int) $data["requiere_receta"] : 0;
    $en_stock = (int) $data["en_stock"];
    $precio = (float) $data["precio"];
    $categorias = $data["categorias"];

    $stmt = $conn->prepare("UPDATE medicamentos SET 
        codigo = ?, nombre = ?, categorias = ?, principio_activo = ?, descripcion = ?, 
        fotografia_url = ?, concentracion = ?, presentacion = ?, unidades = ?, marca = ?, 
        requiere_receta = ?, en_stock = ?, precio = ? 
        WHERE id = ?");

    $stmt->bind_param("sssssssssisidi", 
        $codigo, $nombre, $categorias, $principio_activo, $descripcion, $foto,
        $concentracion, $presentacion, $unidades, $marca, $requiere_receta, $en_stock, $precio, $id
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "✅ Medicamento actualizado correctamente."]);
    } else {
        throw new Exception("❌ Error al actualizar el medicamento: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}