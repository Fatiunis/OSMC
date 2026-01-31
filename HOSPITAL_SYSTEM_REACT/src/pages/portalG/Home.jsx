import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaStethoscope, FaUserMd, FaHospital, FaAmbulance } from "react-icons/fa";

function Home() {
  return (
    <Container className="mt-5 home-container">
      {/* Sección de Bienvenida */}
      <Row className="text-center">
        <Col>
          <h1 className="home-title" style={{
          fontSize: "2.5rem",
          color: "#004d00",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>Siempre a tu lado Hospital la Aurora</h1>
          <p className="home-subtitle">
            Calidad en salud y bienestar, para ti y todos los tuyos.
          </p>
          <Button className="btn-main">Ver Servicios</Button>
        </Col>
      </Row>

      {/* Sección de Servicios */}
      <Row className="mt-5">
        <Col md={3}>
          <Card className="service-card">
            <FaStethoscope className="service-icon" />
            <Card.Body>
              <Card.Title>Atención Médica</Card.Title>
              <Card.Text>Consulta con especialistas altamente capacitados.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="service-card">
            <FaUserMd className="service-icon" />
            <Card.Body>
              <Card.Title>Doctores Calificados</Card.Title>
              <Card.Text>Contamos con un equipo médico de primer nivel.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="service-card">
            <FaHospital className="service-icon" />
            <Card.Body>
              <Card.Title>Infraestructura Moderna</Card.Title>
              <Card.Text>Hospitales equipados con la última tecnología.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="service-card">
            <FaAmbulance className="service-icon" />
            <Card.Body>
              <Card.Title>Emergencias 24/7</Card.Title>
              <Card.Text>Atención inmediata en cualquier momento del día.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
