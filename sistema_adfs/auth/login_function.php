<?php
include(__DIR__ . '/../db.php');

function autenticarUsuario($correo, $password, $conn) {
    $sql = "SELECT * FROM usuarios WHERE correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $usuario = $result->fetch_assoc();

        if (password_verify($password, $usuario['contrasena'])) {
            if ($usuario['estado'] == 1) {
                return [
                    "success" => true,
                    "usuario" => [
                        "id" => $usuario['id'],
                        "correo" => $usuario['correo'],
                        "rol" => $usuario['rol']
                    ]
                ];
            } else {
                return ["success" => false, "message" => "Usuario inactivo"];
            }
        } else {
            return ["success" => false, "message" => "Contraseña incorrecta"];
        }
    } else {
        return ["success" => false, "message" => "Usuario no encontrado"];
    }
}
