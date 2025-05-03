import React, { useState } from "react";
import "../../../css/gestionar.css";
import "../../../css/reporte.css";
import { AiOutlineEye } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionReporte = () => {

    const [reportes, setReportes] = useState([
        { id: 1, manicurista: "Laura Yepes", fecha: "12/03/2025" },
        { id: 2, manicurista: "Ana Osorio", fecha: "11/02/2025" },
        { id: 3, manicurista: "Sofia Arroyave", fecha: "23/03/2025" },
    ]);

    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const reportePorPagina = 4;


    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (reporte) => {
        setReporteSeleccionado(reporte);
        setVerModalOpen(true);
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarReporte = (reporte) => {
        MySwal.fire({
            title: `Anular el consumo`,
            html: `
                            <p class="texto-blanco">¿Estás seguro de que deseas anular el consumo de  <strong>${reporte.manicurista}</strong>?</p>
                            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7e2952',
            cancelButtonColor: '#d8d6d7',
            reverseButtons: true,
            customClass: {
                popup: 'swal-rosado'
            }
        })
    };

    const closeVerModal = () => {
        setReporteSeleccionado(null);
        setVerModalOpen(false);
    };


    const handleToggleEstado = (id) => {
        setReportes(reportes.map(reporte =>
            reporte.id === id ? { ...reporte, estado: !reporte.estado } : reporte
        ));
    };


    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const reportesFiltrados = reportes.filter(reporte =>
        Object.values(reporte).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoReporte = paginaActual * reportePorPagina;
    const indexPrimerReporte = indexUltimoReporte - reportePorPagina;
    const reportesActuales = reportesFiltrados.slice(indexPrimerReporte, indexUltimoReporte);
    const totalPaginas = Math.ceil(reportesFiltrados.length / reportePorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };


    const today = new Date();
    const formattedToday = format(today, "yyyy-MM-dd");

    const [selectedDate, setSelectedDate] = useState(formattedToday);
    const [selectedManicurista, setSelectedManicurista] = useState("");
    const [errorManicurista, setErrorManicurista] = useState(false);

    const [erroresFormulario, setErroresFormulario] = useState({});
    const [formData, setFormData] = useState({ manicurista: "" });
    const [errores, setErrores] = useState({});


    const handleCrearReporte = () => {
        if (!formData.manicurista) {
            setErrores({ manicurista: "Campo obligatorio" });
            alert("Debes seleccionar una manicurista");
            return;
        }

        const nuevoReporte = {
            id: reportes.length + 1,
            manicurista: formData.manicurista,
            fecha: selectedDate,
            estado: true
        };

        setReportes([...reportes, nuevoReporte]);
        setFormData({
            manicurista: ""
        });
        setErrores({});
        closeCrearModal();
    };

    const manicuristas = [
        { id: 1, nombre: "Ana Osorio", abastecimientos: [] },
        {
            id: 2,
            nombre: "Laura Yepes",
            abastecimientos: [
                { fecha: "2025-04-04", insumos: ["Esmalte rojo", "Algodón"] },
                { fecha: "2025-04-01", insumos: ["Esmalte azul", "Removedor"] },
            ],
        },
        {
            id: 3,
            nombre: "Sofía Arroyave",
            abastecimientos: [
                { fecha: "2025-04-08", insumos: ["Lima de uñas", "Alcohol"] },
                { fecha: "2025-04-11", insumos: ["Brillo", "Base fortalecedora"] },
            ],
        },
    ];

    const manicurista = manicuristas.find((m) => m.id === Number(selectedManicurista));

    const fechaAyer = new Date();
    fechaAyer.setDate(fechaAyer.getDate() - 1);
    const formattedAyer = format(fechaAyer, "yyyy-MM-dd");

    const abastecimientosPendientes =
        manicurista?.abastecimientos.filter((a) => a.fecha === formattedAyer) || [];

    const reporte = {
        fechaReporte: "2025-04-7",
        manicurista: "Laura Yepes",
        abastecimientos: [
            {
                fechaAbastecimiento: "2025-04-6",
                insumos: [
                    { nombre: "Esmalte rojo", estado: "Agotado", observacion: "Usado en varias clientas" },
                    { nombre: "Algodón", estado: "Disponible", observacion: "Mitad del paquete" },
                    { nombre: "Removedor de esmalte", estado: "Disponible", observacion: "Nuevo" },
                ],
            },
        ],
    };

    const { darkMode } = useTheme();

    const [isNotificacionesModalOpen, setIsNotificacionesModalOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([
        { id: 1, mensaje: "Nueva novedad creada por Paula. Cambio en el horario de ingreso" },
        { id: 2, mensaje: "Se ha agendado una cita para el 03/05/2025." }
    ]);

    const openNotificacionesModal = () => setIsNotificacionesModalOpen(true);
    const closeNotificacionesModal = () => setIsNotificacionesModalOpen(false);

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="fila-formulario">
                <h1 className="titulo">Gestión de consumos</h1>

                <div className="iconos-perfil">
                    <div className="bell-container" onClick={openNotificacionesModal}>
                        <span title="Ver tus notificaciones">
                            <Bell className="icon" />
                        </span>
                        {notificaciones.length > 0 && (
                            <span className="notification-badge" title="Ver tus notificaciones">
                                {notificaciones.length > 99 ? "99+" : notificaciones.length}
                            </span>
                        )}
                    </div>

                    <Link to="/administrador/dashboard/perfil">
                        <span title="Tú perfil">
                            <User className="icon" />
                        </span>
                    </Link>

                </div>
            </div>
            <button onClick={openCrearModal} className="crear-btn mt-4">
                Crear consumo
            </button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar consumo..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Manicurista</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportesActuales.length > 0 ? (
                            reportesActuales.map((reporte) => (
                                <tr key={reporte.id}>
                                    <td>{reporte.manicurista}</td>
                                    <td>{reporte.fecha}</td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => openVerModal(reporte)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del consumo"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminarReporte(reporte)}
                                            className="acciones-btn eliminar-btn"
                                            title="Anular consumo"
                                        >
                                            <MdBlock size={18} className="text-red-500 hover:text-red-700" />

                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron reportes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="paginacion-container">
                <div
                    className={`flecha ${paginaActual === 1 ? 'flecha-disabled' : ''}`}
                    onClick={() => cambiarPagina(paginaActual - 1)}
                >
                    &#8592;
                </div>

                <span className="texto-paginacion">
                    Página {paginaActual} de {totalPaginas}
                </span>

                <div
                    className={`flecha ${paginaActual === totalPaginas ? 'flecha-disabled' : ''}`}
                    onClick={() => cambiarPagina(paginaActual + 1)}
                >
                    &#8594;
                </div>
            </div>

            {isCrearModalOpen && (
                <div className="overlay-popup" onClick={closeCrearModal}>
                    <div className="ventana-popup max-h-[300vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Crear consumo</h2>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    if (!selectedManicurista) {
                                        setErroresFormulario({
                                            manicurista: "Seleccionar manicurista *",
                                            abastecimientos: ""
                                        });
                                        return;
                                    }

                                    if (abastecimientosPendientes.length === 0) {
                                        setErroresFormulario(prev => ({
                                            ...prev,
                                            abastecimientos: "Esta manicurista no tiene abastecimientos pendientes del día anterior"
                                        }));
                                        return;
                                    }

                                    handleCrearReporte();

                                }}
                                className="space-y-3"
                            >
                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            className="input-fecha-activo-fecha-cita"
                                            type="date"
                                            value={selectedDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="campo">
                                        <select
                                            className="input-select"
                                            value={selectedManicurista}
                                            onChange={(e) => {
                                                setSelectedManicurista(e.target.value);
                                                setFormData(prev => ({ ...prev, manicurista: manicuristas.find(m => m.id === parseInt(e.target.value))?.nombre || "" }));
                                                setErroresFormulario({ manicurista: "" });
                                            }}

                                            onBlur={() => {
                                                if (!selectedManicurista) {
                                                    setErroresFormulario({ manicurista: "Debes seleccionar una manicurista" });
                                                }
                                            }}
                                        >
                                            <option value="">Seleccione una manicurista</option>
                                            {manicuristas.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {erroresFormulario.manicurista && (
                                            <p className="error-texto">{erroresFormulario.manicurista}</p>
                                        )}
                                    </div>

                                </div>

                                {!selectedManicurista ? (
                                    <div>
                                        <h3 className="cita-periodo">Abastecimientos pendientes</h3>
                                        <p className="rangos">Selecciona una manicurista para ver sus abastecimientos pendientes.</p>
                                    </div>
                                ) : (
                                    <>
                                        <Abastecimientos abastecimientosRecientes={abastecimientosPendientes} />
                                        {erroresFormulario.abastecimientos && (
                                            <p className="error-texto">{erroresFormulario.abastecimientos}</p>
                                        )}
                                    </>

                                )}

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear consumo
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}


            {isVerModalOpen && reporteSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del consumo</h2>

                            <div className="info-usuario space-y-3">
                                <div className="fila-formulario">
                                    <p><strong>Fecha del consumo:</strong> {reporte.fechaReporte}</p>
                                    <p><strong>Manicurista:</strong> {reporte.manicurista}</p>
                                </div>
                            </div>
                            <div className="tabla-rep">
                                <table className="rep-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha de Abastecimiento</th>
                                            <th>Insumo</th>
                                            <th>Estado</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reporte.abastecimientos.map((abastecimiento, index) =>
                                            abastecimiento.insumos.map((insumo, i) => (
                                                <tr key={`${index}-${i}`}>
                                                    {i === 0 && (
                                                        <td rowSpan={abastecimiento.insumos.length} className="rep-fecha">
                                                            {abastecimiento.fechaAbastecimiento}
                                                        </td>
                                                    )}
                                                    <td className="rep-insumo">{insumo.nombre}</td>
                                                    <td className={`rep-estado ${insumo.estado === "Agotado" ? "agotado" : "disponible"}`}>
                                                        {insumo.estado}
                                                    </td>
                                                    <td className="rep-observacion">{insumo.observacion}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div >
                                <button className="btn-volver" onClick={closeVerModal}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isNotificacionesModalOpen && (
                <div className="overlay-popup" onClick={closeNotificacionesModal}>
                    <div className="ventana-popup max-h-[300vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
                            {notificaciones.length === 0 ? (
                                <div className="p-3 bg-gray-100 rounded-lg shadow">No tienes notificaciones nuevas.</div>
                            ) : (
                                <ul className="space-y-2">
                                    {notificaciones.map((n) => (
                                        <li key={n.id} className="p-3 bg-white border rounded-lg shadow noti">
                                            {n.mensaje}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="button-container">
                                <button className="btn-cancelar" onClick={closeNotificacionesModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Abastecimientos = ({ abastecimientosRecientes }) => {
    const [insumosEstado, setInsumosEstado] = useState({});
    const [observaciones, setObservaciones] = useState({});

    const marcarAgotado = (index, i) => {
        setInsumosEstado(prev => ({
            ...prev,
            [`${index}-${i}`]: !prev[`${index}-${i}`]
        }));
    };

    const manejarObservacion = (index, i, valor) => {
        setObservaciones(prev => ({
            ...prev,
            [`${index}-${i}`]: valor
        }));
    };

    return (
        <div>
            <h3 className="cita-periodo">Abastecimientos pendientes del día anterior</h3>

            {abastecimientosRecientes.length === 0 ? (
                <p className="rangos">
                    No se han encontrado abastecimientos pendientes del día anterior.
                </p>
            ) : (
                <div className="tabla-rep">
                    <table className="rep-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Insumos</th>
                                <th>Estado</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {abastecimientosRecientes.map((a, index) => (
                                a.insumos.map((insumo, i) => (
                                    <tr key={`${index}-${i}`}>
                                        {i === 0 && (
                                            <td rowSpan={a.insumos.length} className="rep-fecha">
                                                {a.fecha}
                                            </td>
                                        )}
                                        <td className="rep-insumo">{insumo}</td>
                                        <td>
                                            <button
                                                className={`rep-btn ${insumosEstado[`${index}-${i}`] ? "agotado" : ""}`}
                                                onClick={() => marcarAgotado(index, i)}
                                            >
                                                {insumosEstado[`${index}-${i}`] ? "Agotado" : "Disponible"}
                                            </button>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Ej: Mitad, poco, etc."
                                                value={observaciones[`${index}-${i}`] || ""}
                                                onChange={(e) => manejarObservacion(index, i, e.target.value)}
                                                className="rep-input"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GestionReporte;