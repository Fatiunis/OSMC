
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config.js";
import "../../styles/LoginPage.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      console.log("Enviando:", JSON.stringify(credentials));
      const res = await fetch("https://proyectobd-production.up.railway.app/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error en la autenticación: ${res.status}`);
      }
  
      const data = await res.json();
      console.log("Respuesta del servidor:", data);
  
      if (data.success) {
        const usuario = data.usuario;
        const rol = usuario.rol.toLowerCase();
  
        // ✅ Guardamos toda la info necesaria en la sesión
        sessionStorage.setItem("usuario_id", data.usuario.id); // Asegura esto
        sessionStorage.setItem("rol", data.usuario.rol.toLowerCase());
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

        // ✅ Redirigimos según el rol
        switch (rol) {
          case "admin":
          case "secretaria":
            navigate("/admin");
            break;
          case "doctor":
            navigate("/medico");
            break;
          case "paciente":
            navigate("/paciente");
            break;
          default:
            setError("Rol no reconocido");
            navigate("/");
        }
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      setError("Error de conexión. Por favor, intente más tarde.");
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={credentials.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
