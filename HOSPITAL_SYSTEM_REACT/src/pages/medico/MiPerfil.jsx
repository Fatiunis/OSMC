// src/pages/medico/MiPerfil.jsx

import { useEffect, useState } from "react";
import { Card, Row, Col, Image, Button } from "react-bootstrap";
import "../../styles/MiPerfil.css";
import { getSessionUser } from "../../config/sessionUtils.js";

const MiPerfil = () => {
  const [doctor, setDoctor] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const { usuario_id } = getSessionUser();
  
    if (!usuario_id) {
      console.error("No se encontró ID de usuario en sesión");
      return;
    }

    fetch(`${API_BASE}hospital/obtener_doctores.php`)
      .then(res => res.json())
      .then(data => {
        const doctoresArray = Array.isArray(data.doctor) ? data.doctor : [];
  
        const encontrado = doctoresArray.find(
          doc => parseInt(doc.usuario_id) === parseInt(usuario_id)
        );
  
        if (!encontrado) {
          console.warn("No se encontró el doctor con usuario_id:", usuario_id);
        }
  
        setDoctor(encontrado || null);
      })
      .catch(err => {
        console.error("Error al cargar doctores:", err);
      });
  }, 
  []);

  if (notFound) {
    return <p style={{ padding: "20px", color: "red" }}>No se encontró el perfil del médico.</p>;
  }

  if (!doctor) {
    return <p style={{ padding: "20px" }}>Cargando...</p>;
  }

  return (
    <Card className="perfil-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="perfil-header">Mi Perfil</h2>
        <Button
          variant="success"
          className="btn-editar"
          onClick={() => window.location.href = "/medico/editar-perfil"}
        >
          Editar Perfil
        </Button>
      </div>

      <Row>
        <Col md={4} className="text-center">
          <Image
            src={doctor.foto_url || "https://via.placeholder.com/150"}
            className="perfil-foto"
            fluid
          />
          <p className="perfil-label mt-3">{doctor.nombre}</p>
        </Col>
        <Col md={8}>
          <Row>
            <Col sm={6}>
              <p className="perfil-label">Especialidad:</p>
              <p className="perfil-info">{doctor.especialidad}</p>
            </Col>
            <Col sm={6}>
              <p className="perfil-label">No. de colegiado:</p>
              <p className="perfil-info">{doctor.numero_colegiado}</p>
            </Col>
            <Col sm={6}>
              <p className="perfil-label">Universidad:</p>
              <p className="perfil-info">{doctor.universidad}</p>
            </Col>
            <Col sm={6}>
              <p className="perfil-label">Fecha de Graduación:</p>
              <p className="perfil-info">{doctor.fecha_graduacion}</p>
            </Col>
            <Col sm={6}>
              <p className="perfil-label">Correo:</p>
              <p className="perfil-info">{doctor.correo}</p>
            </Col>
            <Col sm={6}>
              <p className="perfil-label">Teléfono:</p>
              <p className="perfil-info">{doctor.telefono}</p>
            </Col>
          </Row>
        </Col>
      </Row>

      <hr />
      <h5 className="perfil-label mt-4">Título Universitario</h5>
      <Image
        src={doctor.titulo_url || "https://via.placeholder.com/200x120?text=Sin+Título"}
        className="titulo-imagen"
        fluid
      />
    </Card>
  );
};

export default MiPerfil;
