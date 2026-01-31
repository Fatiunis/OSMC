import React from "react";

const DetalleReceta = ({ receta }) => {
  if (!receta) return null;

  return (
    <div className="mt-3">
      <h6>📄 Receta Médica</h6>
      <p><strong>Código:</strong> {receta.codigo_receta}</p>
      <p><strong>Diagnóstico:</strong> {receta.diagnostico}</p>
      <p><strong>Anotaciones:</strong> {receta.anotaciones}</p>
      <p><strong>Comentarios:</strong> {receta.comentarios}</p>
      <p><strong>Notas Especiales:</strong> {receta.notas_especiales || "N/A"}</p>

      <h6 className="mt-2">💊 Medicamentos Recetados</h6>
      {receta.medicamentos?.length > 0 ? (
        <ul>
          {receta.medicamentos.map((med, idx) => (
            <li key={idx}>
              <strong>{med.principio_activo}</strong> – {med.concentracion}, {med.presentacion}, {med.forma_farmaceutica}.<br />
              <em>Dosis:</em> {med.dosis} | <em>Frecuencia:</em> {med.frecuencia} | <em>Duración:</em> {med.duracion}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay medicamentos registrados.</p>
      )}
    </div>
  );
};

export default DetalleReceta;
