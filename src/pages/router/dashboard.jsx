import { Routes, Route } from "react-router-dom";
import BaseCrud from "../dashboard/base";
import GestionRoles from "../dashboard/roles/gestionRoles";
import GestionUsuarios from "../dashboard/usuarios/gestionUsuario";
import GestionInsumos from "../dashboard/insumos/gestionInsumos";
import GestionProveedores from "../dashboard/proveedores/gestionProveedor";
import GestionCompras from "../dashboard/compras/gestionCompra";
import GestionServicios from "../dashboard/servicios/gestionServicio";
import GestionManicuristas from "../dashboard/manicuristas/gestionManicurista";
import GestionAbastecimientos from "../dashboard/abastecimientos/gestionAbastecimiento";
import GestionHorarios from "../dashboard/novedades/gestionHorarios";
import GestionClientes from "../dashboard/clientes/gestionClientes";
import GestionCitas from "../dashboard/citas/gestionCitas";
import GestionVentas from "../dashboard/ventas/gestionVentas";
import GestionLiquidaciones from "../dashboard/liquidaciones/gestionLiquidaciones";
import GestionReporte from "../dashboard/reportes/gestionReportes";
import Medicion from "../dashboard/medicion/medicion";
import Perfil from "../dashboard/perfil/gestionPerfil";
import EditarPerfil from "../dashboard/perfil/editarPerfil";

const DashboardRoutes = () => {
    return (
        <BaseCrud>  {/* BaseCrud envuelve todas las rutas */}
            <Routes>
                {/* medicion o default */}
                <Route  path="/" element={<Medicion />} />
                {/* rutas de roles */}
                <Route path="/roles" element={<GestionRoles />} />
                {/* rutas de usuarios*/}
                <Route path="/usuarios" element={<GestionUsuarios />}/>
                {/*Ruta de insumos*/}
                <Route path="/insumos" element={<GestionInsumos />}/>
                {/*Ruta de proveedores*/}
                <Route path="/proveedores" element={<GestionProveedores />}/>
                {/*Ruta de compras*/}
                <Route path="/compras" element={<GestionCompras />}/>
                {/*Ruta de servicios*/}
                <Route path="/servicios" element={<GestionServicios />}/>
                {/*Ruta de manicuristas*/}
                <Route path="/manicuristas" element={<GestionManicuristas />}/>
                {/*Ruta de abastecimientos*/}
                <Route path="/abastecimientos" element={<GestionAbastecimientos />}/>
                {/*Ruta de novedades*/}
                <Route path="/novedades" element={<GestionHorarios />}/>
                {/*Ruta de clientes*/}
                <Route path="/clientes" element={<GestionClientes />}/>
                {/*Ruta de citas*/}
                <Route path="/citas" element={<GestionCitas />}/>
                {/*Ruta de ventas*/}
                <Route path="/ventas" element={<GestionVentas />}/>
                {/*Ruta de liquidaciones*/}
                <Route path="/liquidaciones" element={<GestionLiquidaciones />}/>
                {/*Ruta del perfil*/}
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/editarPerfil" element={<EditarPerfil />} />
                {/*Ruta de reportes*/}
                <Route path="/consumos" element={<GestionReporte />}/>
            </Routes>
        </BaseCrud>
    );
};

export default DashboardRoutes;
