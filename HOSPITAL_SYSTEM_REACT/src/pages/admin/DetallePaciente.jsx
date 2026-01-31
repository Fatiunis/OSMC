import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const DetallePaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/Proyecto_ADFS_BD/sistema_adfs/obtener_paciente.php?id=${id}`)
      .then(res => res.json())
      .then(data => setPaciente(data))
      .catch(err => console.error("Error al cargar paciente:", err));
  }, [id]);

  if (!paciente) return <div>Cargando...</div>;

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h4">Detalle del Paciente</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Información Personal</h5>
              <p><strong>Nombre:</strong> {paciente.nombre}</p>
              <p><strong>Correo:</strong> {paciente.correo}</p>
              <p><strong>Fecha de Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
              <p><strong>Documento:</strong> {paciente.documento_identidad}</p>
            </Col>
            <Col md={6}>
              <h5>Información Médica</h5>
              <p><strong>Número de Afiliación:</strong> {paciente.num_afiliacion_seguro}</p>
              <p><strong>Estado:</strong> 
                <span className={paciente.activo ? "text-success" : "text-danger"}>
                  {paciente.activo ? " Activo" : " Inactivo"}
                </span>
              </p>
              <p><strong>Tipo de Sangre:</strong> {paciente.tipo_sangre}</p>
              <p><strong>Alergias:</strong> {paciente.alergias || "Ninguna registrada"}</p>
            </Col>
          </Row>
          <div className="mt-3">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => navigate(`/admin/pacientes/${id}/historial`)}
            >
              Ver Historial Clínico
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/admin/pacientes")}
            >
              Volver
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetallePaciente;