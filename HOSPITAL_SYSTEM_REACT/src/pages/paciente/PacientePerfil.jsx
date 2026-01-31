import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "../../styles/PacientePerfil.css";

const PacientePerfil = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(storedUser);
  }, []);

  if (!usuario) return <p className="text-center mt-4">Cargando perfil...</p>;

  return (
    <Container className="perfil-container mt-4">
      <h2 className="titulo">Mi Perfil</h2>
      <Card className="perfil-card shadow-sm">
        <Card.Body>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Fecha de Registro:</strong> {usuario.fechaRegistro}</p>
          <p><strong>Póliza:</strong> {usuario.poliza}</p>
          <p><strong>Fecha de Vencimiento:</strong> {usuario.fechaVencimiento}</p>
          <p><strong>Estado:</strong> {usuario.activo ? "Activo" : "Inactivo"}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PacientePerfil;
