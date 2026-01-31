<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/db_config.php';

try {
    $query = "DESCRIBE usuarios";
    $result = $conexion->query($query);
    
    echo "Estructura de la tabla usuarios:<br>";
    while ($row = $result->fetch_array()) {
        echo $row['Field'] . " - " . $row['Type'] . "<br>";
    }

    echo "<br>Primeros 5 usuarios (solo correo y rol):<br>";
    $query = "SELECT correo, rol FROM usuarios LIMIT 5";
    $result = $conexion->query($query);
    while ($row = $result->fetch_array()) {
        echo "Correo: " . $row['correo'] . " - Rol: " . $row['rol'] . "<br>";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>