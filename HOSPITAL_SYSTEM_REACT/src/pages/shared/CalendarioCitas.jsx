import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../../styles/Calendario.css";
import { API_BASE } from "../../config.js";


const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

// ✅ Siempre usar Date real y neutral
const esFinDeSemana = (fechaStr) => {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const dia = new Date(y, m - 1, d).getDay();
  return dia === 0 || dia === 6;
};

const esFechaPasada = (fechaStr) => {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const hoy = new Date();
  const fecha = new Date(y, m - 1, d);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
};

const CalendarioCitas = () => {
  const [eventos, setEventos] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  const fetchCitas = () => {
    fetch(`${API_BASE}hospital/obtener_citas.php`)
      .then(res => res.json())
      .then(data => {
        const eventosTransformados = data.map(cita => ({
          ...cita,
          title: `Paciente ${cita.paciente_id} - Doctor ${cita.doctor_id}`,
          start: new Date(`${cita.fecha}T${cita.hora_inicio}`),
          end: new Date(`${cita.fecha}T${cita.hora_fin}`),
        }));
        setEventos(eventosTransformados);
      });
  };

  const cargarPacientesYDoctores = () => {
    fetch(`${API_BASE}hospital/obtener_pacientes.php`)
      .then(res => res.json())
      .then(data => {
        const pacientesArray = Array.isArray(data.paciente) ? data.paciente : [];
        setPacientes(pacientesArray);
      })
      .catch(err => {
        console.error("Error al cargar pacientes:", err);
        setPacientes([]);
      });

    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then(res => res.json())
      .then(data => {
        const doctoresArray = Array.isArray(data.doctor) ? data.doctor : [];
        setDoctores(doctoresArray);
      })
      .catch(err => {
        console.error("Error al cargar doctores:", err);
        setDoctores([]);
      });
  };  
  

  useEffect(() => {
    fetchCitas();
    cargarPacientesYDoctores();
  }, []);

  useEffect(() => {
    if (citaSeleccionada?.doctor_id && citaSeleccionada?.fecha) {
      fetch(`${API_BASE}hospital/horas_ocupadas.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: citaSeleccionada.doctor_id,
          fecha: citaSeleccionada.fecha
        })
      })
        .then(res => res.json())
        .then(data => {
          const ocupadas = data.map(h => h.hora_inicio);
          const hoy = new Date().toISOString().split("T")[0];
          const horaActual = new Date().toTimeString().slice(0, 5);
          const horasValidas = horarios.filter(h => {
            if (citaSeleccionada.fecha === hoy) return h > horaActual;
            return true;
          });
          setHorasDisponibles(horasValidas.filter(h => !ocupadas.includes(h)));
        });
    }
  }, [citaSeleccionada?.doctor_id, citaSeleccionada?.fecha]);

  const handleSelectEvent = (evento) => {
    setCitaSeleccionada({
      ...evento,
      fecha: evento.fecha?.split("T")[0] || evento.fecha,
    });
    setModalAbierto(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const fechaLocal = slotInfo.start.toISOString().split("T")[0];

    if (esFechaPasada(fechaLocal)) {
      alert("No se pueden agendar citas en fechas pasadas.");
      return;
    }

    if (esFinDeSemana(fechaLocal)) {
      alert("No se pueden agendar citas en fin de semana.");
      return;
    }

    setCitaSeleccionada({
      id: null,
      paciente_id: "",
      doctor_id: "",
      fecha: fechaLocal,
      hora_inicio: "",
      hora_fin: "",
      estado: "pendiente",
      observaciones: "",
      resultados: "",
      creada_por: "admin"
    });
    setModalAbierto(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitaSeleccionada(prev => ({ ...prev, [name]: value }));
  };

  const calcularHoraFin = (inicio) => {
    const [h, m] = inicio.split(":").map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m + 30);
    return date.toTimeString().slice(0, 5);
  };

  const handleGuardar = () => {
    const fecha = citaSeleccionada.fecha;
  
    if (!citaSeleccionada.paciente_id || !citaSeleccionada.doctor_id) {
      alert("Por favor, selecciona un paciente y un doctor.");
      return;
    }
  
    if (esFechaPasada(fecha)) {
      alert("No se pueden guardar citas en fechas pasadas.");
      return;
    }
  
    if (esFinDeSemana(fecha)) {
      alert("Las citas solo pueden agendarse de lunes a viernes.");
      return;
    }
  
    const fin = calcularHoraFin(citaSeleccionada.hora_inicio);
    const data = {
      ...citaSeleccionada,
      hora_fin: fin
    };
  
    const url = citaSeleccionada.id
      ? `${API_BASE}hospital/actualizar_cita.php`
      : `${API_BASE}hospital/crear_cita.php`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setModalAbierto(false);
          fetchCitas();
        } else {
          alert("Error: " + res.message);
        }
      });
  };

  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState("month");

  return (
    <div className="calendario-container">
      <h2 className="titulo text-center">Calendario de Citas</h2>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={["month", "day"]}
        view={vista}
        date={fechaActual}
        onView={setVista}
        onNavigate={setFechaActual}
        style={{ height: 600 }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        messages={{
          month: "Mes", day: "Día", today: "Hoy", next: "Siguiente", previous: "Anterior"
        }}
      />

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{citaSeleccionada?.id ? "Editar Cita" : "Nueva Cita"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Paciente</Form.Label>
              <Form.Select name="paciente_id" value={citaSeleccionada?.paciente_id || ""} onChange={handleChange}>
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Doctor</Form.Label>
              <Form.Select name="doctor_id" value={citaSeleccionada?.doctor_id || ""} onChange={handleChange}>
                <option value="">Seleccionar doctor</option>
                {doctores.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" name="fecha" value={citaSeleccionada?.fecha || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Hora Inicio</Form.Label>
              <Form.Select name="hora_inicio" value={citaSeleccionada?.hora_inicio || ""} onChange={handleChange}>
                <option value="">Seleccionar hora</option>
                {horasDisponibles.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control type="text" name="observaciones" value={citaSeleccionada?.observaciones || ""} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>        
          <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarioCitas;
