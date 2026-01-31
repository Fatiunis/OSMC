import { Container, Row, Col, Card } from "react-bootstrap";
import { FaStethoscope, FaHeartbeat, FaBrain, FaXRay, FaUserMd, FaLungs, FaTeeth, FaBaby } from "react-icons/fa"; // Íconos de especialidades

function EspecialidadesM() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <div style={{
        maxWidth: "1100px",
        width: "100%",
        background: "#fff",
        padding: "50px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}>

        {/* Título con el mismo estilo que "Siempre a tu lado" */}
        <h1 className="text-center fw-bold" style={{
          fontSize: "2.5rem",
          color: "#004d00",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>
          Especialidades Médicas
        </h1>

        <p className="text-center" style={{ marginBottom: "30px" }}>
          Nuestro hospital ofrece una variedad de especialidades médicas con los mejores profesionales y tecnología avanzada.
        </p>

        {/* Grid de especialidades */}
        <Row>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaStethoscope size={50} color="#008000" className="mb-3"/>
              <Card.Title>Medicina General</Card.Title>
              <Card.Text>Consulta médica integral para adultos y niños.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaHeartbeat size={50} color="#008000" className="mb-3"/>
              <Card.Title>Cardiología</Card.Title>
              <Card.Text>Diagnóstico y tratamiento de enfermedades del corazón.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaBrain size={50} color="#008000" className="mb-3"/>
              <Card.Title>Neurología</Card.Title>
              <Card.Text>Tratamiento de trastornos del sistema nervioso.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaXRay size={50} color="#008000" className="mb-3"/>
              <Card.Title>Radiología</Card.Title>
              <Card.Text>Imágenes médicas para diagnóstico preciso.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaUserMd size={50} color="#008000" className="mb-3"/>
              <Card.Title>Oncología</Card.Title>
              <Card.Text>Diagnóstico y tratamiento del cáncer.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaLungs size={50} color="#008000" className="mb-3"/>
              <Card.Title>Neumología</Card.Title>
              <Card.Text>Enfermedades del sistema respiratorio.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaTeeth size={50} color="#008000" className="mb-3"/>
              <Card.Title>Odontología</Card.Title>
              <Card.Text>Atención y prevención de la salud bucal.</Card.Text>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="text-center p-4 shadow-sm">
              <FaBaby size={50} color="#008000" className="mb-3"/>
              <Card.Title>Pediatría</Card.Title>
              <Card.Text>Atención médica especializada para niños.</Card.Text>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default EspecialidadesM;
