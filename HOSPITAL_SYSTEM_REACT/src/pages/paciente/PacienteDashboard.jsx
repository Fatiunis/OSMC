import { useEffect, useState } from "react";
import { Container, Card, Table, Badge } from "react-bootstrap";
import "../../styles/PacienteDashboard.css";

const PacienteDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cobertura, setCobertura] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Obtener información del usuario logueado
    const usuarioGuardado = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(usuarioGuardado);

    // Obtener historial de servicios
    fetch("/data/historialCitas.json")
      .then((res) => res.json())
      .then((data) => {
        const filtrado = data.filter((h) => h.pacienteId === usuarioGuardado?.id);
        setHistorial(filtrado);
      });

    // Obtener información de cobertura
    fetch("/data/cobertura.json")
      .then((res) => res.json())
      .then((data) => setCobertura(data));

    // Obtener notificaciones
    fetch("/data/notificaciones.json")
      .then((res) => res.json())
      .then((data) => setNotificaciones(data));
  }, []);

  if (!usuario) return <p className="text-center mt-4">Cargando información...</p>;

  return (
    <Container className="paciente-dashboard-container mt-4">
      <h2 className="titulo">Bienvenido, {usuario.nombre}</h2>

      {/* Estado de póliza */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5>Estado de tu Póliza</h5>
          <p><strong>Tipo:</strong> {usuario.poliza}</p>
          <p><strong>Fecha de vencimiento:</strong> {usuario.fechaVencimiento}</p>
          <p>
            <strong>Estado:</strong> 
            {usuario.pagosPendientes ? <Badge bg="danger">Pagos Pendientes</Badge> : <Badge bg="success">Al Día</Badge>}
          </p>
        </Card.Body>
      </Card>

      {/* Historial de servicios */}
      <h4>Historial de Servicios</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hospital</th>
            <th>Costo</th>
            <th>Copago</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((servicio, idx) => (
            <tr key={idx}>
              <td>{servicio.fecha}</td>
              <td>{servicio.hospital}</td>
              <td>${servicio.costo}</td>
              <td>${servicio.copago}</td>
              <td>{servicio.estado}</td>
            </tr>
          ))}
          {historial.length === 0 && (
            <tr><td colSpan="5" className="text-center">No hay servicios registrados.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Cobertura de Servicios */}
      <h4>Cobertura de Servicios</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Cubierto</th>
          </tr>
        </thead>
        <tbody>
          {cobertura.map((servicio, idx) => (
            <tr key={idx}>
              <td>{servicio.nombre}</td>
              <td>{servicio.cubierto ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Notificaciones */}
      <h4>Notificaciones</h4>
      <ul className="list-group">
        {notificaciones.map((notif, idx) => (
          <li key={idx} className={`list-group-item ${notif.tipo === "alerta" ? "list-group-item-danger" : "list-group-item-info"}`}>
            {notif.mensaje}
          </li>
        ))}
        {notificaciones.length === 0 && <li className="list-group-item">No hay notificaciones.</li>}
      </ul>
    </Container>
  );
};

export default PacienteDashboard;
