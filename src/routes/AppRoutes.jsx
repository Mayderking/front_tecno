import { BrowserRouter, Routes, Route } from "react-router-dom";
import Categoria from "../pages/Categoria";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
        <Route path="Categoria" element={<Categoria />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
