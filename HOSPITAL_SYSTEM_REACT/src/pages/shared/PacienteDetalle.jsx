const PacienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [historial, setHistorial] = useState([]);
  
    const userRole = sessionStorage.getItem("rol");
  
    if (userRole !== "admin" && userRole !== "Empleado") {
      return <p className="text-danger text-center mt-4">⚠ No tienes permiso para ver esta información.</p>;
    }
  
    useEffect(() => {
      fetch("/data/pacientes.json")
        .then((res) => res.json())
        .then((data) => {
          const encontrado = data.find((p) => p.id === parseInt(id));
          setPaciente(encontrado);
        });
  
      fetch("/data/historialCitas.json")
        .then((res) => res.json())
        .then((data) => {
          const historialFiltrado = data.filter((h) => h.pacienteId === parseInt(id));
          setHistorial(historialFiltrado);
        });
    }, [id]);
  
    if (!paciente) return <p className="text-center mt-4">Cargando datos del paciente...</p>;
  
    return (
      <Container className="paciente-detalle-container mt-4">
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
          ← Volver a la lista
        </Button>
  
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="mb-3">{paciente.nombre}</Card.Title>
            <p><strong>Correo:</strong> {paciente.correo}</p>
            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
            <p><strong>Fecha de Registro:</strong> {paciente.fechaRegistro}</p>
            <p><strong>Estado:</strong> {paciente.activo
              ? <Badge bg="success">Activo</Badge>
              : <Badge bg="danger">Inactivo</Badge>}</p>
          </Card.Body>
        </Card>
  
        <h4>Historial de Citas</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Doctor</th>
              <th>Especialidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((cita, idx) => (
              <tr key={idx}>
                <td>{cita.fecha}</td>
                <td>{cita.hora}</td>
                <td>{cita.doctor}</td>
                <td>{cita.especialidad}</td>
                <td>{cita.estado}</td>
              </tr>
            ))}
            {historial.length === 0 && (
              <tr><td colSpan="5" className="text-center">Sin citas registradas.</td></tr>
            )}
          </tbody>
        </Table>
      </Container>
    );
  };
  
  export default PacienteDetalle;
  