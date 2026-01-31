import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "../../styles/Configuracion.css";

const Configuracion = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión y redirigir al portal general
  const handleLogout = () => {
    sessionStorage.clear(); // Elimina toda la sesión
    navigate("/login");     // Redirige al login
  };
  

  return (
    <Container className="configuracion-container ">
      <h2 className="titulo">Configuración</h2>
      <p>Ajustes generales del sistema.</p>

      {/* Botón de Cerrar Sesión */}
      <Button className="logout-button " onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Container>
  );
};

export default Configuracion;
