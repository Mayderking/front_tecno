import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importar useNavigate
import api, { setAuthToken } from "../api/api";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Inicializar navigate

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token); // Configura el token en Axios
    } else {
      setError(
        <>
        No estás autenticado. Inicia sesión para continuar.{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Ir al Login
        </Link>
      </>
      );
      setLoading(false);
      return;
    }

    api
      .get("/Categoria/")
      .then((response) => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError(
            "No tienes permisos para ver las categorías. Inicia sesión nuevamente."
          );
        } else {
          setError("Error al cargar las categorías.");
        }
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Categoria/", formData);
      setCategorias([...categorias, response.data]);
      setFormData({ nombre: "", descripcion: "" });
      setShowForm(false);
    } catch (err) {
      setError("Error al crear la categoría.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/Categoria/${id}/`);
      setCategorias(categorias.filter((categoria) => categoria.id !== id));
    } catch (err) {
      setError("Error al eliminar la categoría.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Gestión de Categorías
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 mb-6"
      >
        {showForm ? "Cerrar Formulario" : "Nueva Categoría"}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded shadow-md w-1/2 mx-auto mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Registrar Nueva Categoría
          </h2>
          <input
            type="text"
            placeholder="Nombre de la Categoría"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />
          <textarea
            placeholder="Descripción de la Categoría"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Registrar Categoría
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white rounded shadow-md p-4 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {categoria.nombre}
            </h2>
            <p className="text-gray-600">{categoria.descripcion}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(categoria.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Categoria;
