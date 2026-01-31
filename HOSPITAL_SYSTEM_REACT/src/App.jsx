import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import MedicoLayout from "./layouts/MedicoLayout";
//import PacienteLayout from "./layouts/PacienteLayout";
//import HistorialClinico from "./pages/shared/HistorialClinico";
import SharedLayout from "./layouts/SharedLayout";
import RutaProtegida from "./components/RutaProtegida";


// Portal general
import Home from "./pages/portalG/Home"; 
import FAQ from "./pages/portalG/FAQ"; 
import Contacto from "./pages/portalG/Contacto";
import Nosotros from "./pages/portalG/Nosotros";
import EspecialidadesM from "./pages/portalG/EspecialidadesM";
import ListaMedicos from "./pages/portalG/ListaMedicos";
import LoginPage from "./pages/portalG/LoginPage";


// Admin
import AdminHome from "./pages/admin/AdminHome";
import Reportes from "./pages/admin/Reportes";
import Configuracion from "./pages/admin/Configuracion";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionDoctores from './pages/admin/GestionDoctores';
import GestionEspecialidades from './pages/admin/GestionEspecialidades';

// Shared
import GestionPacientes from './pages/shared/GestionPacientes';
import GestionCitas from './pages/shared/GestionCitas';
import CalendarioCitas from "./pages/shared/CalendarioCitas";
import HistorialPaciente from "./pages/shared//historial/HistorialPaciente";


// Medicos
import MedicoHome from './pages/medico/MedicoHome';
import MiPerfil from "./pages/medico/MiPerfil";
import AgendaMedico from "./pages/medico/AgendaMedico";
import EditarPerfil from "./pages/medico/EditarPerfil";
import PacientesAsignados from "./pages/medico/PacientesAsignados";
import FinalizarCita from "./pages/medico/FinalizarCita";
import PerfilPaciente from "./pages/medico/PerfilPaciente";


// Paciente
//import PacienteDashboard from "./pages/paciente/PacienteDashboard";
//import PacientePerfil from "./pages/paciente/PacientePerfil";


function App() {
  return (
    <Router>
      <Routes>
        {/* Portal General */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/especialidadesM" element={<EspecialidadesM />} />
          <Route path="/lista-medicos" element={<ListaMedicos />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes - Wrapped in AdminLayout*/}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/usuarios" element={<GestionUsuarios />} />
          <Route path="/admin/especialidades" element={<GestionEspecialidades />} />
          <Route path="/admin/doctores" element={<GestionDoctores />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
        </Route> 

        {/* Medico - Wrapped in Medico*/}
        <Route element={
          <RutaProtegida rolPermitido="doctor">
            <MedicoLayout />
          </RutaProtegida>
        }>
          <Route path="/medico" element={<MedicoHome />} />
          <Route path="/medico/perfil" element={<MiPerfil />} />
          <Route path="/medico/AgendaMedico" element={<AgendaMedico />} />
          <Route path="/medico/pacientes" element={<PacientesAsignados />} />
          <Route path="/medico/editar-perfil" element={<EditarPerfil />} />
          <Route path="/medico/finalizar-cita/:citaId" element={<FinalizarCita />} />
          <Route path="/medico/paciente/:id" element={
            <RutaProtegida rolPermitido="doctor">
              <PerfilPaciente />
            </RutaProtegida>
          } />
          <Route path="/medico/historial/:id" element={<HistorialPaciente />} />
        </Route>


        {/* SheredLayout */}
        <Route element={
          <RutaProtegida rolPermitido={['admin', 'empleado']}>
            <AdminLayout />
          </RutaProtegida>
        }>
          <Route path="/admin/gestion-citas" element={<GestionCitas />} />
          <Route path="/admin/pacientes" element={<GestionPacientes />} />
          <Route path="/admin/calendario" element={<CalendarioCitas />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;