import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup, FormControl, Image } from "react-bootstrap";
import { API_BASE } from "../../config.js";
import "../../styles/GestionUsuarios.css";

const GestionPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetalles, setShowDetalles] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState({
    id: null,
    correo: "",
    nombre: "",
    fecha_nacimiento: "",
    documento_identidad: "",
    tiene_seguro: 0,
    foto_url: "",
    activo: 1,
    codigo_hospital: 1001,
    id_seguro: ""
  });

  const cargarPacientes = () => {
    fetch(`${API_BASE}/hospital/obtener_pacientes.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const pacientesOrdenados = data.paciente.sort((a, b) => b.id - a.id);
          setPacientes(pacientesOrdenados);
        } else {
          console.error("Error cargando pacientes:", data.message);
        }
      })
      .catch(err => console.error("Error al conectar:", err));
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    const correo = pacienteSeleccionado.correo?.trim();
    if (!correo || correo.length < 5) return;

    const buscarClienteSeguro = async () => {
      try {
        const res = await fetch(`${API_BASE}/seguro/buscar_usuario_por_correo.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo }),
        });

        const data = await res.json();

        if (data.success && data.usuario) {
          const { rol, datos_cliente } = data.usuario;

          if (["admin", "empleado", "doctor"].includes(rol.toLowerCase())) {
            alert("Este correo ya pertenece a un rol incompatible: " + rol);
            setPacienteSeleccionado(prev => ({ ...prev, correo: "" }));
            return;
          }

          if (rol === "clienteseguro" && datos_cliente) {
            setPacienteSeleccionado(prev => ({
              ...prev,
              nombre: datos_cliente.nombre,
              fecha_nacimiento: datos_cliente.fecha_nacimiento,
              documento_identidad: datos_cliente.documento_identidad,
              tiene_seguro: 1,
              id_seguro: datos_cliente.num_afiliacion,
            }));
          }
        }
      } catch (err) {
        console.error("Error al verificar cliente del seguro:", err);
      }
    };

    buscarClienteSeguro();
  }, [pacienteSeleccionado.correo]);

  const handleShow = (paciente = null) => {
    if (paciente) {
      setIsEditing(true);
      setPacienteSeleccionado({
        ...paciente,
        tiene_seguro: paciente.tiene_seguro === "1" || paciente.tiene_seguro === 1 ? 1 : 0,
        activo: paciente.activo === "1" || paciente.activo === 1 ? 1 : 0
      });
    } else {
      setIsEditing(false);
      setPacienteSeleccionado({
        id: null,
        correo: "",
        nombre: "",
        fecha_nacimiento: "",
        documento_identidad: "",
        tiene_seguro: 0,
        foto_url: "",
        activo: 1,
        codigo_hospital: 1001,
        id_seguro: ""
      });
    }
    setShowModal(true);
  };

  const handleDetalles = (paciente) => {
    setPacienteSeleccionado({
      ...paciente,
      tiene_seguro: paciente.tiene_seguro === "1" || paciente.tiene_seguro === 1 ? 1 : 0,
      activo: paciente.activo === "1" || paciente.activo === 1 ? 1 : 0
    });
    setShowDetalles(true);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseDetalles = () => setShowDetalles(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? 1 : 0) : value;
    setPacienteSeleccionado({ ...pacienteSeleccionado, [name]: val });
  };

  const handleGuardar = async () => {
    console.log("Guardando...");
    const camposObligatorios = ["nombre", "fecha_nacimiento", "documento_identidad", "foto_url"];
  
    if (pacienteSeleccionado.tiene_seguro === 1 && !pacienteSeleccionado.id_seguro) {
      alert("Debe especificar el ID del seguro si el paciente tiene seguro.");
      return;
    }
  
    for (const campo of camposObligatorios) {
      if (!pacienteSeleccionado[campo]) {
        alert("Por favor complete el campo: " + campo.replace("_", " "));
        return;
      }
    }
  
    if (!isEditing) {
      try {
        const res = await fetch(`${API_BASE}/hospital/verificar_paciente_por_correo.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: pacienteSeleccionado.correo })
        });
  
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          alert("Error: respuesta del servidor no válida.");
          return;
        }
  
        if (data.existe) {
          alert("Este correo ya está registrado como paciente.");
          return;
        }
      } catch (err) {
        console.error("Error verificando correo en pacientes:", err);
        alert("Error de red al verificar el correo.");
        return;
      }
    }
  
    const url = isEditing
      ? `${API_BASE}/hospital/actualizar_paciente.php`
      : `${API_BASE}/hospital/crear_paciente.php`;
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteSeleccionado),
      });
  
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        throw new Error("Respuesta del servidor no válida.");
      }
  
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Error desconocido al guardar.");
      }
  
      alert("✅ Paciente guardado con éxito.");
      handleClose();
      cargarPacientes();
  
    } catch (error) {
      console.error("❌ Error en guardar paciente:", error.message);
      alert("❌ " + error.message);
    }
  };
   

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este paciente?")) return;
    fetch(`${API_BASE}/hospital/eliminar_paciente.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(() => cargarPacientes())
      .catch(err => console.error("Error al eliminar:", err));
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.documento_identidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  const esPacienteExistente = !!pacienteSeleccionado.id;

  return (
    <div className="gestion-usuarios-container">
      <h2 className="titulo">Gestión de Pacientes</h2>

      <div className="d-flex justify-content-between mb-3 mt-2">
        <Button
          variant="success"
          onClick={() => {
            console.log("🟢 Click en 'Agregar Paciente'");
            handleShow(); // Aquí puedes añadir más validaciones si quieres restringir cuándo se abre
          }}
        >
          + Agregar Paciente
        </Button>

        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Buscar por nombre o documento"
            value={busqueda}
            onChange={(e) => {
              const valor = e.target.value.trimStart();
              if (valor.length > 100) {
                alert("Búsqueda demasiado larga.");
                return;
              }
              setBusqueda(valor);
            }}
            isInvalid={busqueda.length > 100}
          />
        </InputGroup>
      </div>


      <Table className="usuarios-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Seguro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientesFiltrados.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.foto_url}
                  alt="foto"
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              </td>
              <td>{p.nombre}</td>
              <td>{p.documento_identidad}</td>
              <td>{Number(p.tiene_seguro) === 1 ? "Sí" : "No"}</td>
              <td>
                <Button className="btn-editar" onClick={() => handleShow(p)}>Editar</Button>{" "}
                <Button className="btn-detalles" onClick={() => handleDetalles(p)}>Ver Detalles</Button>
                <Button className="btn-eliminar" onClick={() => handleEliminar(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Paciente" : "Agregar Paciente"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}> {/* Previene submit por defecto */}
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={pacienteSeleccionado.correo || ""}
                onChange={handleChange}
                readOnly={isEditing}
              />
            </Form.Group>

            {["nombre", "fecha_nacimiento", "documento_identidad", "foto_url"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.replaceAll("_", " ").toUpperCase()}</Form.Label>
                <Form.Control
                  type={field === "fecha_nacimiento" ? "date" : "text"}
                  name={field}
                  value={pacienteSeleccionado[field] || ""}
                  onChange={handleChange}
                  readOnly={!isEditing && pacienteSeleccionado.tiene_seguro === 1 && field !== "foto_url"}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Tiene Seguro?"
                name="tiene_seguro"
                checked={pacienteSeleccionado.tiene_seguro === 1}
                disabled
              />
            </Form.Group>

            {pacienteSeleccionado.tiene_seguro === 1 && (
              <Form.Group className="mb-3">
                <Form.Label>ID del Seguro</Form.Label>
                <Form.Control
                  type="text"
                  name="id_seguro"
                  value={pacienteSeleccionado.id_seguro || ""}
                  readOnly
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Activo?"
                name="activo"
                checked={pacienteSeleccionado.activo === 1}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button
            variant="primary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("✔ Click en guardar recibido"); // Validación visual
              handleGuardar();
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetalles} onHide={handleCloseDetalles}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Nombre:</strong> {pacienteSeleccionado.nombre}</p>
          <p><strong>Correo:</strong> {pacienteSeleccionado.correo}</p>
          <p><strong>Documento:</strong> {pacienteSeleccionado.documento_identidad}</p>
          <p><strong>Fecha de Nacimiento:</strong> {pacienteSeleccionado.fecha_nacimiento}</p>
          <p><strong>Tiene Seguro:</strong> {Number(pacienteSeleccionado.tiene_seguro) === 1 ? "Sí" : "No"}</p>
          {Number(pacienteSeleccionado.tiene_seguro) === 1 && pacienteSeleccionado.id_seguro && (
            <p><strong>ID del Seguro:</strong> {pacienteSeleccionado.id_seguro}</p>
          )}
          <div className="text-center mt-3">
            <h6>Foto del Paciente</h6>
            <Image
              src={pacienteSeleccionado.foto_url}
              fluid
              rounded
              style={{ maxHeight: "250px", borderRadius: "10px" }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GestionPacientes;
