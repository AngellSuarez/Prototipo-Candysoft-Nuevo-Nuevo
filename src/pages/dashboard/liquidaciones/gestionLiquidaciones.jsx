import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import "../../../css/gestionar.css";
import "../../../css/liquidaciones.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionLiquidaciones = () => {
    const navigate = useNavigate();
    const [liquidaciones, setLiquidaciones] = useState([
        {
            id: 1, manicurista: "Sofia Pérez", fechaInicio: "12/03/2025", fechaFinal: "14/03/2026", total: 675000, comision: 337500, local: 317500, servicios: [
                { fecha: "14/03/2025", total: 85400, servicio: "Acrilicas" },
                { fecha: "14/03/2025", total: 97400, servicio: "Tradicional" }
            ]
        },
        {
            id: 2, manicurista: "Mónica Sánchez", fechaInicio: "12/03/2025", fechaFinal: "12/03/2026", total: 675000, comision: 337500, local: 217500, servicios: [
                { fecha: "13/03/2025", total: 40000, servicio: "Tradicional" },
                { fecha: "14/03/2025", total: 47000 },
            ]
        },
        {
            id: 3, manicurista: "Carla Muñoz", fechaInicio: "11/03/2025", fechaFinal: "11/03/2026", total: 675000, comision: 337500, local: 117500, servicios: [
                { fecha: "13/03/2025", total: 40000, servicio: "Tradicional" },
                { fecha: "14/03/2025", total: 47000 },

            ]
        }
    ]);

    const MySwal = withReactContent(Swal);

    const handleEliminarLiq = (liquidaciones) => {
        MySwal.fire({
            title: `Anular la liquidación`,
            html: `
                                <p class="texto-blanco">¿Estás seguro de que deseas anular la luquidación de la manicurista <strong>${liquidaciones.manicurista}</strong>?</p>
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

    const [busqueda, setBusqueda] = useState("");
    const [liquidacionSeleccionado, setLiquidacionSeleccionado] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 3;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const [errorMani, setErrorMani] = useState('');

    const [errorCitas, setErrorCitas] = useState('');

    const [tocoValidar, setTocoValidar] = useState(false);

    const handleCrearLiquidacion = () => {
        if (!manicuristaSeleccionada) {
            alert('Debes seleccionar una manicurista');
            setTocoValidar(true);
            setErrorMani('Debes de seleccionar una manicurista');
            setErrorCitas("Selecciona una manicurista para ver sus citas");
            return;
        }

        if (citasFiltradas.length === 0) {
            alert("No hay citas en el rango seleccionado");
            setErrorCitas("No hay citas en el rango seleccionado");
            return;
        }


        alert("Liquidación creada con éxito");


        closeCrearModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let hayError = false;

        if (!manicuristaSeleccionada) {
            setErrorManicurista("Este campo es obligatorio");
            hayError = true;
        } else {
            setErrorManicurista("");
        }

        if (!hayError) {
            closeCrearModal();
        }
    };
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (liquidacion) => {
        setLiquidacionSeleccionado(liquidacion);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setLiquidacionSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const liquidacionesFiltradas = liquidaciones.filter(liquidacion =>
        Object.values(liquidacion).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltima = paginaActual * itemsPorPagina;
    const indexPrimera = indexUltima - itemsPorPagina;
    const liquidacionesActuales = liquidacionesFiltradas.slice(indexPrimera, indexUltima);
    const totalPaginas = Math.ceil(liquidacionesFiltradas.length / itemsPorPagina);

    const [manicuristaSeleccionada, setManicuristaSeleccionada] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [citasFiltradas, setCitasFiltradas] = useState([]);
    const [totalServicios, setTotalServicios] = useState(0);
    const [comision, setComision] = useState(0);

    const liqAnteriores = [
        { id: 1, manicurista: "Paula", fecha: "14/03/2025" },
        { id: 2, manicurista: "Monica", fecha: "13/03/2025" },
        { id: 3, manicurista: "Andrea", fecha: "17/03/2025" }
    ];

    const manicuristas = [
        {
            id: 1,
            nombre: "Sofia Pérez",
            citas: [
                { fecha: "01/04/2025", total: 97000 },
                { fecha: "14/03/2025", total: 47000 },
                { fecha: "12/03/2025", total: 187000 }
            ]
        },
        {
            id: 2,
            nombre: "Mónica Sánchez",
            citas: [
                { fecha: "29/03/2025", total: 85400, servicio: "pressOn" },
                { fecha: "30/03/2025", total: 89000, servicio: "pressOn" },
                { fecha: "04/04/2025", total: 40000, servicio: "tradicional" },
                { fecha: "05/04/2025", total: 40000, servicio: "tradicional" }
            ]
        },
        {
            id: 3,
            nombre: "Carla Muñoz",
            citas: [
                { fecha: "07/04/2025", total: 40000, servicio: "tradicional" },
                { fecha: "08/04/2025", total: 109000, servicio: "Acrílicas" },
                { fecha: "09/04/2025", total: 970000, servicio: "Acrílicas" }
            ]
        }
    ];

    const formatearFecha = (fechaStr) => {
        const partes = fechaStr.split('/');
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    };

    const obtenerFechaHoy = () => {
        const hoy = new Date();
        return hoy.toISOString().split("T")[0];
    };

    const obtenerFechaHaceCincoDias = () => {
        const hoy = new Date();
        const cincoDiasAtras = new Date(hoy);
        cincoDiasAtras.setDate(hoy.getDate() - 5);
        return cincoDiasAtras.toISOString().split("T")[0];
    };

    const fechaHoy = obtenerFechaHoy();
    const fechaCincoDiasAtras = obtenerFechaHaceCincoDias();

    useEffect(() => {
        if (manicuristaSeleccionada) {
            const manicuristaId = parseInt(manicuristaSeleccionada);
            const ultimaLiquidacion = liqAnteriores.find(l => l.id === manicuristaId);

            let fechaMinima = fechaCincoDiasAtras;

            if (ultimaLiquidacion) {
                const fechaUltimaLiquidacion = formatearFecha(ultimaLiquidacion.fecha);

                const fechaUltimaLiquidacionObj = new Date(fechaUltimaLiquidacion);
                fechaUltimaLiquidacionObj.setDate(fechaUltimaLiquidacionObj.getDate());
                const diaSiguiente = fechaUltimaLiquidacionObj.toISOString().split("T")[0];

                const fechaUltimaEsMasReciente = new Date(diaSiguiente) > new Date(fechaCincoDiasAtras);
                fechaMinima = fechaUltimaEsMasReciente ? diaSiguiente : fechaCincoDiasAtras;
            }

            setFechaInicio(fechaMinima);
            setFechaFinal(fechaHoy);

            filtrarCitas(manicuristaId, fechaMinima, fechaHoy);

            setErrorCitas('');
        } else {
            if (tocoValidar) {
                setErrorCitas('No hay citas, por lo tanto, no se puede crear la liquidación.');
            }
        }

    }, [manicuristaSeleccionada, tocoValidar]);

    useEffect(() => {
        if (manicuristaSeleccionada && fechaInicio && fechaFinal) {
            filtrarCitas(parseInt(manicuristaSeleccionada), fechaInicio, fechaFinal);
        }
    }, [fechaInicio, fechaFinal]);

    const filtrarCitas = (manicuristaId, fechaIni, fechaFin) => {
        const manicurista = manicuristas.find(m => m.id === manicuristaId);

        if (manicurista) {
            const citasFiltradas = manicurista.citas.filter(cita => {
                const fechaCita = formatearFecha(cita.fecha);
                return fechaCita >= fechaIni && fechaCita <= fechaFin;
            });

            setCitasFiltradas(citasFiltradas);

            const total = citasFiltradas.reduce((sum, cita) => sum + cita.total, 0);
            setTotalServicios(total);
            setComision(total / 2);
        }
    };

    const handleChangeFechaInicio = (e) => {
        const nuevaFechaInicio = e.target.value;
        setFechaInicio(nuevaFechaInicio);
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
                <h1 className="titulo">Gestión liquidaciones</h1>

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

            <button onClick={openCrearModal} className="crear-btn">Crear liquidación</button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar liquidación..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <table className="roles-table">
                <thead>
                    <tr>
                        <th>Manicurista</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Final</th>
                        <th>Total</th>
                        <th>Comisión</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {liquidacionesActuales.length > 0 ? (
                        liquidacionesActuales.map((liq) => (
                            <tr key={liq.id}>
                                <td>{liq.manicurista}</td>
                                <td>{liq.fechaInicio}</td>
                                <td>{liq.fechaFinal}</td>
                                <td>{liq.total.toLocaleString('es-CO')}</td>
                                <td>{liq.comision.toLocaleString('es-CO')}</td>
                                <td className="text-center space-x-2">
                                    <button onClick={() => openVerModal(liq)}
                                        className="acciones-btn ver-btn"
                                        title="Ver detalles de la liquidación">
                                        <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminarLiq(liq)}
                                        className="acciones-btn eliminar-btn"
                                        title="Anular la liquidación"
                                    >
                                        <MdBlock size={18} className="text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center p-4">No se encontraron liquidaciones</td>
                        </tr>
                    )}
                </tbody>
            </table>

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
                            <h2 className="text-xl font-semibold mb-4">Crear liquidación</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCrearLiquidacion();
                                    setTocoValidar(true);

                                }}
                                className="space-y-3"
                            >
                                <div className="fila-formulario">
                                    <div>
                                        <select
                                            id="seleccionarManicurista"
                                            className="input-select"
                                            onChange={(e) => {
                                                setManicuristaSeleccionada(e.target.value);
                                                setErrorMani('');
                                            }}
                                            onBlur={() => {
                                                setTocoValidar(true);
                                                if (!manicuristaSeleccionada) {
                                                    setErrorMani('Debes de seleccionar una manicurista');
                                                }
                                            }}
                                            value={manicuristaSeleccionada}
                                        >
                                            <option value="" disabled>Selecciona una manicurista</option>
                                            {manicuristas.map((m) => (
                                                <option key={m.id} value={m.id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                        {errorMani && (
                                            <p className="error-texto">{errorMani}</p>
                                        )}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="date"
                                            id="fechaInicial"
                                            className="input-fecha-activo-liq"
                                            value={fechaInicio}
                                            min={manicuristaSeleccionada ? (liqAnteriores.find(l => l.id === parseInt(manicuristaSeleccionada)) ?
                                                new Date(formatearFecha(liqAnteriores.find(l => l.id === parseInt(manicuristaSeleccionada)).fecha)) > new Date(fechaCincoDiasAtras) ?
                                                    (() => {
                                                        const fecha = new Date(formatearFecha(liqAnteriores.find(l => l.id === parseInt(manicuristaSeleccionada)).fecha));
                                                        fecha.setDate(fecha.getDate());
                                                        return fecha.toISOString().split("T")[0];
                                                    })() :
                                                    fechaCincoDiasAtras :
                                                fechaCincoDiasAtras) :
                                                fechaCincoDiasAtras}
                                            max={fechaFinal}
                                            onChange={handleChangeFechaInicio}
                                            disabled={!manicuristaSeleccionada}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            id="fechaFinal"
                                            className="input-fecha-activo-liq"
                                            value={fechaFinal}
                                            min={fechaInicio}
                                            max={fechaHoy}
                                            onChange={(e) => setFechaFinal(e.target.value)}
                                            disabled={!manicuristaSeleccionada}
                                        />
                                    </div>
                                </div>

                                {/* Tabla de citas */}
                                <div className="mb-6">
                                    <h3 className="cita-periodo">Citas en el período seleccionado</h3>
                                    {manicuristaSeleccionada ? (
                                        citasFiltradas.length > 0 ? (
                                            <div className="tabla-liq">
                                                <table className="liq-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Total</th>
                                                            <th>Servicio</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {citasFiltradas.map((cita, index) => (
                                                            <tr key={index}>
                                                                <td>{cita.fecha}</td>
                                                                <td>${cita.total.toLocaleString("es-CO")}</td>
                                                                <td>{cita.servicio || "No especificado"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="rangos">No hay citas en el rango de fechas seleccionado.</p>

                                        )
                                    ) : (
                                        <>
                                            <p className="rangos">Selecciona una manicurista para ver sus citas.</p>
                                            {errorCitas && tocoValidar && (
                                                <p className="error-texto">{errorCitas}</p>
                                            )}
                                        </>
                                    )}

                                </div>

                                {/* Totales */}
                                {manicuristaSeleccionada && citasFiltradas.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded mb-6">
                                        <div className="fila-totales">
                                            <div>
                                                <p className="text-sm text-gray-600"><strong>Total Generado:</strong></p>
                                                <p className="text-lg font-bold">${totalServicios.toLocaleString("es-CO")}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600"><strong>Comisión Manicurista:</strong></p>
                                                <p className="text-lg font-bold">${comision.toLocaleString("es-CO")}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600"><strong>Comisión Local:</strong></p>
                                                <p className="text-lg font-bold">${comision.toLocaleString("es-CO")}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="button-container">
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={closeCrearModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear liquidación
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isVerModalOpen && liquidacionSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles de la liquidación</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre de la manicurista:</strong> {liquidacionSeleccionado.manicurista} </p>
                                        <p><strong>Fecha Inicio:</strong> {liquidacionSeleccionado.fechaInicio}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Fecha Final:</strong> {liquidacionSeleccionado.fechaFinal}</p>
                                        <p><strong>Total:</strong> {liquidacionSeleccionado.total}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Local:</strong> {liquidacionSeleccionado.local}</p>
                                        <p><strong>Comisión:</strong> {liquidacionSeleccionado.comision}</p>
                                    </div>

                                </div>
                            </div>
                            <div className="tabla-liq">
                                <table className="liq-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Servicio</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {liquidacionSeleccionado.servicios.map((servicio, index) => (
                                            <tr key={index}>
                                                <td>{servicio.fecha}</td>
                                                <td>{servicio.servicio || "No especificado"}</td>
                                                <td>{servicio.total}</td>
                                            </tr>
                                        ))}
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

export default GestionLiquidaciones;
