import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup, FormControl } from "react-bootstrap";
import "../../styles/GestionUsuarios.css";
import { API_BASE } from "../../config.js";


const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    id: null,
    nombre: "", 
    correo: "",
    contrasena: "",
    rol: "admin",
    estado: 1,
  });

  const cargarUsuarios = () => {
    fetch(`${API_BASE}usuarios/obtener_usuarios.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const usuariosOrdenados = data.usuarios.sort((a, b) => b.id - a.id);
          setUsuarios(usuariosOrdenados);
        } else {
          console.error("Error cargando usuarios:", data.message);
        }
      })
      .catch(err => console.error("Error al conectar:", err));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleShow = (usuario = null) => {
    if (usuario) {
      setIsEditing(true);
      setUsuarioSeleccionado(usuario);
    } else {
      setIsEditing(false);
      setUsuarioSeleccionado({ id: null, nombre: "", correo: "", contrasena: "", rol: "admin", estado: 1 });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setUsuarioSeleccionado({ ...usuarioSeleccionado, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    const url = isEditing
      ? `${API_BASE}usuarios/actualizar_usuario.php`
      : `${API_BASE}usuarios/insertar_usuario.php`;

    const payload = { ...usuarioSeleccionado };
    if (isEditing) delete payload.contrasena; // No se actualiza la contraseña
  
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta guardar:", data);
        handleClose();
        cargarUsuarios();
      })
      .catch(err => console.error("Error al guardar:", err));
  };
  

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
  
    fetch(`${API_BASE}usuarios/eliminar_usuario.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          console.log("Respuesta eliminar (JSON):", data);
          if (data.success) {
            cargarUsuarios();
          } else {
            alert("Error al eliminar: " + data.message);
          }
        } catch (e) {
          console.error("Respuesta inválida del servidor:", text);
          alert("Error inesperado al eliminar usuario.");
        }
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
      });
  };
  

  const usuariosFiltrados = usuarios.filter(u =>
    u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gestion-usuarios-container">
      <h2 className="titulo">Gestión de Usuarios</h2>

      <div className="d-flex justify-content-between mb-3 mt-2">
        <Button variant="success" onClick={() => handleShow()}>
          + Agregar Usuario
        </Button>

        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Buscar por correo o rol"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.estado === "1" ? "Activo" : "Inactivo"}</td>
              <td>
                <Button className="btn-editar" onClick={() => handleShow(u)}>Editar</Button>
                <Button className="btn-eliminar" onClick={() => handleEliminar(u.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" value={usuarioSeleccionado.nombre} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" name="correo" value={usuarioSeleccionado.correo} onChange={handleChange} />
            </Form.Group>
            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={usuarioSeleccionado.contrasena}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={usuarioSeleccionado.rol} onChange={handleChange}>
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={usuarioSeleccionado.estado} onChange={handleChange}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </Form.Select>
            </Form.Group>
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

export default GestionUsuarios;
