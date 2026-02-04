import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserMd, FaClipboardList, FaUsers, FaChartLine } from "react-icons/fa";
import "../../styles/AdminHome.css"; 

const AdminHome = () => {
  return (
    <div className="admin-home-container">
      <Container>
        <h1 className="dashboard-title">Bienvenido, UAT 04/02/2026 Administrador </h1>
        <p className="dashboard-text">
          Aquí puedes visualizar un resumen del sistema y gestionar todas las operaciones.
        </p>
        {/* Tarjetas de estadísticas */}
        <Row className="stats-row">
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <FaUsers className="stats-icon" />
                <h5>Usuarios Registrados</h5>
                <h3>254</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <FaUserMd className="stats-icon" />
                <h5>Doctores Activos</h5>
                <h3>34</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <FaClipboardList className="stats-icon" />
                <h5>Citas Programadas</h5>
                <h3>128</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <FaChartLine className="stats-icon" />
                <h5>Reportes Generados</h5>
                <h3>78</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de actividad reciente */}
        <Row className="recent-activity">
          <Col md={6}>
            <Card className="activity-card">
              <Card.Body>
                <h5>Últimas Citas Médicas</h5>
                <ul>
                  <li>Paciente: Juan Pérez - Cardiología - 10:00 AM</li>
                  <li>Paciente: María Gómez - Pediatría - 11:30 AM</li>
                  <li>Paciente: Carlos Ramírez - Neurología - 01:00 PM</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="activity-card">
              <Card.Body>
                <h5>Últimos Usuarios Registrados</h5>
                <ul>
                  <li>Ana Martínez - Administradora</li>
                  <li>Dr. Fernando López - Cirujano</li>
                  <li>Mario Rodríguez - Paciente</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminHome;
