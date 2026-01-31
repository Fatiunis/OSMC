import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
// Puedes reemplazar esto cuando crees el sidebar del empleado
// import EmpleadoSidebar from "../components/EmpleadoSidebar";
import "../styles/AdminLayout.css";

const SharedLayout = () => {
  const rol = sessionStorage.getItem('rol');

  return (
    <div className="admin-layout">
      {/* Reutilizamos el sidebar del admin temporalmente */}
      {rol === 'admin' && <AdminSidebar />}
      {/* Cuando esté listo el layout de secretaria:
          {rol === 'empleado' && <EmpleadoSidebar />} 
      */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SharedLayout;
