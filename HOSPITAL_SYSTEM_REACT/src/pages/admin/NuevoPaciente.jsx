
import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config.js";

const NuevoPaciente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    foto: null,
    correo: "",
    fecha_nacimiento: "",
    documento_identidad: "",
    codigo_seguro: "",
    num_afiliacion_seguro: "",
    numero_carnet: "",
    tipo_sangre: "",
    alergias: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Enviando datos:", formData); // Debug
      const res = await fetch(`${API_BASE}/hospital/crear_paciente.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      console.log("Respuesta recibida:", res); // Debug

      if (!res.ok) {
        const text = await res.text();
        console.error("Error del servidor:", text);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Datos recibidos:", data); // Debug

      if (data.success) {
        navigate("/admin/pacientes");
      } else {
        setError(data.error || data.message || "Error al crear el paciente");
      }
    } catch (err) {
      console.error("Error completo:", err); // Debug
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container py-4">
      <Card>
        <Card.Header as="h5">Nuevo Paciente</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Documento de identidad</Form.Label>
              <Form.Control
                type="text"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de afiliación al seguro</Form.Label>
              <Form.Control
                type="text"
                name="num_afiliacion_seguro"
                value={formData.num_afiliacion_seguro}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de sangre</Form.Label>
              <Form.Select
                name="tipo_sangre"
                value={formData.tipo_sangre}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alergias</Form.Label>
              <Form.Control
                as="textarea"
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                placeholder="Ingrese las alergias separadas por comas"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fotografía</Form.Label>
              <Form.Control
                type="file"
                name="foto"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({
                    ...formData,
                    foto: file
                  });
                }}
                accept="image/*"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Código de Seguro</Form.Label>
              <Form.Control
                type="text"
                name="codigo_seguro"
                value={formData.codigo_seguro}
                onChange={handleChange}
                placeholder="Dejar en blanco si no tiene seguro"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Carnet</Form.Label>
              <Form.Control
                type="text"
                name="numero_carnet"
                value={formData.numero_carnet}
                onChange={handleChange}
                placeholder="Número de carnet del seguro"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Paciente"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate("/admin/pacientes")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NuevoPaciente;