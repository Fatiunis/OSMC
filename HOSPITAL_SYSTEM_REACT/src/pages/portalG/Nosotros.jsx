import { Container, Row, Col, Image } from "react-bootstrap";
import { FaHandsHelping, FaLightbulb } from "react-icons/fa"; // Importar íconos

function Nosotros() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <div style={{ 
        maxWidth: "1100px",  
        width: "100%", 
        background: "#fff", 
        padding: "50px", 
        borderRadius: "10px", 
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}>
        
        <h1 className="text-center fw-bold" style={{
          fontSize: "2.5rem",
          color: "#004d00",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>  Sobre Nosotros  </h1>

        <p className="text-center" style={{ marginBottom: "30px" }}>
          En <strong>Hospital La Aurora</strong>, nos dedicamos a brindar atención médica de calidad con tecnología de punta y un equipo altamente calificado.
        </p>

        {/* Misión y Visión con íconos */}
        <Row className="mt-4">
          <Col md={6} className="text-center">
            <FaHandsHelping size={50} color= "#1f9b1f" className="mb-2"/> 
            <h3 className="text-center mb-3">Nuestra Misión</h3>
            <p style={{ textAlign: "justify", lineHeight: "1.6" }}>
              Ofrecer atención médica integral, con un enfoque humano y profesional, asegurando el bienestar de nuestros pacientes mediante servicios de salud innovadores y accesibles.
            </p>
          </Col>
          <Col md={6} className="text-center">
            <FaLightbulb size={50} color="#1f9b1f" className="mb-2"/>
            <h3 className="text-center mb-3">Nuestra Visión</h3>
            <p style={{ textAlign: "justify", lineHeight: "1.6" }}>
              Ser el hospital líder en atención médica, reconocido por su excelencia, innovación y compromiso con la salud de la comunidad.
            </p>
          </Col>
        </Row>

        {/* Espacio para Imagen */}
        <div className="text-center mt-5">
          <Image 
            src="../Imagenes/personalh.jpg" 
            alt="Nuestro Hospital" 
            fluid 
            style={{ 
              maxWidth: "100%", 
              borderRadius: "10px", 
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" 
            }}
          />
        </div>

        {/* Valores */}
        <h3 className="mt-5 mb-3 text-center">Nuestros Valores</h3>
        <div  className="centrado">
          <p><strong>Compromiso:</strong> Nos esforzamos en ofrecer la mejor atención a nuestros pacientes.</p>
          <p><strong>Innovación:</strong> Aplicamos tecnología avanzada para mejorar nuestros servicios.</p>
          <p><strong>Calidad:</strong> Priorizamos la excelencia en cada aspecto de nuestro trabajo.</p>
          <p><strong>Ética:</strong> Actuamos con honestidad y transparencia en todo momento.</p>
        </div>
      </div>
    </Container>
  );
}

export default Nosotros;
