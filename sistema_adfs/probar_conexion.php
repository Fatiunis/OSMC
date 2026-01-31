<?php
include("db.php");

$sql = "SELECT * FROM usuarios LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<h2>Conexión exitosa 🚀</h2>";
    echo "<p><strong>ID:</strong> " . $row['id'] . "</p>";
    echo "<p><strong>Correo:</strong> " . $row['correo'] . "</p>";
    echo "<p><strong>Rol:</strong> " . $row['rol'] . "</p>";
    echo "<p><strong>Estado:</strong> " . ($row['estado'] ? 'Activo' : 'Inactivo') . "</p>";
    echo "<p><strong>Fecha de Registro:</strong> " . $row['fecha_registro'] . "</p>";
} else {
    echo "Conexión establecida, pero no se encontraron usuarios.";
}

$conn->close();
?>
