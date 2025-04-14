import { Routes, Route } from "react-router-dom";
import BaseCrudMan from "../manicurista/baseMan";
import GestionNovedadesMan from "../manicurista/novedadesMan/gestionNovedadesMan";
import GestionCitasMan from "../manicurista/citasMan/gestionCitasMan";
import GestionLiquidacionesMan from "../manicurista/liquidacionesMan/gestionLiquidacionesMan";
import GestionConsumoMan from "../manicurista/consumoMan/gestionConsumoMan";
import PerfilMan from "../manicurista/perfilMan/gestionPerfilMan";
import EditarPerfilMan from "../manicurista/perfilMan/editarPerfilMan";
import MedicionMan from "../manicurista/medicionMan/medicionMan";

const ManicuristaRoutes = () => {
    return (
        <BaseCrudMan>  {/* BaseCrud envuelve todas las rutas */}
            <Routes>
                {/* medicion o default */}
                <Route  path="/" element={<MedicionMan />} />
                {/*Ruta de novedades*/}
                <Route path="/novedades" element={<GestionNovedadesMan />}/>
                {/*Ruta de citas*/}
                <Route path="/citas" element={<GestionCitasMan />}/>
                {/*Ruta de liquidaciones*/}
                <Route path="/liquidaciones" element={<GestionLiquidacionesMan />}/>
                {/*Ruta del perfil*/}
                <Route path="/perfil" element={<PerfilMan />} />
                <Route path="/perfil/editar" element={<EditarPerfilMan />} />
                {/*Ruta de reportes*/}
                <Route path="/consumo" element={<GestionConsumoMan />}/>
            </Routes>
        </BaseCrudMan>
    );
};

export default ManicuristaRoutes;
