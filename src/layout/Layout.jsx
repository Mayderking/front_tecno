import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const Layout = () => {
  const [nav, setNav] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  const handleLogout = () => {
    if (!isAuthenticated) {
      alert("No puedes cerrar sesión sin haber iniciado sesión.");
      return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    logout();

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
      <div className="fixed top-0 left-0 w-full bg-[#8b95a0] backdrop-blur-md z-50">
        <div
          className="max-w-[1300px] mx-auto flex justify-between text-white
        text-xl items-center px-12 h-20 abril-fatface-regular"
        >
          <Link to="/Welcome" className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <span>TECNOPRODUCTS</span>
          </Link>

          <ul className="hidden md:flex gap-12 z-10 cursor-pointer">
            <li>
              <Link to="/Categoria">Categorías</Link>
            </li>
            <li>
              <Link to="Producto">Productos</Link>
            </li>
            <li>
              <Link to="Venta">Ventas</Link>
            </li>
            <li>
              <Link
                onClick={handleLogout}
                className="top-2 text-white-600 hover:text-red-900 "
              >
                <FaArrowRightFromBracket />
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
                  to="/Categoria"
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
                  to="/Producto"
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
                  to="/Venta"
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

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
