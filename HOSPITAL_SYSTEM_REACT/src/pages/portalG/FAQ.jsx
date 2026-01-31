import { Container, Accordion } from "react-bootstrap";

function FAQ() {
  return (
    <Container className="faq-container mt-5">
      <h1 className="faq-title text-center" style={{
          fontSize: "2.5rem",
          color: "#004d00",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>Preguntas Frecuentes</h1>
      <p className="faq-subtitle text-center">
        Encuentra respuestas a las dudas más comunes sobre nuestros servicios.
      </p>

      <Accordion defaultActiveKey="0" className="mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Cómo puedo agendar una cita médica?</Accordion.Header>
          <Accordion.Body>
            Puedes agendar una cita llamando a nuestro centro de atención o a través del portal web.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Aceptan seguros médicos?</Accordion.Header>
          <Accordion.Body>
            Sí, trabajamos con la mayoría de los seguros médicos. Puedes verificar la lista en nuestra sección de seguros.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>¿Cuáles son los horarios de atención?</Accordion.Header>
          <Accordion.Body>
            Nuestros hospitales operan las 24 horas, pero las consultas médicas varían según la especialidad.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>¿Tienen servicio de emergencia?</Accordion.Header>
          <Accordion.Body>
            Sí, contamos con un servicio de emergencia disponible las 24 horas del día.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default FAQ;
