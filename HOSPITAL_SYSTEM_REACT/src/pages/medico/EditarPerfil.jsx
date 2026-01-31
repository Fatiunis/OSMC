import { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/MiPerfil.css";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    universidad: "",
    telefono: "",
    foto_url: "",
    titulo_url: "",
  });

  const [originalForm, setOriginalForm] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const doctorId = usuario?.id;

    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find(doc => parseInt(doc.usuario_id) === parseInt(doctorId));
        if (encontrado) {
          const perfil = {
            nombre: encontrado.nombre,
            universidad: encontrado.universidad,
            telefono: encontrado.telefono,
            foto_url: encontrado.foto_url || "",
            titulo_url: encontrado.titulo_url || "",
          };
          setForm(perfil);
          setOriginalForm(perfil);
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono no puede estar vacío.";
    }

    const urlRegex = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;
    if (form.foto_url && !urlRegex.test(form.foto_url)) {
      nuevosErrores.foto_url = "URL de foto inválida.";
    }
    if (form.titulo_url && !urlRegex.test(form.titulo_url)) {
      nuevosErrores.titulo_url = "URL de título inválida.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleCancelar = () => {
    setForm(originalForm);
    setErrores({});
    navigate("/medico/perfil");
  };

  const handleRegresar = () => {
    navigate("/medico/perfil");
  };

  const handleGuardar = () => {
    if (!validar()) return;

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const doctorId = usuario?.id;

    fetch(`${API_BASE}hospital/actualizar_perfil_doctor.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id: doctorId, ...form }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Perfil actualizado correctamente.");
          navigate("/medico/perfil");
        } else {
          alert("Error al actualizar: " + data.message);
        }
      });
  };

  return (
    <Card className="perfil-container">
      <h2 className="perfil-header">Editar Perfil</h2>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Universidad</Form.Label>
              <Form.Control name="universidad" value={form.universidad} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                isInvalid={!!errores.telefono}
              />
              <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Foto de perfil (URL)</Form.Label>
              <Form.Control
                name="foto_url"
                value={form.foto_url}
                onChange={handleChange}
                isInvalid={!!errores.foto_url}
              />
              <Form.Control.Feedback type="invalid">{errores.foto_url}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen del título universitario (URL)</Form.Label>
              <Form.Control
                name="titulo_url"
                value={form.titulo_url}
                onChange={handleChange}
                isInvalid={!!errores.titulo_url}
              />
              <Form.Control.Feedback type="invalid">{errores.titulo_url}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex gap-3 mt-4">
          <Button className="btn-cancelar" onClick={handleCancelar}>
            Cancelar cambios
          </Button>
          <Button className="btn-editar" onClick={handleGuardar}>
            Guardar Cambios
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditarPerfil;
