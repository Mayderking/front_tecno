import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api/api";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 abril-fatface-regular">
          Gestión de Categorías
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#b6d7fd] text-black px-4 py-2 rounded shadow hover:bg-[#81a1c6] mb-6"
        >
          {showForm ? "Cerrar Formulario" : "Nueva Categoría"}
        </button>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleCreate}
              className="bg-[#233953] p-4 rounded shadow-md w-auto mx-auto mb-6"
            >
              <h2 className="text-xl font-semibold text-primary mb-4 abril-fatface-regular">
                Registrar Nueva Categoría
              </h2>
              <input
                type="text"
                placeholder="Nombre de la Categoría"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <textarea
                placeholder="Descripción de la Categoría"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <button
                type="submit"
                className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6]"
              >
                Registrar Categoría
              </button>
            </form>
          </motion.div>
        )}

        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-[#233953] rounded shadow-md p-4 border border-[#dec6ac]"
            >
              <h2 className="text-lg font-semibold text-primary mb-2 abril-fatface-regular">
                {categoria.nombre}
              </h2>
              <p className="text-white">{categoria.descripcion}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6]"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 mt-4 absolute top-[155px] right-[1350px] ">
            {error}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Categoria;
