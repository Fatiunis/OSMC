import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Card, Badge } from "react-bootstrap";
import { API_BASE } from "../../config.js";

const HistorialClinico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const userRole = sessionStorage.getItem("rol");
  const userId = sessionStorage.getItem("userId");

  // Verificar acceso
  useEffect(() => {
    if (userRole !== "admin" && userId !== id) {
      navigate("/unauthorized");
      return;
    }

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

    // Cargar historial
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
  }, [id, userRole, userId, navigate]);

  const getBackPath = () => {
    return userRole === "admin" ? "/admin/pacientes" : "/paciente/perfil";
  };

  if (!paciente) return <div>Cargando...</div>;

  return (
    <div className="historial-clinico-container p-4">
      <Card className="mb-4">
        <Card.Header>
          <h4>Historial Clínico</h4>
          <h5>{paciente.nombre}</h5>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Documento:</strong> {paciente.documento_identidad}<br/>
            <strong>Tipo de Sangre:</strong> {paciente.tipo_sangre}<br/>
            <strong>Alergias:</strong> {paciente.alergias || "Ninguna registrada"}
          </div>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Doctor</th>
            <th>Diagnóstico</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((consulta) => (
            <tr key={consulta.id}>
              <td>{new Date(consulta.fecha).toLocaleDateString()}</td>
              <td>{consulta.tipo_consulta}</td>
              <td>{consulta.doctor_nombre}</td>
              <td>{consulta.diagnostico}</td>
              <td>
                <Badge bg={consulta.estado === 'Completada' ? 'success' : 'warning'}>
                  {consulta.estado}
                </Badge>
              </td>
              <td>
                {consulta.tiene_receta && (
                  <Button 
                    size="sm" 
                    variant="info" 
                    className="me-2"
                    onClick={() => navigate(`/${userRole}/recetas/${consulta.receta_id}`)}
                  >
                    Ver Receta
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => navigate(`/${userRole}/consultas/${consulta.id}`)}
                >
                  Detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button 
        variant="secondary" 
        onClick={() => navigate(getBackPath())}
        className="mt-3"
      >
        Volver
      </Button>
    </div>
  );
};

export default HistorialClinico;