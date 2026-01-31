import html2pdf from "html2pdf.js";
import "../../../styles/HistorialPaciente.css";

const RecetaPDF = ({ proceso, idx }) => {
  const exportarUnaReceta = () => {
    const element = document.getElementById(`receta-pdf-${idx}`);
    const opt = {
      margin: 0.5,
      filename: `Receta_${proceso.receta?.nombre_paciente || proceso.nombre_paciente}_${proceso.fecha}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body receta-formato" id={`receta-pdf-${idx}`}>
        {/* Encabezado */}
        <div className="receta-encabezado">
          <img src="/assets/Logo.jpg" alt="logo" className="logo-receta" />
          <div className="hospital-info">
            <h5 className="text-success mb-1">Hospital La Aurora</h5>
            <p><strong>Código Receta:</strong> {proceso.receta?.codigo_receta || proceso.codigo_paciente_unico || "Sin código"}</p>
            <p><strong>Fecha:</strong> {new Date(proceso.receta?.fecha_emision || proceso.fecha).toLocaleDateString("es-GT")}</p>
          </div>
          <div className="paciente-info-texto text-end">
            <p><strong>{proceso.receta?.nombre_paciente || proceso.nombre_paciente}</strong></p>
            {proceso.foto_url ? (
              <img src={proceso.foto_url} alt="paciente" className="foto-paciente" />
            ) : (
              <p className="text-muted">Sin foto</p>
            )}
          </div>
        </div>

        {/* Detalle del proceso */}
        <h6 className="text-success mt-3">Detalle del Proceso</h6>
        <p><strong>Diagnóstico:</strong> {proceso.receta?.diagnostico || proceso.diagnostico || 'No especificado'}</p>
        <p><strong>Doctor:</strong> {proceso.receta?.nombre_doctor || proceso.nombre_doctor} ({proceso.receta?.especialidad || proceso.especialidad})</p>
        <p><strong>No. de colegiado:</strong> {proceso.receta?.numero_colegiado || proceso.numero_colegiado || 'No registrado'}</p>
        <p><strong>Detalle:</strong> {proceso.detalle || 'No ingresado'}</p>

        {/* Medicamentos */}
        <h6 className="text-success mt-3">Medicamentos Recetados</h6>
        {proceso.receta?.medicamentos && proceso.receta.medicamentos.length > 0 ? (
          <ul>
            {proceso.receta.medicamentos.map((med, i) => (
              <li key={i}>
                {med.principio_activo}, {med.concentracion}, {med.presentacion}, {med.forma_farmaceutica}<br />
                <em>
                  Dosis: {med.dosis_formato || med.dosis}, Frecuencia: {med.frecuencia_formato || `cada ${med.frecuencia}h`}, Duración: {med.duracion_formato || `${med.duracion} días`}
                </em>
              </li>
            ))}
          </ul>
        ) : (
          <p><em>No hay medicamentos registrados.</em></p>
        )}

        {/* Notas especiales */}
        <h6 className="text-success mt-3">Notas Especiales</h6>
        <p><strong>Anotaciones:</strong> {proceso.receta?.anotaciones || 'Sin anotaciones'}</p>
        <p><strong>Comentarios:</strong> {proceso.receta?.comentarios || 'Sin comentarios'}</p>
        <p><strong>Notas especiales:</strong> {proceso.receta?.notas_especiales || 'Sin notas especiales'}</p>

        {/* Resumen de pago */}
        <h6 className="text-success mt-3">Resumen de Pago</h6>
        <p>Total: <strong>Q{parseFloat(proceso.costo || 0).toFixed(2)}</strong></p>
        <p>Cubre Seguro: <strong>Q{parseFloat(proceso.monto_cubierto_seguro || 0).toFixed(2)}</strong></p>
        <p>Porcentaje de Cobertura: <strong>{proceso.porcentaje_cobertura || 0}%</strong></p>
        <p>Código de Aprobación: <strong>{proceso.codigo_aprobacion || "No aplica"}</strong></p>
        <p>Paga Paciente: <strong>Q{parseFloat(proceso.monto_pagado_paciente || 0).toFixed(2)}</strong></p>

        {/* Imagen de resultado */}
        {proceso.resultados_url && (
          <>
            <h6 className="text-success mt-3">Imagen de Resultado</h6>
            <img src={proceso.resultados_url} alt="Resultado" className="img-resultado" />
          </>
        )}
      </div>

      {/* Botón exportar */}
      <div className="text-end p-3 pt-0">
        <button className="btn btn-hospital-warning" onClick={exportarUnaReceta}>
          Exportar PDF
        </button>
      </div>
    </div>
  );
};

export default RecetaPDF;
