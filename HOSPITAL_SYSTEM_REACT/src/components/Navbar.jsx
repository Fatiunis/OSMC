import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import "../styles/Navbar.css"; 


function NavigationBar() {
  return (
    <>
      {/* Barra superior */}
      <div className="top-bar">
        <Container className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <img src="../Imagenes/Logo.jpg" alt="Hospital Logo" height="100" />
          </Navbar.Brand>

            {/* Botón de inicio de sesión */}
            <Link to="/login" className="text-decoration-none">
                <Button className="btn-login">
                    <FaUser className="me-2 nonedeco" /> Iniciar sesión
                </Button>
            </Link>
        </Container>
      </div>

      {/* Navbar principal */}
      <Navbar expand="lg" className="main-navbar">
        <Container>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-center">
            <Nav>
              <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/faq" className="nav-link-custom">FAQ</Nav.Link>
              <Nav.Link as={Link} to="/contacto" className="nav-link-custom">Contacto</Nav.Link>
              <Nav.Link as={Link} to="/nosotros" className="nav-link-custom">Nosotros</Nav.Link>
              <Nav.Link as={Link} to="/especialidadesM" className="nav-link-custom">Especialidades</Nav.Link>
              <Nav.Link as={Link} to="/lista-medicos" className="nav-link-custom">Lista de Médicos</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
