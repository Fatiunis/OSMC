import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "../styles/PacienteSidebar.css";
import LogoutButton from "./LogoutButton";

const PacienteSidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h3>Mi Panel</h3>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/paciente/dashboard" className={location.pathname === "/paciente/dashboard" ? "active" : ""}>
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/paciente/perfil" className={location.pathname === "/paciente/perfil" ? "active" : ""}>
          Mi Perfil
        </Nav.Link>
        <Nav.Link as={Link} to="/paciente/solicitudes" className={location.pathname === "/paciente/solicitudes" ? "active" : ""}>
          Solicitudes
        </Nav.Link>
        <div className="logout-wrapper">
            <LogoutButton />
        </div>

      </Nav>
    </div>
  );
};


export default PacienteSidebar;
