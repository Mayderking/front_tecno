import axios from "axios";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Base URL del backend
});

// Función para configurar el token de autenticación en los encabezados
export const setAuthToken = (token) => {
  if (token) {
    // Configurar el token JWT en el encabezado Authorization
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Eliminar el encabezado Authorization si no hay token
    delete api.defaults.headers.common["Authorization"];
  }
};

// Función para obtener un token de acceso
export const login = async (username, password) => {
  try {
    const response = await api.post("/token/", { username, password });
    console.log("Login exitoso:", response.data);
    return response.data; // Retorna los tokens (access y refresh)
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response || error);
    throw error;
  }
};

// Función para refrescar el token de acceso
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api.post("/token/refresh/", { refresh: refreshToken });
    console.log("Token renovado:", response.data);
    return response.data.access; // Retorna el nuevo token de acceso
  } catch (error) {
    console.error("Error al renovar el token de acceso:", error.response || error);
    throw error;
  }
};

export default api;