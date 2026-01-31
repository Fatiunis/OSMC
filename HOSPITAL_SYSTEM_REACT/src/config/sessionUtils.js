// src/config/sessionUtils.js

/**
 * Obtiene los datos del usuario almacenados en el localStorage.
 * Si no hay usuario, devuelve un objeto vacío para evitar errores de undefined.
 */
export const getSessionUser = () => {
    try {
        const user = localStorage.getItem("usuario");
        return user ? JSON.parse(user) : {};
    } catch (error) {
        console.error("Error al obtener la sesión:", error);
        return {};
    }
};

/**
 * Guarda los datos del usuario en el localStorage
 */
export const setSessionUser = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
};

/**
 * Elimina la sesión del usuario
 */
export const clearSession = () => {
    localStorage.removeItem("usuario");
};
