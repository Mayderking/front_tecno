import { useState, useEffect } from "react";
import api from "../api/api";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Venta = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    producto: "",
    cantidad: "",
    total: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [precioProducto, setPrecioProducto] = useState(0);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasResponse = await api.get("/Venta/");
        const productosResponse = await api.get("/Producto/");
        setVentas(ventasResponse.data);
        setProductos(productosResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductoChange = (e) => {
    const selectedProductoId = e.target.value;
    const productoSeleccionado = productos.find(
      (producto) => producto.id === parseInt(selectedProductoId)
    );
    setPrecioProducto(productoSeleccionado ? productoSeleccionado.precio : 0);
    setFormData({ ...formData, producto: selectedProductoId });
  };

  const handleCantidadChange = (e) => {
    const cantidad = e.target.value;
    const totalCalculado = cantidad * precioProducto || 0;
    setFormData({
      ...formData,
      cantidad,
      total: totalCalculado.toFixed(2),
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.producto) {
      setError("Debes seleccionar un producto.");
      return;
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      return;
    }

    try {
      const response = await api.post("/Venta/", formData);
      setVentas([...ventas, response.data]);
      setFormData({ producto: "", cantidad: "", total: "" });
      setError("");
      setShowForm(false);
    } catch (err) {
      setError("Error al registrar la venta se paso el limite del stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
    try {
      await api.delete(`/Venta/${id}/`);
      setVentas(ventas.filter((venta) => venta.id !== id));
    } catch (err) {
      setError("Error al eliminar la venta.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-primary mb-6 abril-fatface-regular">
          Gestión de Ventas
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#b6d7fd] text-black px-4 py-2 rounded shadow hover:bg-[#81a1c6] mb-6"
        >
          {showForm ? "Cerrar Formulario" : "Nueva Venta"}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-primary abril-fatface-regular">
                Registrar Nueva Venta
              </h2>
              <select
                value={formData.producto}
                onChange={handleProductoChange}
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              >
                <option value="">Seleccionar Producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cantidad"
                value={formData.cantidad}
                onChange={handleCantidadChange}
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <input
                type="number"
                placeholder="Total"
                value={formData.total}
                readOnly
                className="w-full mb-4 p-2 border rounded bg-[#1F252B] border-gray-800 focus:border-[#dec6ac] font-light outline-none text-white"
              />
              <button
                type="submit"
                className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6]"
              >
                Registrar Venta
              </button>
            </form>
          </motion.div>
        )}

        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventas.map((venta) => {
            const productoAsociado = productos.find(
              (producto) => producto.id === venta.producto
            );

            return (
              <div
                key={venta.id}
                className="bg-[#233953] rounded shadow-md p-4 border border-[#dec6ac]"
              >
                <h3 className="text-xl font-semibold text-primary abril-fatface-regular">
                  Venta ID: {venta.id}
                </h3>
                <p className="text-white">
                  Producto:{" "}
                  {productoAsociado ? productoAsociado.nombre : "No disponible"}
                </p>
                <p className="text-white">Cantidad: {venta.cantidad}</p>
                <p className="text-white">Total: ${venta.total}</p>
                <button
                  onClick={() => handleDelete(venta.id)}
                  className="bg-[#b6d7fd] text-black px-4 py-2 rounded hover:bg-[#81a1c6] mt-4"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Venta;
