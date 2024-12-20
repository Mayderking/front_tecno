import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setSuccess(false); // Limpiar éxito previo

    try {
      await api.post("/signup/", formData);
      setSuccess(true); // Indicar que el registro fue exitoso
      setTimeout(() => navigate("/login"), 2000); // Redirigir al login
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error al registrar el usuario.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">
            Registro exitoso. Redirigiendo al login...
          </p>
        )}
        <div className="mb-4">
          <label className="block mb-2">Usuario</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Correo</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Signup;


