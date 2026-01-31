<?php
include(__DIR__ . "/../db.php");


// Datos del usuario de prueba
$nombre = "admin";
$correo = "admin@ejemplo.com";
$contrasena = password_hash("admin123", PASSWORD_DEFAULT); // Encriptación segura
$estado = 1;
$rol = "admin";

$sql = "INSERT INTO usuarios (nombre, correo, contrasena, estado, rol) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssis", $nombre, $correo, $contrasena, $estado, $rol);

if ($stmt->execute()) {
    echo "✅ Usuario de prueba creado exitosamente.";
} else {
    echo "❌ Error al crear el usuario: " . $stmt->error;
}

$conn->close();
