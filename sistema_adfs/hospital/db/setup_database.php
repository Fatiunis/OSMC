<?php
require_once '../../db.php';

function ejecutarSQL($conn, $sql) {
    try {
        if ($conexion->query($sql)) {
            echo "Consulta ejecutada con éxito: " . substr($sql, 0, 50) . "...\n";
            return true;
        } else {
            echo "Error ejecutando consulta: " . $conexion->error . "\n";
            return false;
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        return false;
    }
}

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

echo "Conexión exitosa a la base de datos\n";

// Array con las consultas SQL
$queries = [
    "CREATE TABLE IF NOT EXISTS usuarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'secretaria', 'doctor', 'paciente') NOT NULL,
        estado TINYINT(1) DEFAULT 1,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS medicos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        especialidad VARCHAR(100) NOT NULL,
        numero_colegiado VARCHAR(50) NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )",
    "CREATE TABLE IF NOT EXISTS pacientes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        fecha_nacimiento DATE,
        tipo_sangre VARCHAR(5),
        alergias TEXT,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )"
];

// Ejecutar cada consulta
foreach ($queries as $sql) {
    ejecutarSQL($conn, $sql);
}

$conn->close();
echo "Proceso completado";
?>