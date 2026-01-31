import { useParams } from "react-router-dom";
import HistorialPaciente from "../shared/historial/HistorialPaciente";

const HistorialMedicoWrapper = () => {
  const { pacienteId } = useParams();
  return <HistorialPaciente pacienteId={parseInt(pacienteId)} />;
};

export default HistorialMedicoWrapper;
