import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup, FormControl } from "react-bootstrap";
import "../../styles/GestionUsuarios.css";

const GestionDoctores = () => {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showDetalle, setShowDetalle] = useState(false);
  const [doctorDetalle, setDoctorDetalle] = useState(null);

  const [doctorSeleccionado, setDoctorSeleccionado] = useState({
    id: null,
    nombre: "",
    correo: "",
    especialidad: "",
    fecha_graduacion: "",
    universidad: "",
    numero_colegiado: "",
    telefono: "",
    foto_url: "",
    titulo_url: "",
    activo: 1,
    codigo_hospital: 1001
  });

  const cargarDoctores = () => {
    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const doctoresOdenados = data.doctor.sort((a, b) => b.id - a.id);
          setDoctores(doctoresOdenados);
        } else {
          console.error("Error cargando doctores:", data.message);
        }
      })
      .catch(err => console.error("Error al conectar:", err));
  };


  const cargarEspecialidades = () => {
    fetch(`${API_BASE}hospital/obtener_especialidades.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEspecialidades(data.especialidades);
      })
      .catch(err => console.error("Error al cargar especialidades:", err));
  };

  useEffect(() => {
    cargarDoctores();
    cargarEspecialidades();
  }, []);

  const handleShow = (doctor = null) => {
    if (doctor) {
      setIsEditing(true);
      setDoctorSeleccionado(doctor);
    } else {
      setIsEditing(false);
      setDoctorSeleccionado({
        id: null,
        nombre: "",
        correo: "",
        especialidad: "",
        fecha_graduacion: "",
        universidad: "",
        numero_colegiado: "",
        telefono: "",
        foto_url: "",
        titulo_url: "",
        activo: 1,
        codigo_hospital: 1001
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setDoctorSeleccionado({ ...doctorSeleccionado, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    const camposObligatorios = [
      "nombre", "correo", "especialidad", "fecha_graduacion",
      "universidad", "numero_colegiado", "telefono",
      "foto_url", "titulo_url"
    ];

    for (const campo of camposObligatorios) {
      if (!doctorSeleccionado[campo]) {
        alert("Por favor complete el campo: " + campo.replace("_", " "));
        return;
      }
    }

    const url = isEditing
      ? `${API_BASE}hospital/actualizar_doctor.php`
      : `${API_BASE}hospital/crear_doctor.php`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorSeleccionado),
    })
      .then(async res => {
        const text = await res.text();
        console.log("RESPUESTA CRUDA:", text);
        try {
          const json = JSON.parse(text);
          return json;
        } catch (e) {
          console.error("No se pudo parsear como JSON", e);
          throw new Error("Respuesta no válida del servidor");
        }
      })
      .then(() => {
        handleClose();
        cargarDoctores();
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este doctor?")) return;
    fetch(`${API_BASE}hospital/eliminar_doctor.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(() => cargarDoctores())
      .catch(err => console.error("Error al eliminar:", err));
  };

  const doctoresFiltrados = doctores.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gestion-usuarios-container">
      <h2 className="titulo">Gestión de Doctores</h2>

      <div className="d-flex justify-content-between mb-3 mt-2">
        <Button variant="success" onClick={() => handleShow()}>+ Agregar Doctor</Button>

        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Buscar por nombre o especialidad"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table className="usuarios-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Colegiado</th>
            <th>Universidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctoresFiltrados.map((d) => (
            <tr key={d.id}>
              <td><img src={d.foto_url} alt="foto" width="40" height="40" style={{ borderRadius: '50%' }} /></td>
              <td>{d.nombre}</td>
              <td>{d.especialidad}</td>
              <td>{d.numero_colegiado}</td>
              <td>{d.universidad}</td>
              <td>
                <Button className="btn-editar" onClick={() => handleShow(d)}>Editar</Button>{" "}
                <Button className="btn-detalles" variant="info" onClick={() => { setDoctorDetalle(d); setShowDetalle(true); }}>Ver Detalles</Button>{" "}
                <Button className="btn-eliminar" onClick={() => handleEliminar(d.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Doctor" : "Agregar Doctor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ESPECIALIDAD</Form.Label>
              <Form.Select
                name="especialidad"
                value={doctorSeleccionado.especialidad}
                onChange={handleChange}
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((e) => (
                  <option key={e.id} value={e.nombre}>{e.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CORREO</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={doctorSeleccionado.correo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {["nombre", "fecha_graduacion", "universidad", "numero_colegiado", "telefono", "foto_url", "titulo_url"].map(field => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replaceAll("_", " ").toUpperCase()}</Form.Label>
                <Form.Control
                  type={field === "fecha_graduacion" ? "date" : "text"}
                  name={field}
                  value={doctorSeleccionado[field]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Activo?"
                name="activo"
                checked={doctorSeleccionado.activo === 1}
                onChange={(e) =>
                  setDoctorSeleccionado({
                    ...doctorSeleccionado,
                    activo: e.target.checked ? 1 : 0,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Detalles */}
      <Modal show={showDetalle} onHide={() => setShowDetalle(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {doctorDetalle && (
            <>
              <p><strong>Nombre:</strong> {doctorDetalle.nombre}</p>
              <p><strong>Correo:</strong> {doctorDetalle.correo}</p>
              <p><strong>Especialidad:</strong> {doctorDetalle.especialidad}</p>
              <p><strong>Colegiado:</strong> {doctorDetalle.numero_colegiado}</p>
              <p><strong>Universidad:</strong> {doctorDetalle.universidad}</p>
              <p><strong>Fecha de Graduación:</strong> {doctorDetalle.fecha_graduacion}</p>
              <p><strong>Teléfono:</strong> {doctorDetalle.telefono}</p>
              <div style={{ textAlign: 'center' }}>
                <h6>Fotografía del Doctor</h6>
                <img src={doctorDetalle.foto_url} alt="Foto del doctor" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                <h6 className="mt-3">Título Profesional</h6>
                <img src={doctorDetalle.titulo_url} alt="Título del doctor" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalle(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionDoctores;
