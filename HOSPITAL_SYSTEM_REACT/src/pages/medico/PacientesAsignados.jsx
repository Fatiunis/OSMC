import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSessionUser } from "../../config/sessionUtils.js";
import "../../styles/PacientesAsignados.css";

const PacientesAsignados = () => {
  const [pacientes, setPacientes] = useState([]);
  const { usuario_id } = getSessionUser();

  useEffect(() => {
    fetch(`${API_BASE}hospital/citas/obtener_pacientes_asignados.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_usuario_id: usuario_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPacientes(data.pacientes);
        }
      })
      .catch(err => console.error("Error:", err));
  }, [usuario_id]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Pacientes Asignados</h2>
      {pacientes.length === 0 ? (
        <p>No hay pacientes asignados.</p>
      ) : (
        <div className="row">
          {pacientes.map((p) => (
            <div className="col-md-6" key={p.id}>
              <div className="card paciente-card shadow-sm d-flex flex-row align-items-center p-3">
                <img
                  src={p.foto_url }
                  alt={`Foto de ${p.nombre}`}
                  className="foto-paciente me-4"
                />
                <div className="flex-grow-1">
                  <h5>{p.nombre}</h5>
                  <p><strong>ID:</strong> {p.id}</p>
                  <p><strong>Documento:</strong> {p.documento_identidad}</p>
                  <Link
                    to={`/medico/historial/${p.id}`}
                    className="btn btn-ver-historial mt-2"
                  >
                    Ver Historial
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PacientesAsignados;
