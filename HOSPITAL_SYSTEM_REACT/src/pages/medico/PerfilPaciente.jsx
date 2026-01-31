// pages/medico/PerfilPaciente.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PerfilPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/medico/historial/${id}`, { replace: true });
  }, [id, navigate]);

  return null;
};

export default PerfilPaciente;
