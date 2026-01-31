import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../config/sessionUtils.js";
import "../../styles/BotonesHospital.css";

const FinalizarCita = () => {
  const { citaId } = useParams();
  const navigate = useNavigate();
  const { usuario_id } = getSessionUser();

  const calcularMontoSeguro = () => {
    const costo = parseFloat(formulario.costo) || 0;
    const cobertura = parseInt(formulario.cobertura_seguro) || 0;
    return costo * (cobertura / 100);
  };

  const calcularMontoPaciente = () => {
    return (parseFloat(formulario.costo) || 0) - calcularMontoSeguro();
  };

  const [cita, setCita] = useState(null);
  const [pacienteTieneSeguro, setPacienteTieneSeguro] = useState(false);
  const [codigoPaciente, setCodigoPaciente] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [formulario, setFormulario] = useState({
    detalle: "",
    diagnostico: "",
    forma_pago: "",
    costo: "",
    resultados_url: "",
    aprobacion_seguro: "",
    cobertura_seguro: "",
    diagnostico_receta: "",
    anotaciones: "",
    comentarios: "",
    notas_especiales: "",
    mensaje_aprobado: "",
    medicamentos: []
  });

  useEffect(() => {
    fetch(`${API_BASE}hospital/citas/obtener_cita_por_id.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cita_id: citaId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCita(data.cita);
          setCodigoPaciente(data.cita.codigo_paciente_unico);
          if (
            data.cita.tiene_seguro === 1 ||
            data.cita.tiene_seguro === "1" ||
            data.cita.tiene_seguro === true
          ) {
            setPacienteTieneSeguro(true);
          }
        }
      });
  }, [citaId]);

  const validarConSeguro = async () => {
    const res = await fetch(`${API_BASE}seguro/validar_seguro.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_id: cita.paciente_id,
        especialidad: cita.especialidad,
        costo: parseFloat(formulario.costo)
      })
    });
    const validacion = await res.json();
    if (validacion.estado !== "aprobado") throw new Error(validacion.mensaje);
    return validacion;
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const updateMedicamento = (index, campo, valor) => {
    const nuevos = [...formulario.medicamentos];

    if (campo === "dosis" && valor !== "custom") {
      nuevos[index]["dosis"] = valor;
      delete nuevos[index]["dosis_personalizada"];
    } else if (campo === "frecuencia" && valor !== "custom") {
      nuevos[index]["frecuencia"] = valor;
      delete nuevos[index]["frecuencia_personalizada"];
    } else if (campo === "duracion" && valor !== "custom") {
      nuevos[index]["duracion"] = valor;
      delete nuevos[index]["duracion_personalizada"];
    } else {
      nuevos[index][campo] = valor;
    }

    setFormulario({ ...formulario, medicamentos: nuevos });
  };

  const removeMedicamento = (index) => {
    const nuevos = [...formulario.medicamentos];
    nuevos.splice(index, 1);
    setFormulario({ ...formulario, medicamentos: nuevos });
  };

  const generarCodigoReceta = () => {
    const base = cita.codigo_paciente_unico; // Ej: 10-1001-8354
    const timestamp = Date.now(); // Para asegurar unicidad
    return `${base}-R${timestamp}`;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (pacienteTieneSeguro) {
      try {
        const validacion = await validarConSeguro();
        setFormulario((prev) => ({
          ...prev,
          aprobacion_seguro: validacion.codigo_aprobacion,
          cobertura_seguro: validacion.porcentaje,
          mensaje_aprobado: validacion.mensaje,
          monto_cubierto: validacion.monto_cubierto,
          monto_paciente: validacion.monto_paciente
        }));
      } catch (err) {
        alert("❌ Seguro rechazó la solicitud: " + err.message);
        return;
      }
    }
  
    const medicamentosFinales = formulario.medicamentos.map((med) => ({
      ...med,
      dosis: med.dosis === "custom" ? med.dosis_personalizada : med.dosis,
      frecuencia: med.frecuencia === "custom" ? med.frecuencia_personalizada : med.frecuencia,
      duracion: med.duracion === "custom" ? med.duracion_personalizada : med.duracion
    }));
  
    const fechaActual = new Date().toISOString().split("T")[0];
    const codigoRecetaGenerado = generarCodigoReceta();
  
    const recetaCompleta = {
      codigo_receta: codigoRecetaGenerado,
      fecha_emision: fechaActual,
      nombre_paciente: cita.nombre_paciente,
      nombre_doctor: cita.nombre_doctor,
      numero_colegiado: cita.numero_colegiado,
      especialidad: cita.especialidad,
      diagnostico: formulario.diagnostico_receta || "",
      anotaciones: formulario.anotaciones || "",
      comentarios: formulario.comentarios || "",
      notas_especiales: formulario.notas_especiales || "",
      medicamentos: medicamentosFinales
    };
  
    const body = {
      paciente_id: cita.paciente_id,
      doctor_id: cita.doctor_id,
      detalle: formulario.detalle.trim(),
      diagnostico: formulario.diagnostico.trim(),
      forma_pago: pacienteTieneSeguro ? "seguro" : formulario.forma_pago,
      costo: parseFloat(formulario.costo) || 0,
      resultados_url: formulario.resultados_url?.trim() || "",
      aprobacion_seguro: formulario.aprobacion_seguro || "",
      codigo_aprobacion: formulario.aprobacion_seguro || "",
      cobertura_seguro: parseInt(formulario.cobertura_seguro) || 0,
      monto_cubierto_seguro: pacienteTieneSeguro ? calcularMontoSeguro() : 0,
      monto_pagado_paciente: pacienteTieneSeguro ? calcularMontoPaciente() : parseFloat(formulario.costo) || 0,
      mensaje_aprobado: formulario.mensaje_aprobado || "",
      codigo_paciente_unico: cita.codigo_paciente_unico,
      especialidad: cita.especialidad,
      fecha: fechaActual,
      receta: recetaCompleta,
      codigo_receta: codigoRecetaGenerado // <- si quieres usarlo después
    };
  
    if (!body.detalle || !body.diagnostico || !body.paciente_id || !body.doctor_id || !body.fecha) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }
  
    try {
      const res = await fetch(`${API_BASE}hospital/procesos/guardar_proceso_clinico.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        alert("⚠️ Error: El servidor respondió con un formato inválido.");
        return;
      }
  
      if (data && data.success) {
          setCodigoGenerado(data.codigo_receta || ""); // <-- Aquí
        alert("✅ Proceso clínico guardado correctamente.");
        navigate("/medico/AgendaMedico");
      } else if (data && data.error) {
        alert("❌ Error al guardar: " + data.error);
      } else {
        alert("❌ Error inesperado: respuesta del servidor no válida.");
      }
  
    } catch (err) {
      alert("❌ Error al guardar: " + err.message);
    }
  };
  

  if (!cita) return <div className="text-center">Cargando cita...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Finalizar Consulta</h2>

      <div className="mb-3">
        <h5>{cita.fecha} — {cita.hora_inicio} a {cita.hora_fin}</h5>
        <p><strong>Paciente:</strong> {cita.nombre_paciente}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea name="detalle" placeholder="Detalle del proceso" className="form-control mb-3" value={formulario.detalle} onChange={handleChange} required />
        <input name="diagnostico" placeholder="Diagnóstico" className="form-control mb-3" value={formulario.diagnostico} onChange={handleChange} required />

        {/* Lógica para pacientes con seguro */}
        {pacienteTieneSeguro ? (
          <>
            <input type="hidden" name="forma_pago" value="seguro" />
            <div className="mb-3">
              <label>Cobertura del Seguro</label>
              <input
                type="text"
                className="form-control"
                value={`${formulario.cobertura_seguro || "No validado aún"}%`}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label>Código de Aprobación</label>
              <input type="text" className="form-control" value={formulario.aprobacion_seguro || "No validado aún"} readOnly />
            </div>
            {formulario.costo && (
              <div className="alert alert-info mt-3">
                <p><strong>Costo Total:</strong> Q{formulario.costo}</p>
                {formulario.cobertura_seguro > 0 ? (
                  <>
                    <p><strong>Cobertura del Seguro:</strong> {formulario.cobertura_seguro}%</p>
                    <p><strong>Monto cubierto:</strong> Q{calcularMontoSeguro().toFixed(2)}</p>
                    <p><strong>Pago del paciente:</strong> Q{calcularMontoPaciente().toFixed(2)}</p>
                    <p className="text-success"><strong>Mensaje:</strong> {formulario.mensaje_aprobado}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Pago del paciente:</strong> Q{parseFloat(formulario.costo).toFixed(2)}</p>
                    <p className="text-danger"><strong>Mensaje:</strong> {formulario.mensaje_aprobado || "El seguro no aprobó esta solicitud."}</p>
                  </>
                )}
              </div>
            )}
                        
            {formulario.cobertura_seguro && (
              <div className="alert alert-info">
                Cobertura: <strong>{formulario.cobertura_seguro}%</strong><br />
                Aprobación: <strong>{formulario.aprobacion_seguro}</strong><br />
                Pago del paciente: <strong>Q{calcularMontoPaciente().toFixed(2)}</strong>
              </div>
            )}
            <input type="number" name="costo" placeholder="Costo (Q)" className="form-control mb-3" value={formulario.costo} onChange={handleChange} required />
          </>
        ) : (
          <>
            <select name="forma_pago" className="form-select mb-3" value={formulario.forma_pago} onChange={handleChange} required>
              <option value="">Seleccione forma de pago</option>
              <option value="contado">Contado</option>
            </select>
            <input type="number" name="costo" placeholder="Costo (Q)" className="form-control mb-3" value={formulario.costo} onChange={handleChange} required />
          </>
        )}

        <input name="resultados_url" placeholder="URL de imagen de resultados" className="form-control mb-4" value={formulario.resultados_url} onChange={handleChange} />

        {/* Receta Médica */}
        <h5 className="mt-4">Receta Médica</h5>
        <input name="diagnostico_receta" placeholder="Diagnóstico de receta" className="form-control mb-2" value={formulario.diagnostico_receta} onChange={handleChange} />
        <textarea name="anotaciones" placeholder="Anotaciones" className="form-control mb-2" value={formulario.anotaciones} onChange={handleChange} />
        <textarea name="comentarios" placeholder="Comentarios" className="form-control mb-2" value={formulario.comentarios} onChange={handleChange} />
        <textarea name="notas_especiales" placeholder="Notas especiales" className="form-control mb-3" value={formulario.notas_especiales} onChange={handleChange} />

        <h6 className="mt-3">Medicamentos</h6>
        {formulario.medicamentos.map((med, idx) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <input placeholder="principio activo" className="form-control mb-2" value={med.principio_activo} onChange={(e) => updateMedicamento(idx, "principio_activo", e.target.value)} />
            <input placeholder="concentración" className="form-control mb-2" value={med.concentracion} onChange={(e) => updateMedicamento(idx, "concentracion", e.target.value)} />
            <input placeholder="presentación" className="form-control mb-2" value={med.presentacion} onChange={(e) => updateMedicamento(idx, "presentacion", e.target.value)} />
            <input placeholder="forma farmacéutica" className="form-control mb-2" value={med.forma_farmaceutica} onChange={(e) => updateMedicamento(idx, "forma_farmaceutica", e.target.value)} />

            {/* Dosis */}
            <select className="form-control mb-2" value={med.dosis} onChange={(e) => updateMedicamento(idx, "dosis", e.target.value)}>
              <option value="">Seleccione dosis</option>
              <option value="1/4">1/4</option>
              <option value="1/2">1/2</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="custom">Otra...</option>
            </select>
            {med.dosis === "custom" && (
              <input className="form-control mb-2" placeholder="Escriba dosis personalizada" value={med.dosis_personalizada || ""} onChange={(e) => updateMedicamento(idx, "dosis_personalizada", e.target.value)} />
            )}

            {/* Frecuencia */}
            <select className="form-control mb-2" value={med.frecuencia} onChange={(e) => updateMedicamento(idx, "frecuencia", e.target.value)}>
              <option value="">Cada cuántas horas</option>
              <option value="4">Cada 4 horas</option>
              <option value="6">Cada 6 horas</option>
              <option value="8">Cada 8 horas</option>
              <option value="12">Cada 12 horas</option>
              <option value="24">Cada 24 horas</option>
              <option value="custom">Otra...</option>
            </select>
            {med.frecuencia === "custom" && (
              <input className="form-control mb-2" placeholder="Escriba frecuencia personalizada" value={med.frecuencia_personalizada || ""} onChange={(e) => updateMedicamento(idx, "frecuencia_personalizada", e.target.value)} />
            )}

            {/* Duración */}
            <select className="form-control mb-2" value={med.duracion} onChange={(e) => updateMedicamento(idx, "duracion", e.target.value)}>
              <option value="">Duración en días</option>
              <option value="3">3 días</option>
              <option value="5">5 días</option>
              <option value="7">7 días</option>
              <option value="10">10 días</option>
              <option value="14">14 días</option>
              <option value="custom">Otra...</option>
            </select>
            {med.duracion === "custom" && (
              <input className="form-control mb-2" placeholder="Escriba duración personalizada" value={med.duracion_personalizada || ""} onChange={(e) => updateMedicamento(idx, "duracion_personalizada", e.target.value)} />
            )}

            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeMedicamento(idx)}>Quitar</button>
          </div>
        ))}

        <button type="button" className="btn btn-hospital-warning mb-3" onClick={() =>
          setFormulario({
            ...formulario,
            medicamentos: [...formulario.medicamentos, {
              principio_activo: "",
              concentracion: "",
              presentacion: "",
              forma_farmaceutica: "",
              dosis: "",
              frecuencia: "",
              duracion: ""
            }]
          })
        }>
          + Agregar Medicamento
        </button>

        <div className="text-end mt-3">
          <button type="button" className="btn btn-hospital-secondary me-2" onClick={() => navigate("/medico/AgendaMedico")}>Cancelar</button>
          <button type="submit" className="btn btn-hospital-primary">Guardar Proceso</button>
        </div>
      </form>
    </div>
  );
};

export default FinalizarCita;