import { Link, useLocation } from "react-router-dom";
import { FaUserMd, FaClipboardList, FaHospitalUser, FaCalendarCheck, FaCog, FaChartBar, FaUsers, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import "../styles/AdminSidebar.css"; 
import LogoutButton from "../components/LogoutButton";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">
        <Link to="/admin" className="admin-title-link">Administrador</Link>
      </h2>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
          <FaUsers className="icon" /> Inicio 
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/usuarios" className={location.pathname === "/admin/usuarios" ? "active" : ""}>
          <FaUsers className="icon" /> Gestión de Usuarios
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/doctores" className={location.pathname === "/admin/doctores" ? "active" : ""}>
        <FaUserMd className="icon" /> Gestión de Doctores
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/pacientes" className={location.pathname === "/admin/pacientes" ? "active" : ""}>
          <FaUsers className="icon" /> Gestión de Pacientes
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/especialidades" className={location.pathname === "/admin/especialidades" ? "active" : ""}>
          <FaClipboardList className="icon" /> Especialidades Médicas
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/gestion-citas" className={location.pathname === "/admin/gestion-citas" ? "active" : ""}>
          <FaCalendarCheck className="icon" /> Gestión de Citas
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/calendario" className={location.pathname === "/admin/calendario" ? "active" : ""}>
          <FaCalendarAlt className="icon" /> Calendario de Citas
        </Nav.Link>
        
        <Nav.Link as={Link} to="/admin/reportes" className={location.pathname === "/admin/reportes" ? "active" : ""}>
          <FaChartBar className="icon" /> Reportes y Estadísticas
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/configuracion" className={location.pathname === "/admin/configuracion" ? "active" : ""}>
          <FaCog className="icon" /> Configuración
        </Nav.Link>
      </Nav>

      {/* Contenedor del LogoutButton para alinearlo correctamente */}
      <div className="logout-container">
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminSidebar;
