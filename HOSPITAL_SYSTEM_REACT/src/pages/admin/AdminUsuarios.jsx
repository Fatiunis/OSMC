import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import '../../styles/AdminSidebar.css';


const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ correo: '', rol: '', fecha: '' });
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    fetch('/data/usuarios.json')
      .then(res => res.json())
      .then(data => {
        const adminsYSecretarias = data.filter(u =>
          u.rol === 'Administrador' || u.rol === 'Empleado'
        );
        setUsuarios(adminsYSecretarias);
      })
      .catch(err => console.error('Error cargando usuarios:', err));
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleToggleActivo = (id) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      )
    );
  };

  const handleRolChange = (id, nuevoRol) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id ? { ...u, rol: nuevoRol } : u
      )
    );
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado({ ...usuario });
    setShowModal(true);
  };

  const handleGuardarCambios = () => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u
      )
    );
    setShowModal(false);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    return (
      u.correo.toLowerCase().includes(filtros.correo.toLowerCase()) &&
      (filtros.rol === '' || u.rol === filtros.rol) &&
      (filtros.fecha === '' || u.fechaRegistro === filtros.fecha)
    );
  });

  return (
    <div className="container mt-4">
      <h2>Gestión de Administradores y Secretarias</h2>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Filtrar por correo"
              name="correo"
              value={filtros.correo}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Select name="rol" value={filtros.rol} onChange={handleChange}>
              <option value="">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Empleado">Secretaria</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Control
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Fecha de Registro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>
                {usuario.rol === "Empleado" ? "Secretaria" : usuario.rol}
              </td>
              <td>{usuario.fechaRegistro}</td>
              <td>
                {usuario.activo ? (
                  <span className="text-success">Activo</span>
                ) : (
                  <span className="text-danger">Inactivo</span>
                )}
              </td>
              <td>
                <Button
                  variant={usuario.activo ? 'warning' : 'success'}
                  onClick={() => handleToggleActivo(usuario.id)}
                  className="me-2"
                >
                  {usuario.activo ? 'Desactivar' : 'Activar'}
                </Button>
                <Button className="btn-editar" onClick={() => handleEditar(usuario)}>
                    Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioSeleccionado && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSeleccionado.nombre}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={usuarioSeleccionado.correo}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Registro</Form.Label>
                <Form.Control
                  type="date"
                  value={usuarioSeleccionado.fechaRegistro}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuarioSeleccionado, fechaRegistro: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={usuarioSeleccionado.rol}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuarioSeleccionado, rol: e.target.value })
                  }
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Empleado">Secretaria</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarCambios}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsuarios;