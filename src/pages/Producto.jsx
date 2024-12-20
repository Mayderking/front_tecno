import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api/api"; // Asegúrate de que api.js esté configurado correctamente

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No estás autenticado. Inicia sesión para continuar.");
      setLoading(false);
      return;
    }

    const fetchProductos = async () => {
      try {
        const response = await api.get("/Producto/");
        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los productos.");
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await api.get("/Categoria/");
        setCategorias(response.data);
      } catch (err) {
        console.log("Error al cargar las categorías", err);
      }
    };

    fetchProductos();
    fetchCategorias();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Producto/", formData);
      setProductos([...productos, response.data]);
      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        categoria: "",
      });
      setShowForm(false);
      setError("");
    } catch (err) {
      console.log(err.response ? err.response.data : err);
      setError("Error al crear el producto.");
    }
  };

  const handleEditClick = (producto) => {
    setEditingProduct(producto);
    setUpdatedData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Producto/${editingProduct.id}/`, updatedData);
      setProductos(
        productos.map((prod) =>
          prod.id === editingProduct.id ? { ...prod, ...updatedData } : prod
        )
      );
      setEditingProduct(null);
      setShowEditForm(false);
      setError("");
    } catch (err) {
      setError("Error al actualizar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/Producto/${id}/`);
      setProductos(productos.filter((prod) => prod.id !== id));
    } catch (err) {
      setError("Error al eliminar el producto.");
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 abril-fatface-regular">
          Gestión de Productos
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#b6d7fd] text-black px-4 py-2 rounded shadow hover:bg-[#81a1c6] mb-6"
        >
          {showForm ? "Cerrar Formulario" : "Nuevo Producto"}
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
                Registrar Nuevo Producto
              </h2>
              <input
                type="text"
                placeholder="Nombre del Producto"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <select
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6]"
              >
                Registrar Producto
              </button>
            </form>
          </motion.div>
        )}

        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleUpdate}
              className="bg-[#233953] p-4 rounded shadow-md w-auto mx-auto mb-6"
            >
              <h2 className="text-xl font-semibold text-primary mb-4 abril-fatface-regular">
                Editar Producto
              </h2>
              <input
                type="text"
                placeholder="Nombre del Producto"
                value={updatedData.nombre}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, nombre: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <input
                type="number"
                placeholder="Precio"
                value={updatedData.precio}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, precio: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <input
                type="number"
                placeholder="Stock"
                value={updatedData.stock}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, stock: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <select
                value={updatedData.categoria}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, categoria: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6]"
              >
                Guardar Cambios
              </button>
            </form>
          </motion.div>
        )}

        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-[#233953] rounded shadow-md p-4 border border-[#dec6ac] "
            >
              <h3 className="text-xl font-semibold text-primary abril-fatface-regular">
                {producto.nombre}
              </h3>
              <p className="text-white">Precio: {producto.precio}</p>
              <p className="text-white">Stock: {producto.stock}</p>
              <button
                onClick={() => handleEditClick(producto)}
                className="bg-[#dec6ac] text-black px-4 py-2 rounded hover:bg-[#c1a48a] mt-4 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(producto.id)}
                className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6] mt-4"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Producto;
