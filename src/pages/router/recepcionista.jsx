import { Routes, Route } from "react-router-dom";
import BaseCrudRec from "../recepcionista/baseRec"
import GestionInsumosRec from "../recepcionista/insumosRec/gestionInsumosRec";
import GestionProveedoresRec from "../recepcionista/proveedoresRec/gestionProveedorRec";
import GestionComprasRec from "../recepcionista/comprasRec/gestionCompraRec"
import GestionServiciosRec from "../recepcionista/serviciosRec/gestionServicioRec";
import GestionManicuristaRec from "../recepcionista/manicuristasRec/gestionManicuristaRec";
import GestionAbastecimientosRec from "../recepcionista/abastecimientosRec/gestionAbastecimientoRec";
import GestionNovedadesRec from "../recepcionista/novedadesRec/gestionNovedadesRec";
import GestionClientesRec from "../recepcionista/clientesRec/gestionClientesRec";
import GestionCitasRec from "../recepcionista/citasRec/gestionCitasRec";
import GestionVentasRec from "../recepcionista/ventasRec/gestionVentasRec";
import GestionLiquidacionesRec from "../recepcionista/liquidacionesRec/gestionLiquidacionesRec";
import GestionConsumoRec from "../recepcionista/consumosRec/gestionConsumosRec";
import MedicionRec from "../recepcionista/medicionRec/medicionRec";
import PerfilRec from "../recepcionista/perfilRec/gestionPerfilRec";
import EditarPerfilRec from "../recepcionista/perfilRec/editarPerfilRec";

const RecepcionistaRoutes = () => {
    return (
        <BaseCrudRec>  {/* BaseCrud envuelve todas las rutas */}
            <Routes>
                {/* medicion o default */}
                <Route  path="/" element={<MedicionRec />} />
                {/*Ruta de insumos*/}
                <Route path="/insumos" element={<GestionInsumosRec />}/>
                {/*Ruta de proveedores*/}
                <Route path="/proveedores" element={<GestionProveedoresRec />}/>
                {/*Ruta de compras*/}
                <Route path="/compras" element={<GestionComprasRec />}/>
                {/*Ruta de servicios*/}
                <Route path="/servicios" element={<GestionServiciosRec />}/>
                {/*Ruta de manicuristas*/}
                <Route path="/manicuristas" element={<GestionManicuristaRec />}/>
                {/*Ruta de abastecimientos*/}
                <Route path="/abastecimientos" element={<GestionAbastecimientosRec />}/>
                {/*Ruta de novedades*/}
                <Route path="/novedades" element={<GestionNovedadesRec />}/>
                {/*Ruta de clientes*/}
                <Route path="/clientes" element={<GestionClientesRec />}/>
                {/*Ruta de citas*/}
                <Route path="/citas" element={<GestionCitasRec />}/>
                {/*Ruta de ventas*/}
                <Route path="/ventas" element={<GestionVentasRec />}/>
                {/*Ruta de liquidaciones*/}
                <Route path="/liquidaciones" element={<GestionLiquidacionesRec />}/>
                {/*Ruta del perfil*/}
                <Route path="/perfil" element={<PerfilRec />} />
                <Route path="/perfil/editarPerfil" element={<EditarPerfilRec />} />
                {/*Ruta de reportes*/}
                <Route path="/consumos" element={<GestionConsumoRec />}/>
            </Routes>
        </BaseCrudRec>
    );
};

export default RecepcionistaRoutes;
