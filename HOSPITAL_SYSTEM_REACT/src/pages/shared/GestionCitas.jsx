// src/pages/shared/GestionCitas.jsx
import { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "../../styles/GestionUsuarios.css";

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formulario, setFormulario] = useState({
    id: null,
    paciente_id: "",
    doctor_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    estado: "pendiente",
    observaciones: "",
    resultados: "",
    creada_por: "admin"
  });

  const cargarCitas = () => {
    fetch(`${API_BASE}hospital/obtener_citas.php`)
      .then(res => res.json())
      .then(setCitas)
      .catch(err => console.error("Error al cargar citas:", err));
  };

  const cargarPacientesYDoctores = () => {
    fetch(`${API_BASE}hospital/obtener_pacientes.php`)
      .then(res => res.json())
      .then(data => {
        const pacientesArray = Array.isArray(data) ? data : data?.data || [];
        setPacientes(pacientesArray);
      })
      .catch(err => {
        console.error("Error al cargar pacientes:", err);
        setPacientes([]); // evita errores si falla
      });

    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then(res => res.json())
      .then(data => {
        const doctoresArray = Array.isArray(data) ? data : data?.data || [];
        setDoctores(doctoresArray);
      })
      .catch(err => {
        console.error("Error al cargar doctores:", err);
        setDoctores([]); // evita errores si falla
      });
  };
  

  useEffect(() => {
    cargarCitas();
    cargarPacientesYDoctores();
  }, []);

  useEffect(() => {
    if (formulario.doctor_id && formulario.fecha) {
      fetch(`${API_BASE}hospital/horas_ocupadas.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: formulario.doctor_id,
          fecha: formulario.fecha
        })
      })
        .then(res => res.json())
        .then(data => {
          const ocupadas = data.map(h => h.hora_inicio);
          const hoy = new Date().toISOString().split("T")[0];
          const horaActual = new Date().toTimeString().slice(0, 5);

          const horasValidas = horarios.filter(h => {
            if (formulario.fecha === hoy) return h > horaActual;
            return true;
          });

          setHorasDisponibles(horasValidas.filter(h => !ocupadas.includes(h)));
        });
    }
  }, [formulario.doctor_id, formulario.fecha]);

  const handleShow = (cita = null) => {
    if (cita) {
      setIsEditing(true);
      setFormulario({
        ...cita,
        fecha: cita.fecha?.split("T")[0] || cita.fecha
      });
    } else {
      setIsEditing(false);
      setFormulario({
        id: null,
        paciente_id: "",
        doctor_id: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        estado: "pendiente",
        observaciones: "",
        resultados: "",
        creada_por: "admin"
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fecha") {
      const [y, m, d] = value.split("-").map(Number);
      const dia = new Date(y, m - 1, d).getDay();
      if (dia === 0 || dia === 6) {
        alert("Solo se pueden agendar citas de lunes a viernes.");
        return;
      }
    }
    setFormulario({ ...formulario, [name]: value });
  };

  const calcularFin = (inicio) => {
    const [h, m] = inicio.split(":").map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m + 30);
    return date.toTimeString().slice(0, 5);
  };

  const handleGuardar = () => {
    const fin = calcularFin(formulario.hora_inicio);
    const data = { ...formulario, hora_fin: fin };

    const url = isEditing
      ? `${API_BASE}hospital/actualizar_cita.php`
      : `${API_BASE}hospital/crear_cita.php`;

    console.log("Enviando datos al backend:", data);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        console.log("Respuesta del backend:", res);
        if (res.success) {
          handleClose();
          cargarCitas();
        } else {
          alert("Error: " + res.message);
        }
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;
    fetch(`${API_BASE}hospital/eliminar_cita.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(() => cargarCitas())
      .catch(err => console.error("Error al eliminar:", err));
  };

  const obtenerNombrePaciente = (id) => {
    if (!Array.isArray(pacientes)) return id;
    return pacientes.find(p => p.id === id)?.nombre || id;
  };
  
  const obtenerNombreDoctor = (id) => {
    if (!Array.isArray(doctores)) return id;
    return doctores.find(d => d.id === id)?.nombre || id;
  };


  return (
    <div className="gestion-usuarios-container">
      <h2 className="titulo">Gestión de Citas</h2>
      <Button variant="success" onClick={() => handleShow()}>+ Agendar Cita</Button>
      <Table className="usuarios-table mt-3">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{obtenerNombrePaciente(cita.paciente_id)}</td>
              <td>{obtenerNombreDoctor(cita.doctor_id)}</td>
              <td>{cita.fecha}</td>
              <td>{cita.hora_inicio} - {cita.hora_fin}</td>
              <td>{cita.estado}</td>
              <td>
                <Button className="btn-editar" onClick={() => handleShow(cita)}>Editar</Button>{" "}
                <Button className="btn-eliminar" onClick={() => handleEliminar(cita.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Cita" : "Agendar Cita"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Paciente</Form.Label>
              <Form.Select name="paciente_id" value={formulario.paciente_id} onChange={handleChange}>
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select name="doctor_id" value={formulario.doctor_id} onChange={handleChange}>
                <option value="">Seleccionar doctor</option>
                {doctores.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" name="fecha" value={formulario.fecha} onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Select name="hora_inicio" value={formulario.hora_inicio} onChange={handleChange}>
                <option value="">Seleccionar hora</option>
                {horasDisponibles.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control type="text" name="observaciones" value={formulario.observaciones} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionCitas;
