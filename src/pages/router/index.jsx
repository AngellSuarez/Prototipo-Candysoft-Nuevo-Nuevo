import { Routes, Route } from "react-router-dom";
import Login from "../cuentas/login";
import Registro from "../cuentas/register";
import Recuperar1 from "../cuentas/recuperar1";
import Recuperar2 from "../cuentas/recuperar2";
import Recuperar3 from "../cuentas/recuperar3";
import DashboardRoutes from "./dashboard";
import ManicuristaRoutes from "./manicurista";
import ClienteRoutes from "./cliente";
import Inicio from "../cliente/inicio/inicio";
import NosotrosInicio from "../cliente/inicio/nosotrosinicio"; 
import ServiciosInicio from "../cliente/inicio/servicioinicio"
import ServicioDetalleInicio from "../cliente/inicio/servicioDetalleInicio"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} />
      <Route path="/recuperacion-contraseña" element={<Recuperar1 />} />
      <Route path="/code" element={<Recuperar2 />} />
      <Route path="/reset-password" element={<Recuperar3 />} />
      
      <Route path="/nosotros/inicio" element={<NosotrosInicio />} />
      <Route path="/servicios/inicio" element={<ServiciosInicio />} />
      <Route path="/servicios/detalles/inicio/:id" element={<ServicioDetalleInicio />} />

      <Route path="/administrador/dashboard*" element={<DashboardRoutes />} />
      
      <Route path="/cliente/*" element={<ClienteRoutes />} />

      <Route path="/manicurista/dashboard/*" element={<ManicuristaRoutes /> } />

      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
};

export default AppRouter;
