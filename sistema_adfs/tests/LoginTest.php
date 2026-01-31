<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../auth/login_function.php';

class LoginTest extends TestCase
{
    private $conn;

    protected function setUp(): void
    {
        $this->conn = new mysqli(
            getenv("DB_HOST"),
            getenv("DB_USER"),
            getenv("DB_PASS"),
            getenv("DB_NAME"),
            getenv("DB_PORT")
        );
        $this->conn->set_charset("utf8");
    }

    public function testLoginCorrecto()
    {
        $correo = "test@ejemplo.com"; 
        $password = "123456";        

        $resultado = autenticarUsuario($correo, $password, $this->conn);

        $this->assertTrue($resultado['success']);
        $this->assertEquals($correo, $resultado['usuario']['correo']);
    }

    public function testUsuarioInvalido()
    {
        $resultado = autenticarUsuario("noexiste@correo.com", "1234", $this->conn);

        $this->assertFalse($resultado['success']);
        $this->assertEquals("Usuario no encontrado", $resultado['message']);
    }

    public function testContrasenaIncorrecta()
    {
        $correo = "test@ejemplo.com"; // Usuario real
        $password = "123";

        $resultado = autenticarUsuario($correo, $password, $this->conn);

        $this->assertFalse($resultado['success']);
        $this->assertEquals("Contraseña incorrecta", $resultado['message']);
    }
}
