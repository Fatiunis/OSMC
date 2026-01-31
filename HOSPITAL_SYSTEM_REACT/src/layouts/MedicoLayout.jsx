import { Outlet } from "react-router-dom";
import MedicoSidebar from "../components/MedicoSidebar";  
import "../styles/AdminLayout.css"; 

const MedicoLayout = () => {
  return (
    <div className="admin-layout">
      <MedicoSidebar />
      <div className="admin-content">
        <Outlet /> {/* Aquí carga la vista seleccionada */}
      </div>
    </div>
  );
};

export default MedicoLayout;
