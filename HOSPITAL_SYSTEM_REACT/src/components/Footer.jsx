import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {

  return (
    <footer style={{ backgroundColor:"#5b7f29 ", color: "#FFFFFF", padding: "40px 0" }}>
      <Container>
        <Row className="align-items-center text-center text-md-start">
          {/* Logo e información */}
          <Col md={4}>
            <h4>Hospital la Aurora</h4>
          </Col>

          {/* Información de contacto y enlaces */}
          <Col md={4}>
            <p>
              | ✉️ <a href="mailto:info@hospital.com" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                info@hospital.com
              </a>
            </p>
            <p> <a href="#" style={{ color: "#FFFFFF", textDecoration: "none" }}>Sitios Web Relacionados  </a> | 
                <a href="#" style={{ color: "#FFFFFF", textDecoration: "none" }}>Contacto  </a> | 
                <a href="#" style={{ color: "#FFFFFF", textDecoration: "none" }}>Términos de Uso </a>
            </p>
          </Col>

          {/* Redes sociales */}
          <Col md={4} className="text-md-end">
            <p>Síguenos en:</p>
            <div>
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaWhatsapp /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Línea de derechos reservados */}
      <div style={{ backgroundColor: "#39473e3b", color: "#ffff", padding: "10px 0", textAlign: "center" }}>
        <p className="mb-0">© 2025 Hospital System. Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
