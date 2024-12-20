import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api"; // Asegúrate de que api.js esté configurado correctamente

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "", categoria: "", proveedor: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({ nombre: "", precio: "", stock: "", categoria: "", proveedor: "" });
  
  // Estado para manejar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false);

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

    const fetchProveedores = async () => {
      try {
        const response = await api.get("/Proveedor/");
        setProveedores(response.data);
      } catch (err) {
        console.log("Error al cargar los proveedores", err);
      }
    };

    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Producto/", formData);
      setProductos([...productos, response.data]);
      setFormData({ nombre: "", precio: "", stock: "", categoria: "", proveedor: "" });
      setShowForm(false); // Ocultar el formulario después de crear el producto
      setError("");
    } catch (err) {
      console.log(err.response ? err.response.data : err);
      setError("Error al crear el producto.");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/Producto/${editingProduct.id}/`, updatedData);
      setProductos(
        productos.map((prod) =>
          prod.id === editingProduct.id ? { ...prod, ...updatedData } : prod
        )
      );
      setEditingProduct(null);
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
    <div className="p-6 bg-gradient-to-br from-green-100 to-teal-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">
        Gestión de Productos
      </h1>

      {/* Botón para mostrar/ocultar el formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 mb-6"
      >
        {showForm ? "Cerrar Formulario" : "Nuevo Producto"}
      </button>

      {/* Formulario de creación de producto */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow-md w-auto mx-auto mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Producto</h2>
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Seleccionar Categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <select
            value={formData.proveedor}
            onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Seleccionar Proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Registrar Producto
          </button>
        </form>
      )}

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold">{producto.nombre}</h3>
            <p>Precio: {producto.precio}</p>
            <p>Stock: {producto.stock}</p>
            <button
              onClick={() => handleDelete(producto.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Producto;


