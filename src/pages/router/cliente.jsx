import { Routes, Route } from "react-router-dom";
import InicioCliente from "../cliente/base";
import Calificacion from "../cliente/calificanos/calificacion";
import Nosotros from "../cliente/nosotros/nosotros";
import Servicios from "../cliente/servicios/servicios";
import ServicioDetalle from "../cliente/servicios/ServicioDetalle";
import CrearCita from "../cliente/citas/crearCita";
import VerCita from "../cliente/citas/verCitas";
import ClientePerfil from "../cliente/perfil/clientePerfil"

const ClienteRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<InicioCliente />} />
      <Route path="/calificanos" element={<Calificacion />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/:id" element={<ServicioDetalle />} />
      <Route path="/citas/crear" element={<CrearCita />} />
      <Route path="/citas/ver" element={<VerCita />} />
      <Route path="/perfil" element={<ClientePerfil />} />
    </Routes>
  );
};

export default ClienteRoutes;
