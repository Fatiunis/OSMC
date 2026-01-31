import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";  
import "../styles/AdminLayout.css"; 

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet /> {/* Aquí carga la vista seleccionada */}
      </div>
    </div>
  );
};

export default AdminLayout;
