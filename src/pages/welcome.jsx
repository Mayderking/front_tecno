import React from "react";
import image from "../assets/image2.png";
import { useNavigate } from "react-router-dom"; // Para navegar a otras páginas
import { motion } from "framer-motion";
import { FaBox, FaTags, FaShoppingCart } from "react-icons/fa"; // Importar iconos

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className="flex flex-col items-center justify-between h-screen bg-gray-900 text-white">
        {/* Imagen Principal */}
        <div className="relative w-full h-[20%] sm:h-[60%] flex justify-center items-center">
          <img
            src={image}
            alt="Future Technologies"
            className="w-auto max-h-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-full object-contain"
          />
        </div>

        {/* Sección de Iconos */}
        <div className="flex flex-wrap justify-center gap-12 sm:gap-24 px-4 py-28">
          <button
            onClick={goToProductos}
            className="flex flex-col items-center text-primary hover:text-[#917961]"
          >
            <FaBox size={32} className="sm:size-20" />
            <span className="mt-2 text-sm sm:text-base">PRODUCTOS</span>
          </button>
          <button
            onClick={goToCategorias}
            className="flex flex-col items-center text-primary hover:text-[#917961]"
          >
            <FaTags size={32} className="sm:size-20" />
            <span className="mt-2 text-sm sm:text-base">CATEGORÍAS</span>
          </button>
          <button
            onClick={goToCarrito}
            className="flex flex-col items-center text-primary hover:text-[#917961]"
          >
            <FaShoppingCart size={32} className="sm:size-20" />
            <span className="mt-2 text-sm sm:text-base">VENTAS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Welcome;
