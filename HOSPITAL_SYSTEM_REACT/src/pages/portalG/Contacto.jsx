import { Container, Form, Button } from "react-bootstrap";

function Contacto() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <div style={{ maxWidth: "600px", width: "100%", background: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <h1 className="text-center" style={{
          fontSize: "2.5rem",
          color: "#004d00",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>Contáctanos</h1>
        <p className="text-center">Estamos aquí para ayudarte. Déjanos un mensaje y nos pondremos en contacto contigo.</p>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Tu Nombre" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="tuemail@example.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Escribe tu mensaje aquí" />
          </Form.Group>

          <div className="text-center">
            <Button style={{ backgroundColor: "#D4A017", color: "#ffffff", borderRadius: "25px", padding: "12px 20px", border: "none" }}>
              Enviar Mensaje
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Contacto;
