import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup, FormControl } from "react-bootstrap";
import "../../styles/GestionEspecialidades.css";

const GestionEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    icono_url: "",
  });

  const cargarEspecialidades = () => {
    fetch(`${API_BASE}hospital/obtener_especialidades.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const especialidadesOrdenadas = data.especialidades.sort((a, b) => b.id - a.id);
          setEspecialidades(especialidadesOrdenadas);
        } else {
          console.error("Error cargando especialidades:", data.message);
        }
      })
      .catch(err => console.error("Error al conectar:", err));
  };


  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const handleShow = (especialidad = null) => {
    if (especialidad) {
      setIsEditing(true);
      setFormulario(especialidad);
    } else {
      setIsEditing(false);
      setFormulario({ id: null, nombre: "", descripcion: "", icono_url: "" });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    const url = isEditing
      ? `${API_BASE}hospital/actualizar_especialidad.php`
      : `${API_BASE}hospital/crear_especialidad.php`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    })
      .then(res => res.json())
      .then(() => {
        handleClose();
        cargarEspecialidades();
      })
      .catch(err => console.error("Error al guardar:", err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar esta especialidad?")) return;
    fetch(`${API_BASE}hospital/eliminar_especialidad.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(() => cargarEspecialidades())
      .catch(err => console.error("Error al eliminar:", err));
  };

  const resultados = especialidades.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gestion-especialidades-container">
      <h2 className="titulo">Gestión de Especialidades</h2>
      <div className="d-flex justify-content-between mb-3 mt-2">
        <Button variant="success" onClick={() => handleShow()}>
          + Agregar Especialidad
        </Button>
        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Buscar por nombre o descripción"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table className="especialidades-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ícono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.descripcion}</td>
              <td><img src={e.icono_url} alt="icono" width={30} /></td>
              <td>
                <Button className="btn-editar" onClick={() => handleShow(e)}>Editar</Button>
                <Button className="btn-eliminar" onClick={() => handleEliminar(e.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Especialidad" : "Agregar Especialidad"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['nombre', 'descripcion', 'icono_url'].map(field => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replace('_', ' ').toUpperCase()}</Form.Label>
                <Form.Control
                  type="text"
                  name={field}
                  value={formulario[field]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
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

export default GestionEspecialidades;
