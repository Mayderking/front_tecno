import React from "react";
import { useNavigate } from "react-router-dom"; // Para navegar a otras páginas

const Welcome = () => {
  const navigate = useNavigate(); // Hook para redirigir

  const goToCategorias = () => {
    navigate("/categoria"); // Redirige a la página de Categorías
  };

  const goToProductos = () => {
    navigate("/Producto"); // Redirige a la página de Productos
  };

  const goToCarrito = () => {
    navigate("/Venta"); // Redirige a la página del Carrito
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a la Tienda</h1>
        <p className="text-lg mb-6">
          Estamos encantados de tenerte. Explora nuestras categorías y productos.
        </p>
        <div className="space-y-4">
          <button
            onClick={goToCategorias}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Ir a Categorías
          </button>
          <button
            onClick={goToProductos}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Ver Productos
          </button>
          <button
            onClick={goToCarrito}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Ver Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
