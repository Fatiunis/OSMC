import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/Calendario.css";
import "../../styles/BotonesHospital.css"; 

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AgendaMedico = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState("month");
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const usuarioId = usuario?.id;
  
    if (!usuarioId) {
      console.error("No se encontró el ID de usuario en sesión.");
      return;
    }

    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then((res) => res.json())
      .then((data) => {
        const doctores = Array.isArray(data.doctor) ? data.doctor : [];
        const doctor = doctores.find(d => parseInt(d.usuario_id) === parseInt(usuarioId));      
  
        if (!doctor) {
          console.warn("No se encontró ningún médico con este usuario.");
          return;
        }
  
        const doctorId = doctor.id;
        console.log("Doctor encontrado con ID:", doctorId);
  
        fetch(`${API_BASE}hospital/obtener_citas.php`)
          .then((res) => res.json())
          .then((citas) => {
            const citasDoctor = citas.filter(
              (cita) => parseInt(cita.doctor_id) === parseInt(doctorId)
            );
  
            const eventosFormateados = citasDoctor.map((cita) => ({
              id: cita.id,
              title: `Paciente ${cita.paciente_id}`,
              start: new Date(`${cita.fecha}T${cita.hora_inicio}`),
              end: new Date(`${cita.fecha}T${cita.hora_fin}`),
              paciente_id: cita.paciente_id,
              fecha: cita.fecha,
              hora_inicio: cita.hora_inicio,
              hora_fin: cita.hora_fin,
              estado: cita.estado
            }));
  
            setEventos(eventosFormateados);
          })
          .catch((err) => console.error("Error al obtener citas:", err));
      })
      .catch((err) => console.error("Error al obtener doctores:", err));
  }, []);

  return (
    <Card className="p-4 calendario-container">
      <h2 className="text-success mb-4">Agenda de Citas del Médico</h2>

      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day", "agenda"]}
        view={vista}
        date={fechaActual}
        onView={(nuevaVista) => setVista(nuevaVista)}
        onNavigate={(nuevaFecha) => setFechaActual(nuevaFecha)}
        messages={{
          today: "Hoy",
          previous: "Atrás",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
        onSelectEvent={(evento) => {
          setEventoSeleccionado(evento);
          setMostrarModal(true);
        }}
      />

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded shadow-sm p-3">
          {eventoSeleccionado && (
            <>
              <div className="mb-3">
                <p><strong className="text-success">Paciente ID:</strong> {eventoSeleccionado.paciente_id}</p>
                <p><strong className="text-success">Fecha:</strong> {eventoSeleccionado.fecha}</p>
                <p><strong className="text-success">Hora Inicio:</strong> {eventoSeleccionado.hora_inicio}</p>
                <p><strong className="text-success">Hora Fin:</strong> {eventoSeleccionado.hora_fin}</p>
              </div>
              <div className="d-flex justify-content-between">
                <Button
                  className="btn-hospital-warning"
                  onClick={() => {
                    navigate(`/medico/historial/${eventoSeleccionado.paciente_id}`);
                    setMostrarModal(false);
                  }}
                >
                  Ver Historial del Paciente
                </Button>
                <Button
                  className="btn-hospital-primary"
                  onClick={() => {
                    navigate(`/medico/finalizar-cita/${eventoSeleccionado.id}`);
                    setMostrarModal(false);
                  }}
                >
                  Finalizar Cita
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AgendaMedico;
