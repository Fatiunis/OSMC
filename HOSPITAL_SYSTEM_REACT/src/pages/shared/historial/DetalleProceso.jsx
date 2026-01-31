import React from "react";

const DetalleProceso = ({ proceso }) => {
  return (
    <div className="mb-3">
      <h5 className="mb-2 text-success">
        🩺 Proceso del <span className="text-dark">{proceso.fecha}</span>
      </h5>
      <p><strong>Detalle:</strong> {proceso.detalle}</p>
      <p><strong>Doctor:</strong> {proceso.nombre_doctor} <em>({proceso.especialidad})</em></p>
      <p><strong>N° de colegiado:</strong> {proceso.numero_colegiado}</p>
      <p><strong>Diagnóstico:</strong> {proceso.diagnostico || "No disponible"}</p>
      <p><strong>Forma de Pago:</strong> {proceso.forma_pago}</p>
      <p><strong>Costo:</strong> Q{parseFloat(proceso.costo).toFixed(2)}</p>
      {proceso.aprobacion_seguro && (
        <p><strong>Aprobación del Seguro:</strong> {proceso.aprobacion_seguro}</p>
      )}
      {proceso.resultados_url && (
        <div className="mt-3">
          <strong>Resultado clínico:</strong>
          <div>
            <img
              src={proceso.resultados_url}
              alt="Resultados clínicos"
              className="img-fluid mt-2"
              style={{
                maxHeight: "300px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleProceso;
