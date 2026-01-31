import { Outlet } from "react-router-dom";
import PacienteNavbar from "../components/PacienteNavbar"; 
import "../styles/PacienteLayout.css";

const PacienteLayout = () => {
  return (
    <div className="paciente-layout">
      <PacienteNavbar />
      <div className="paciente-content">
        <Outlet />
      </div>
    </div>
  );
};

export default PacienteLayout;
