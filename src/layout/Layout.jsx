import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // Tu contexto de autenticación
import { Outlet } from "react-router-dom";  // Importa Outlet desde react-router-dom

const Layout = () => {
  const [nav, setNav] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Asegúrate de tener un método logout en tu contexto
  const navigate = useNavigate();

  const toggleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  const handleLogout = () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      alert("No puedes cerrar sesión sin haber iniciado sesión.");
      return; // Evita que se cierre la sesión si no está logueado
    }
  
    // Eliminar tokens del localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  
    // Llamar a logout del contexto
    logout();
  
    // Redirigir al login
    navigate("/login");
  };  

  const menuVariants = {
    open: {
      x: 0,
      transition: {
        stiffness: 20,
        damping: 15,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        stiffness: 20,
        damping: 15,
      },
    },
  };

  return (
    <div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-[#8b95a0] backdrop-blur-md z-50">
        <div
          className="max-w-[1300px] mx-auto flex justify-between text-white
        text-xl items-center px-12 h-20"
        >
          <p>TecnoProducts</p>

          <ul className="hidden md:flex gap-12 z-10 cursor-pointer">
            <li>
              <Link to="Categoria" smooth={true} offset={50} duration={500}>
                Categorías
              </Link>
            </li>
            <li>
              <Link to="productos" smooth={true} offset={50} duration={500}>
                Productos
              </Link>
            </li>
            <li>
              <Link to="carrito" smooth={true} offset={50} duration={500}>
                Carrito
              </Link>
            </li>
            <li>
              <Link
               onClick={handleLogout}
               className="text-white-600 hover:text-red-900 "
               >
                Cerrar sesion
              </Link>
            </li>
          </ul>

          <div onClick={toggleNav} className="md:hidden z-50 text-gray-200">
            {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
          </div>

          <motion.div
            initial={false}
            animate={nav ? "open" : "closed"}
            variants={menuVariants}
            className="fixed left-0 top-0 w-full min-h-screen bg-gray-900 z-40"
          >
            <ul className="font-semibold text-4xl space-y-8 mt-24 text-center">
              <li>
                <Link
                  to="categoria"
                  onClick={closeNav}
                  smooth={true}
                  offset={50}
                  duration={500}
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  to="productos"
                  onClick={closeNav}
                  smooth={true}
                  offset={50}
                  duration={500}
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="carrito"
                  onClick={closeNav}
                  smooth={true}
                  offset={50}
                  duration={500}
                >
                  Carrito
                </Link>
              </li>
              <li>
              <Link
               onClick={handleLogout}
               className=" text-white-600 hover:text-red-900"
               >
                Cerrar sesion
              </Link>
            </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Outlet for Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

