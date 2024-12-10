import React, { useState, useEffect } from "react";
import axios from "axios";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [error, setError] = useState("");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // Asegúrate de usar la URL de tu backend
  });

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/Categoria/");
        setCategorias(response.data);
      } catch (err) {
        setError("Error al cargar las categorías.");
      }
    };
    fetchCategories();
  }, []);

  // Crear nueva categoría
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }
    try {
      const response = await api.post("/Categoria/", { nombre, descripcion });
      setCategorias([...categorias, response.data]);
      setNombre("");
      setDescripcion("");
      setError("");
    } catch (err) {
      setError("Error al crear la categoría.");
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    try {
      await api.delete(`/Categoria/${id}/`);
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Error al eliminar la categoría.");
    }
  };

  // Actualizar categoría
  const handleUpdate = async () => {
    if (!updatedName.trim() || !updatedDescription.trim()) {
      setError("El nombre y la descripción no pueden estar vacíos.");
      return;
    }
    try {
      await api.put(`/Categoria/${editingCategory.id}/`, {
        nombre: updatedName,
        descripcion: updatedDescription,
      });
      setCategorias(
        categorias.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, nombre: updatedName, descripcion: updatedDescription }
            : cat
        )
      );
      setEditingCategory(null);
      setError("");
    } catch (err) {
      setError("Error al actualizar la categoría.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulario para agregar nueva categoría */}
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          className="border p-2 rounded w-full"
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la categoría"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Agregar
        </button>
      </form>

      {/* Tabla de categorías */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td className="border border-gray-300 px-4 py-2">{categoria.id}</td>
              <td className="border border-gray-300 px-4 py-2">{categoria.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{categoria.descripcion}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(categoria);
                    setUpdatedName(categoria.nombre);
                    setUpdatedDescription(categoria.descripcion);
                  }}
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Editar Categoría</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Nombre"
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Descripción"
            />
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;

