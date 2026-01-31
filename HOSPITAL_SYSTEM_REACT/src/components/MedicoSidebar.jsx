import { Link, useLocation } from "react-router-dom";
import { FaUserMd, FaClipboardList, FaHospitalUser, FaCalendarCheck, FaCog, FaChartBar, FaUsers, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import "../styles/AdminSidebar.css"; 
import LogoutButton from "../components/LogoutButton";

const MedicoSidebar = () => {
  const location = useLocation();

  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">
        <Link to="/medico" className="admin-title-link">Doctor</Link>
      </h2>

      <Nav.Link as={Link} to="/medico" className={location.pathname === "/medico" ? "active" : ""}>
        <FaUsers className="icon" /> Inicio 
      </Nav.Link>
      <Nav.Link as={Link} to="/medico/perfil" className={location.pathname === "/medico/perfil" ? "active" : ""}>
        <FaUserMd className="icon" /> Mi Perfil
      </Nav.Link>
      <Nav.Link as={Link} to="/medico/AgendaMedico" className={location.pathname === "/medico/AgendaMedico" ? "active" : ""}>
        <FaCalendarCheck className="icon" /> Mi Calendario
      </Nav.Link>
      <Nav.Link as={Link} to="/medico/pacientes" className={location.pathname === "/medico/pacientes" ? "active" : ""}>
        <FaUsers className="icon" /> Pacientes Asignados
      </Nav.Link>

      {/* Contenedor del LogoutButton para alinearlo correctamente */}
      <div className="logout-container">
        <LogoutButton />
      </div>
    </div>
  );
};

export default MedicoSidebar;
