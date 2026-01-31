import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 

const ListaMedicos = () => {
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    fetch("/data/medicos.json") 
      .then((response) => response.json())
      .then((data) => setMedicos(data))
      .catch((error) => console.error("Error cargando los médicos:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Médicos</h2>
      <div className="row">
        {medicos.map((medico) => (
          <div className="col-md-4 mb-4" key={medico.id}>
            <div className="card shadow-lg border-0">
              <img
                src={medico.foto}
                className="card-img-top rounded-top"
                alt={medico.nombre}
                style={{ height: "400px", objectFit: "cover" }} // Ajusta el tamaño de las imágenes
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">{medico.nombre}</h5>
                <p className="card-text text-muted">
                  <strong>N° de colegiado:</strong> {medico.colegiado}
                </p>
                <p className="card-text">
                  <strong>Especialidad:</strong> {medico.especialidad}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaMedicos;
