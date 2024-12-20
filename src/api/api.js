import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/token/", { username, password });
    console.log("Login exitoso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response || error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api.post("/token/refresh/", { refresh: refreshToken });
    console.log("Token renovado:", response.data);
    return response.data.access;
  } catch (error) {
    console.error("Error al renovar el token de acceso:", error.response || error);
    throw error;
  }
};

export default api;