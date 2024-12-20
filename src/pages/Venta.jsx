import { useState, useEffect } from "react";
import api from "../api/api";
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

  // Estado para manejar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false);

  // Cargar datos iniciales
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

  // Manejar cambios en el producto seleccionado
  const handleProductoChange = (e) => {
    const selectedProductoId = e.target.value;
    const productoSeleccionado = productos.find(
      (producto) => producto.id === parseInt(selectedProductoId)
    );
    setPrecioProducto(productoSeleccionado ? productoSeleccionado.precio : 0);
    setFormData({ ...formData, producto: selectedProductoId });
  };

  // Manejar cambios en la cantidad
  const handleCantidadChange = (e) => {
    const cantidad = e.target.value;
    const totalCalculado = cantidad * precioProducto || 0;
    setFormData({
      ...formData,
      cantidad,
      total: totalCalculado.toFixed(2), // Asegura formato decimal
    });
  };

  // Crear nueva venta
  const handleCreate = async (e) => {
    e.preventDefault();
    // Validación de campos antes de enviar
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
      setShowForm(false); // Ocultar el formulario después de crear la venta
    } catch (err) {
      setError("Error al registrar la venta se paso el limite del stock");
    }
  };

  // Eliminar venta
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
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-100 to-teal-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">
        Gestión de Ventas
      </h1>

      {/* Botón para mostrar/ocultar el formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 mb-6"
      >
        {showForm ? "Cerrar Formulario" : "Nueva Venta"}
      </button>

      {/* Formulario para registrar venta */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded shadow-md w-1/2 mx-auto mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Registrar Nueva Venta
          </h2>
          <select
            value={formData.producto}
            onChange={handleProductoChange}
            className="w-full mb-4 p-2 border rounded"
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
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Total"
            value={formData.total}
            readOnly
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Registrar Venta
          </button>
        </form>
      )}

      {/* Tabla de ventas */}
      <table className="table-auto w-full border border-gray-200 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Producto</th>
            <th className="border border-gray-300 px-4 py-2">Cantidad</th>
            <th className="border border-gray-300 px-4 py-2">Total</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            // Buscar el producto asociado en la lista de productos
            const productoAsociado = productos.find(
              (producto) => producto.id === venta.producto
            );
            return (
              <tr key={venta.id}>
                <td className="border border-gray-300 px-4 py-2">{venta.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {productoAsociado
                    ? productoAsociado.nombre
                    : "Producto no disponible"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {venta.cantidad}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {venta.total}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(venta.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Venta;
