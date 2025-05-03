import React, { useState } from "react";
import "../../../css/gestionar.css";
import "../../../css/ventas.css"
import { AiOutlineEye, AiFillFilePdf, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionVentas = () => {

    const [ventas, setVentas] = useState([
        { id: 1, cliente: 'Gloria Aristizabal', fecha_venta: '16/03/2025', total: 70000, estado: 'Pendiente' },
        { id: 2, cliente: 'Martha Ciro', fecha_venta: '30/12/2024', total: 55000, estado: 'Anulada' },
        { id: 3, cliente: 'Andrea Agudelo', fecha_venta: '12/03/2025', total: 85000, estado: 'Pendiente' },
    ]);

    const [ventaSeleccionado, setVentaSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const ventasPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const [errores, setErrores] = useState({});

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (venta) => {
        setVentaSeleccionado(venta);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setVentaSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const ventasFiltrados = ventas.filter(venta =>
        Object.values(venta).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoVenta = paginaActual * ventasPorPagina;
    const indexPrimerVenta = indexUltimoVenta - ventasPorPagina;
    const ventasActuales = ventasFiltrados.slice(indexPrimerVenta, indexUltimoVenta);
    const totalPaginas = Math.ceil(ventasFiltrados.length / ventasPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [manicuristaSeleccionado, setManicuristaSeleccionado] = useState("");
    const [showVentaDateInput, setShowVentaDateInput] = useState(false);
    const [ventaDate, setVentaDate] = useState("");
    const [tipoVenta, setTipoVenta] = useState("");

    const [codigoCita, setCodigoCita] = useState("");
    const [datosCita, setDatosCita] = useState({
        cliente: "",
        manicurista: "",
        fecha: "",
    });

    const citasExistentes = [
        { id: 1, cliente: "Ana López", manicurista: "Sofia Pérez", fecha: "2025-03-20" },
        { id: 2, cliente: "Luis Gómez", manicurista: "Carla Muñoz", fecha: "2025-03-21" },
        { id: 3, cliente: "Carla Agudelo", manicurista: "Mónica Sánchez", fecha: "2025-04-23" },
    ];

    const MySwal = withReactContent(Swal);

    const anularVenta = (venta) => {
        if (venta.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Anular venta',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>anular</strong> la venta de la cliente <strong>${venta.cliente}</strong>?</p>`,
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
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevasVentas = ventas.map(c =>
                    c.id === venta.id ? { ...c, estado: 'Anulada' } : c
                );
                setVentas(nuevasVentas);

                MySwal.fire({
                    icon: 'success',
                    title: 'Venta anulada',
                    text: `La venta de la cliente ${venta.cliente} ha sido anulada correctamente.`,
                    confirmButtonColor: '#7e2952',
                    customClass: {
                        popup: 'swal-rosado'
                    },
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        });
    };

    const completarVenta = (venta) => {
        if (venta.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Completar venta',
            html: `<p>¿Estás seguro de que deseas <strong>completar</strong> la venta de la cliente <strong>${venta.cliente}</strong>?</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, completar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7e2952',
            cancelButtonColor: '#d8d6d7',
            reverseButtons: true,
            customClass: {
                popup: 'swal-rosado'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevasVentas = ventas.map(c =>
                    c.id === venta.id ? { ...c, estado: 'Completada' } : c
                );
                setVentas(nuevasVentas);

                MySwal.fire({
                    icon: 'success',
                    title: 'Venta completada',
                    text: `La venta de la cliente ${venta.cliente} ha sido marcada como completada.`,
                    confirmButtonColor: '#7e2952',
                    customClass: {
                        popup: 'swal-rosado'
                    },
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleTipoChange = (e) => {
        setTipoVenta(e.target.value);
        setDatosCita({ cliente: "", manicurista: "", fecha: "" });
    };

    const handleBuscarCita = () => {
        const citaEncontrada = citasExistentes.find(cita => cita.id === parseInt(codigoCita));

        if (citaEncontrada) {
            setDatosCita({
                cliente: citaEncontrada.cliente,
                manicurista: citaEncontrada.manicurista,
                fecha: citaEncontrada.fecha,
            });
            alert(`Cita con la fecha ${citaEncontrada.fecha} encontrada y datos cargados.`);
        } else {
            setDatosCita({ cliente: "", manicurista: "", fecha: "" });
            alert(`No se encontró ninguna cita con la fecha ${citaEncontrada.fecha}.`);
        }
    };

    const clientes = ["Gloria Alzate", "Fernanda Franco", "Luisa Monsalve"];
    const manicuristas = ["Sofia Pérez", "Mónica Sánchez", "Carla Muñoz"];


    const serviciosDisponibles = [
        { nombre: "Manicure semipermanente", precio: 55000 },
        { nombre: "Pedicure semipermanente", precio: 50000 },
        { nombre: "Uñas acrílicas", precio: 70000 },
        { nombre: "Uñas en gel", precio: 85000 },
        { nombre: "Retoque de uñas acrílicas", precio: 35000 },
    ];

    const [servicios, setServicios] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [serviciosEnModal, setServiciosEnModal] = useState([]);
    const [cantidad, setCantidad] = useState(1);

    const abrirModal = () => {
        setShowModal(true);
        setServicioSeleccionado("");
        setPrecioUnitario(0);
        setCantidad(1);
        setServiciosEnModal([]);
    };

    const [modalErrores, setModalErrores] = useState({
        servicio: "",
        precio: "",
    });

    const agregarServicioAlModal = () => {
        const errores = {};

        if (!servicioSeleccionado) {
            errores.servicio = "Debe seleccionar un servicio";
        }

        if (!precioUnitario || precioUnitario <= 0) {
            errores.precio = "El precio no puede ser 0";
        }

        if (Object.keys(errores).length > 0) {
            setModalErrores(errores);
            alert("Por favor completa todos los campos correctamente");
            return;
        }

        setServiciosEnModal([
            ...serviciosEnModal,
            { nombre: servicioSeleccionado, precioUnitario },
        ]);

        setServicioSeleccionado("");
        setPrecioUnitario(0);
        setModalErrores({});
    };

    const guardarServiciosDelModal = () => {
        if (serviciosEnModal.length === 0) {
            alert("Debes agregar al menos un servicio antes de guardar.");
            return;
        }

        setServicios(serviciosEnModal);
        setShowModal(false);
    };

    const cancelarModal = () => {
        setServiciosEnModal([]);
        setShowModal(false);
    };

    const calcularSubtotal = () => {
        return servicios.reduce(
            (total, ser) => total + ser.precioUnitario * ser.cantidad,
            0
        );
    };

    const subtotal = calcularSubtotal();
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

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
                <h1 className="titulo">Gestión de ventas</h1>

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

            <button onClick={openCrearModal} className="crear-btn mb-4">
                Crear venta
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar venta..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Fecha venta</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasActuales.length > 0 ? (
                            ventasActuales.map((venta) => {
                                const esEditable = venta.estado === 'Pendiente';

                                return (
                                    <tr key={venta.id}>
                                        <td>{venta.cliente}</td>
                                        <td>{venta.fecha_venta}</td>
                                        <td>${venta.total.toLocaleString()}</td>
                                        <td>
                                            <span
                                                className={`estado ${venta.estado === 'Pendiente'
                                                    ? 'estado-pendiente'
                                                    : venta.estado === 'Completada'
                                                        ? 'estado-completada'
                                                        : 'estado-anulada'
                                                    }`}
                                            >
                                                {venta.estado}
                                            </span>
                                        </td>
                                        <td className="text-center space-x-2">
                                            <button
                                                onClick={() => openVerModal(venta)}
                                                className="acciones-btn editar-btn flex items-center justify-center p-2"
                                                title="Ver factura de la venta"
                                            >
                                                <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                            </button>
                                            <button
                                                onClick={() => esEditable && completarVenta(venta)}
                                                className={`acciones-btn ver-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Completar la venta"
                                            >
                                                <AiOutlineCheck size={18} className="text-green-500 hover:text-green-700" />
                                            </button>

                                            <button
                                                onClick={() => esEditable && anularVenta(venta)}
                                                className={`acciones-btn eliminar-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Anular la venta"
                                            >
                                                <MdBlock size={18} className="text-red-500 hover:text-red-700" />
                                            </button>

                                            <button
                                                className="acciones-btn ver-btn flex items-center justify-center p-2"
                                                title="Ver PDF"
                                            >
                                                <AiFillFilePdf size={18} className="text-red-500 hover:text-red-700" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron ventas</td>
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
                        <div className="contenido-popup3">
                            <h2 className="titulo-usuario">Crear venta</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const nuevosErrores = {};

                                    if (!tipoVenta) nuevosErrores.tipoVenta = "Debes de seleccionar el tipo de venta";
                                    if (tipoVenta === "Directa") {
                                        if (!clienteSeleccionado) nuevosErrores.cliente = "Debes de seleccionar a un cliente";
                                        if (!manicuristaSeleccionado) nuevosErrores.manicurista = "Debes de seleccionar a una manicurista";
                                        if (!ventaDate) nuevosErrores.fecha = "La fecha obligatoria";
                                    } else if (tipoVenta === "Cita") {
                                        if (!codigoCita) nuevosErrores.cita = "Seleccione una cita";
                                    }

                                    if (servicios.length === 0) nuevosErrores.servicios = "Debe agregar al menos un servicio";

                                    setErrores(nuevosErrores);

                                    if (Object.keys(nuevosErrores).length > 0) {
                                        alert("Por favor completa todos los campos correctamente.");
                                        return;
                                    }

                                    // Si no hay errores, proceder a crear venta
                                    closeCrearModal();
                                }}
                                className="space-y-3"
                            >

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <select
                                            name="tipoVenta"
                                            className="input-select"
                                            value={tipoVenta}
                                            onChange={(e) => {
                                                setTipoVenta(e.target.value);
                                                if (e.target.value !== "") {
                                                    setErrores((prev) => ({ ...prev, tipoVenta: "" }));
                                                }
                                            }}
                                            onBlur={() => {
                                                if (!tipoVenta) setErrores(prev => ({ ...prev, tipoVenta: "Debes de seleccionar a un cliente" }));
                                            }}
                                        >
                                            <option value="">Tipo de venta *</option>
                                            <option value="Directa">Directa</option>
                                            <option value="Cita">Cita</option>
                                        </select>
                                        {errores.tipoVenta && <p className="error-texto">{errores.tipoVenta}</p>}
                                    </div>
                                </div>
                                {tipoVenta === "Directa" && (
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <select
                                                className="input-select"
                                                value={clienteSeleccionado}
                                                onChange={(e) => {
                                                    setClienteSeleccionado(e.target.value);
                                                    if (e.target.value !== "") {
                                                        setErrores((prev) => ({ ...prev, cliente: "" }));
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!clienteSeleccionado) setErrores(prev => ({ ...prev, cliente: "Debes de seleccionar un cliente" }));
                                                }}
                                            >
                                                <option value="">Seleccione el cliente *</option>
                                                {clientes.map((cliente, index) => (
                                                    <option key={index} value={cliente}>{cliente}</option>
                                                ))}
                                            </select>
                                            {errores.cliente && <p className="error-texto">{errores.cliente}</p>}
                                        </div>
                                        <div className="campo">
                                            <select
                                                className="input-select"
                                                value={manicuristaSeleccionado}
                                                onChange={(e) => {
                                                    setManicuristaSeleccionado(e.target.value);
                                                    if (e.target.value !== "") {
                                                        setErrores((prev) => ({ ...prev, manicurista: "" }));
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!manicuristaSeleccionado) setErrores(prev => ({ ...prev, manicurista: "Debes de seleccionar a una manicurista" }));
                                                }}
                                            >
                                                <option value="">Seleccione la manicurista *</option>
                                                {manicuristas.map((manicurista, index) => (
                                                    <option key={index} value={manicurista}>{manicurista}</option>
                                                ))}
                                            </select>
                                            {errores.manicurista && <p className="error-texto">{errores.manicurista}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <div className="campo">
                                                {showVentaDateInput || ventaDate ? (
                                                    <input
                                                        type="date"
                                                        id="fechaVenta"
                                                        name="fechaVenta"
                                                        className="input-fecha-activo-venta"
                                                        value={ventaDate}
                                                        onChange={(e) => {
                                                            setVentaDate(e.target.value);
                                                            if (e.target.value !== "") {
                                                                setErrores((prev) => ({ ...prev, fecha: "" }));
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (!ventaDate) setErrores(prev => ({ ...prev, fecha: "La fecha es obligatoria" }));
                                                        }}
                                                    />
                                                ) :
                                                    (
                                                        <div onClick={() => setShowVentaDateInput(true)} className="input-fecha-placeholder-venta">
                                                            Fecha de venta *
                                                        </div>
                                                    )}
                                                {errores.fecha && <p className="error-texto">{errores.fecha}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tipoVenta === "Cita" && (
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <select
                                                value={codigoCita}
                                                onChange={(e) => {
                                                    setCodigoCita(e.target.value);
                                                    if (e.target.value !== "") {
                                                        setErrores((prev) => ({ ...prev, cita: "" }));
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!codigoCita) setErrores(prev => ({ ...prev, cita: "Seleccione una fecha" }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Seleccione una fecha *</option>
                                                {citasExistentes.map((cita) => (
                                                    <option key={cita.id} value={cita.id}>
                                                        {cita.fecha}
                                                    </option>
                                                ))}
                                            </select>
                                            {errores.cita && <p className="error-texto">{errores.cita}</p>}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleBuscarCita}
                                            className="btn-agregar-servicio"
                                            disabled={!codigoCita}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                )}
                                {tipoVenta === "Cita" && datosCita.cliente && (
                                    <div className="datos-cita">
                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <label className="subtitulo-cita">Cliente:</label>
                                                <input
                                                    type="text"
                                                    value={datosCita.cliente}
                                                    className="input-texto"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="campo">
                                                <label className="subtitulo-cita">Manicurista:</label>
                                                <input
                                                    type="text"
                                                    value={datosCita.manicurista}
                                                    className="input-texto"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="campo">
                                                <label className="subtitulo-cita">Fecha:</label>
                                                <input
                                                    type="text"
                                                    value={datosCita.fecha}
                                                    className="input-texto"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="fila-formulario">
                                    <button
                                        type="button"
                                        className="btn-agregar-servicio"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Agregar servicios a la venta
                                    </button>
                                </div>

                                <div className="servicio-agregados">
                                    <h3 className="titulo-seccion">Servicios agregados</h3>
                                    {servicios.length === 0 ? (
                                        <>
                                            <p className="mensaje-vacio">No has agregado servicios aún.</p>
                                            {errores.servicios && <p className="error-texto">{errores.servicios}</p>}
                                        </>
                                    ) : (
                                        <div className="lista-servicios-grid">
                                            {servicios.map((ser, index) => (
                                                <div key={index} className="servicio-card">
                                                    <div className="info-servicio">
                                                        <span className="nombre-servicio">{ser.nombre}</span>
                                                        <span className="detalle-servicio">Precio: ${ser.precioUnitario}</span>
                                                    </div>
                                                    <button
                                                        className="btn-eliminar-servicio"
                                                        onClick={() => {
                                                            const nuevosServicios = servicios.filter((_, i) => i !== index);
                                                            setServicios(nuevosServicios);
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="fila-formulario">
                                    <input
                                        type="text"
                                        value={`Total: $${total.toFixed(2)}`}
                                        className="input-texto"
                                        readOnly
                                    />
                                </div>

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear venta
                                    </button>
                                </div>
                            </form>
                            {showModal && (
                                <div className="modal-fondo">
                                    <div className="modal-contenido">
                                        <h2 className="solo-oscuro">Agregar servicios</h2>

                                        <div className="modal-form-row">
                                            <div className="campo">
                                                <select
                                                    value={servicioSeleccionado}
                                                    onChange={(e) => {
                                                        const ser = serviciosDisponibles.find(
                                                            (i) => i.nombre === e.target.value
                                                        );
                                                        if (ser) {
                                                            setServicioSeleccionado(ser.nombre);
                                                            setPrecioUnitario(ser.precio);
                                                            setModalErrores((prev) => ({
                                                                ...prev,
                                                                servicio: "",
                                                                precio: ser.precio > 0 ? "" : "El precio no puede ser 0"
                                                            }));
                                                        } else {
                                                            setServicioSeleccionado("");
                                                            setPrecioUnitario(0);

                                                            setModalErrores((prev) => ({
                                                                ...prev,
                                                                servicio: "Selecciona un servicio",
                                                                precio: "El precio no puede ser 0"
                                                            }));
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (!servicioSeleccionado) {
                                                            setModalErrores((prev) => ({
                                                                ...prev,
                                                                servicio: "Selecciona un servicio"
                                                            }));
                                                        }
                                                    }}
                                                    className="input-select modal-input"
                                                >
                                                    <option value="">Servicio</option>
                                                    {serviciosDisponibles.map((ser, index) => (
                                                        <option key={index} value={ser.nombre}>
                                                            {ser.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                {modalErrores.servicio && (
                                                    <p className="error-texto">{modalErrores.servicio}</p>
                                                )}
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="text"
                                                    className="input-texto modal-input"
                                                    value={precioUnitario}
                                                    onChange={(e) => {
                                                        const nuevoPrecio = Number(e.target.value);
                                                        setPrecioUnitario(nuevoPrecio);

                                                        // Validación inmediata
                                                        if (nuevoPrecio > 0) {
                                                            setModalErrores((prev) => ({ ...prev, precio: "" }));
                                                        } else {
                                                            setModalErrores((prev) => ({ ...prev, precio: "El precio no puede ser 0" }));
                                                        }
                                                    }}
                                                    placeholder="Precio Unitario"
                                                />
                                                {modalErrores.precio && (
                                                    <p className="error-texto">{modalErrores.precio}</p>
                                                )}
                                            </div>
                                        </div>


                                        <div className="modal-botones">
                                            <button
                                                onClick={agregarServicioAlModal}
                                                className="btn-agregar"
                                            >
                                                Agregar servicio
                                            </button>
                                        </div>

                                        <div className="servicios-agregados-modal">
                                            <h4>Servicios agregados:</h4>
                                            {serviciosEnModal.length === 0 ? (
                                                <p>No has agregado servicios aún.</p>
                                            ) : (
                                                serviciosEnModal.map((ser, index) => (
                                                    <div
                                                        key={index}
                                                        className="servicio-item-modal"
                                                    >
                                                        {ser.nombre} - ${ser.precioUnitario}
                                                        <button
                                                            className="btn-eliminar-servicio-agregar"
                                                            onClick={() => {
                                                                const nuevosServiciosEnModal = serviciosEnModal.filter((_, i) => i !== index);
                                                                setServiciosEnModal(nuevosServiciosEnModal);
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="modal-botones">
                                            <button
                                                onClick={guardarServiciosDelModal}
                                                className="btn-crear"
                                            >
                                                Guardar Servicios
                                            </button>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="btn-cancelar"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isVerModalOpen && ventaSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup-2">
                            <h2 className="titulo-usuario">Factura</h2>
                            <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="" className="logo-ver-compra" />
                            <hr class="linea" />
                            <div>
                                <h5 className="informacion-cliente">Venta #1</h5>
                                <div className="fechas">
                                    <p>Fecha de la venta: 16/03/2025</p>
                                </div>
                                <div className="informacion-cliente">
                                    <p><strong>Información Cliente</strong></p>
                                    <p>Gloria Alzate</p>
                                    <p>CC: 1.036.967.567</p>
                                    <p>3115879043</p>
                                    <p>GloriaAl89@gmail.com</p>
                                    <p><strong>Información Manicurista</strong></p>
                                    <p>Sofia Perez</p>
                                </div>
                            </div>
                            <hr class="linea" />
                            <div className="servicio-factura">
                                <h4 className="solo-oscuro">Servicios Facturados</h4>

                                <div className="header-factura">
                                    <p className="col-servicio"><strong>Servicio</strong></p>
                                    <p>Precio</p>
                                    <p>Subtotal</p>
                                    <p>IVA</p>
                                    <p>Total</p>
                                </div>

                                <div className="fila-factura">
                                    <p className="col-insumo">Uñas acrílicas</p>
                                    <p className="dinero">$70.000</p>
                                    <p className="dinero">$70.000</p>
                                    <p className="dinero">$13.300</p>
                                    <p className="dinero">$83.300</p>
                                </div>

                            </div>
                            <div className="valores-totales">
                                <p><strong>Subtotal de la venta:</strong> <span>$70.000</span></p>
                                <p><strong>IVA total de la venta:</strong> <span>$13.300</span></p>
                                <p><strong>Total a pagar:</strong> <span className="total">$83.300</span></p>
                            </div>
                            <div className="footer-popup">
                                <p>"Gracias por su visita y compra. Si tiene dudas o comentarios sobre esta factura, puede comunicarse con nosotros"</p>
                                <p>WhatsApp: 3007787515 - Leyly@candy.com</p>
                                <p>CandyNails Medellín © 2025</p>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="btn-volver" onClick={closeVerModal}>
                                Volver
                            </button>
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

export default GestionVentas;