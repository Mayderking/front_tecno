import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "../pages/welcome";
import Categoria from "../pages/Categoria";
import Venta from "../pages/Venta";
import Producto from "../pages/Producto";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Layout from "../layout/Layout";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={ <ProtectedRoute><Layout /></ProtectedRoute> }>
            <Route path="Welcome" element={<Welcome />} />
            <Route path="Categoria" element={<Categoria />} />
            <Route path="Producto" element={<Producto />} />
            <Route path="Venta" element={<Venta />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
