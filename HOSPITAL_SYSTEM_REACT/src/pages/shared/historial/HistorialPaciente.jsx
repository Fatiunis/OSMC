import "../../../styles/HistorialPaciente.css";
import RecetaPDF from "./RecetaPDF";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../../config.js";

const HistorialPaciente = () => {
  const { id } = useParams();
  const [procesos, setProcesos] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/hospital/pacientes/obtener_paciente_por_id.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: id })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPaciente(data.paciente);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${API_BASE}/hospital/pacientes/obtener_historial.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: id })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProcesos(data.procesos || []); //  corrección aquí
        } else {
          console.error("Error al obtener historial:", data.error);
          setProcesos([]);
        }
      })
      .catch((err) => {
        console.error("Error de red:", err);
        setProcesos([]);
      });
  }, [id]);

  const procesosFiltrados = procesos.filter(p =>
    p.detalle?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.diagnostico?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="historial-container">
      <h2>Historial Clínico</h2>

      {paciente && (
        <div className="d-flex align-items-center bg-white p-3 mb-4 shadow-sm rounded">
          <img src={paciente.foto_url} alt="Foto" className="foto-paciente me-4" />
          <div>
            <h5 className="mb-0">{paciente.nombre}</h5>
            <small><strong>ID:</strong> {paciente.id} &nbsp;&nbsp; <strong>Documento:</strong> {paciente.documento_identidad}</small>
          </div>
        </div>
      )}

      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar diagnóstico o detalle..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-aceptar">Aceptar</button>
      </div>

      {procesosFiltrados.length === 0 ? (
        <p className="text-center">No hay procesos registrados para este paciente.</p>
      ) : (
        procesosFiltrados.map((proceso, idx) => (
          <RecetaPDF key={idx} proceso={{ ...proceso, nombre_paciente: paciente?.nombre }} idx={idx} />
        ))
      )}
    </div>
  );
};

export default HistorialPaciente;
