import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Tu contexto de autenticación
import api, { setAuthToken } from "../api/api"; // Axios configurado con manejo de tokens

const Login = () => {
  const { isAuthenticated, login } = useAuth(); // `login` debe configurar el token en el contexto
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica si el token ya está presente en el localStorage al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Si hay un token, se considera que el usuario ya está autenticado y redirigimos
      navigate("/Welcome"); // O la ruta principal de la tienda
    }
  }, [navigate]);

  // Redirigir si el usuario ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/Welcome" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Limpiar errores previos

    try {
      // Solicitar tokens al backend
      const response = await api.post("/token/", formData);
      const { access, refresh } = response.data;

      // Guardar tokens en localStorage o sessionStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Configurar token de acceso en Axios
      setAuthToken(access);

      // Actualizar el estado de autenticación
      login(access);

      // Redirigir al dashboard
      navigate("/Welcome");
    } catch (err) {
      // Manejar errores (por ejemplo, credenciales inválidas)
      setError(
        err.response?.data?.detail || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-primary text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-white">
            Usuario
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>

        {/* Enlace para registrarse */}
        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            ¿No tienes cuenta?{" "}
            <a href="/Signup" className="text-blue-500 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;



