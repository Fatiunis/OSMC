
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children, rolPermitido }) => {
  const rol = sessionStorage.getItem('rol');
  
  console.log('Rol actual:', rol);
  console.log('Rol permitido:', rolPermitido);

  if (!rol) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(rolPermitido)) {
    if (!rolPermitido.includes(rol)) {
      return <Navigate to="/" replace />;
    }
  } else if (rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;