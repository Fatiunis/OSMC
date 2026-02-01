import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Card } from "react-bootstrap";
import { API_BASE } from "../../config.js";

const HistorialClinico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    // Cargar datos del paciente
    fetch(`${API_BASE}/hospital/pacientes/obtener_paciente_por_id.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPaciente(data.paciente);
        else console.error("Error al cargar paciente:", data.error);
      })
      .catch(err => console.error("Error al cargar paciente:", err));

    // Cargar historial clínico
    fetch(`${API_BASE}/hospital/pacientes/obtener_historial.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistorial(data.procesos || []);
        else console.error("Error al cargar historial:", data.error);
      })
      .catch(err => console.error("Error al cargar historial:", err));
  }, [id]);

  return (
    <div className="historial-clinico-container p-4">
      {paciente && (
        <Card className="mb-4">
          <Card.Header as="h5">Datos del Paciente</Card.Header>
          <Card.Body>
            <Card.Title>{paciente.nombre}</Card.Title>
            <Card.Text>
              <strong>Documento:</strong> {paciente.documento_identidad}<br/>
              <strong>Fecha de Nacimiento:</strong> {paciente.fecha_nacimiento}<br/>
              <strong>Afiliación Seguro:</strong> {paciente.num_afiliacion_seguro}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <h3>Historial Clínico</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Diagnóstico</th>
            <th>Doctor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.fecha}</td>
              <td>{registro.tipo_consulta}</td>
              <td>{registro.diagnostico}</td>
              <td>{registro.doctor_nombre}</td>
              <td>
                <Button 
                  size="sm" 
                  variant="info" 
                  className="me-2"
                  onClick={() => navigate(`/admin/consultas/${registro.id}`)}
                >
                  Ver Detalle
                </Button>
                {registro.tiene_receta && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => navigate(`/admin/recetas/${registro.receta_id}`)}
                  >
                    Ver Receta
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Button 
        variant="secondary" 
        onClick={() => navigate('/admin/pacientes')}
        className="mt-3"
      >
        Volver
      </Button>
    </div>
  );
};

export default HistorialClinico;