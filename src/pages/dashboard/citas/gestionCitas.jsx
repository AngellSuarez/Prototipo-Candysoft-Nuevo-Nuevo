import React, { useState } from "react";
import "../../../css/gestionar.css";
import "../../../css/citas.css";
import { AiOutlineEye, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";

const GestionCitas = () => {

    const [citas, setCitas] = useState([
        { id: 1, cliente: "Martha Ciro", manicurista: "Sofia Perez", servicios: "Manicure", precio: "2000", fecha: "2025-03-20", hora: "10:00", descripcion: "Manicure con esmalte en gel", estado: "Pendiente" },
        { id: 2, cliente: "Gloria Aristizabal", manicurista: "Carla Muñoz", servicios: "Uñas Acrílicas", precio: "3000", fecha: "2025-03-21", hora: "14:00", descripcion: "Uñas largas", estado: "Completada" },
        { id: 3, cliente: "Andrea Agudelo", manicurista: "Mónica Sánchez", servicios: "Semipermanente", precio: "4300", fecha: "2025-04-23", hora: "10:00", descripcion: "Esmalte rojo", estado: "Pendiente" }
    ]);

    const MySwal = withReactContent(Swal);

    const cancelarCita = (cita) => {
        if (cita.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Cancelar cita',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>cancelar</strong> la cita de la cliente <strong>${cita.cliente}</strong>?</p>`,
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
                const nuevasCitas = citas.map(c =>
                    c.id === cita.id ? { ...c, estado: 'Cancelada' } : c
                );
                setCitas(nuevasCitas);

                MySwal.fire({
                    icon: 'success',
                    title: 'Cita cancelada',
                    text: `La cita de la cliente ${cita.cliente} ha sido cancelada correctamente.`,
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

    const completarCita = (cita) => {
        if (cita.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Completar cita',
            html: `<p>¿Estás seguro de que deseas <strong>completar</strong> la cita de la cliente <strong>${cita.cliente}</strong>?</p>`,
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
                const nuevasCitas = citas.map(c =>
                    c.id === cita.id ? { ...c, estado: 'Completada' } : c
                );
                setCitas(nuevasCitas);

                MySwal.fire({
                    icon: 'success',
                    title: 'Cita completada',
                    text: `La cita de la cliente ${cita.cliente} ha sido marcada como completada.`,
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

    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const citasPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const [fechaCita, setFechaCita] = useState("");
    const [horaCita, setHoraCita] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [manicuristaSeleccionada, setManicuristaSeleccionada] = useState("");
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
    const [errorCliente, setErrorCliente] = useState("");
    const [errorManicurista, setErrorManicurista] = useState("");
    const [errorFecha, setErrorFecha] = useState("");
    const [errorHora, setErrorHora] = useState("");
    const [errorDescripcion, setErrorDescripcion] = useState("");
    const [errorIngresoDate, setErrorIngresoDate] = useState("");
    const [errorHoraIngresoDate, setErrorHoraIngresoDate] = useState("");

    const handleCrearCita = () => {
        let errores = false;

        if (!clienteSeleccionado) {
            setErrorCliente("Debes seleccionar el cliente");
            errores = true;
        }

        if (!manicurista) {
            setErrorManicurista("Debes seleccionar la manicurista");
            errores = true;
        }

        if (!ingresoDate) {
            setErrorIngresoDate("Debes seleccionar la fecha");
            errores = true;
        }

        if (!horaingresoDate) {
            setErrorHoraIngresoDate("Debes seleccionar la hora");
            errores = true;
        }

        if (!descripcion) {
            setErrorDescripcion("Debes ingresar una descripción");
            errores = true;
        }

        if (servicios.length === 0) {
            setErrorServicios("Debes agregar al menos un servicio");
            errores = true;
        } else {
            setErrorServicios("");
        }

        if (errores) {
            alert("Debes completar todos los campos correctamente.");
            return;
        }

        alert("¡Cita creada exitosamente!");

        closeCrearModal();
    };


    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    
    const [citaEditando, setCitaEditando] = useState(null);


    const [errores, setErrores] = useState({
        cliente: false,
        manicurista: false,
        fecha: false,
        hora: false,
        descripcion: false,
    });

    const validarCampo = (campo, valor) => {
        setErrores((prevErrores) => ({
            ...prevErrores,
            [campo]: valor.trim() === "" ? "Este campo es obligatorio" : "",
        }));
    };

    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);

    const openEditarModal = (cita) => {
        setCitaSeleccionada(cita);
        setIsEditarModalOpen(true); 
    };

    const closeEditarModal = () => {
        setCitaSeleccionada(null);
        setIsEditarModalOpen(false); 
    };

    const abrirEditarModal = (cita) => {
        setCitaSeleccionada(cita);
        setCliente(cita.cliente);
        setManicurista(cita.manicurista);
        setIngresoDate(cita.fecha);
        setHoraIngresoDate(cita.hora);
        setDescripcion(cita.descripcion);
    
        const serviciosParseados = cita.servicios.split(',').map(nombre => ({
            nombre: nombre.trim(),
            precio: parseFloat(cita.precio),
        }));
    
        setServicios(serviciosParseados);
        setIsEditarModalOpen(true); 
    };

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (cita) => {
        setCitaSeleccionada(cita);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setCitaSeleccionada(null);
        setVerModalOpen(false);
    };


    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const citasFiltradas = citas.filter(cita =>
        Object.values(cita).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimaCita = paginaActual * citasPorPagina;
    const indexPrimeraCita = indexUltimaCita - citasPorPagina;
    const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
    const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const [cliente, setCliente] = useState("");
    const [manicurista, setManicurista] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const serviciosDisponibles = [
        { nombre: "Manicure Tradicional", precio: 15000 },
        { nombre: "Pedicure Spa", precio: 20000 },
        { nombre: "Uñas Acrílicas", precio: 30000 },
    ];

    const [showHoraIngresoDateInput, setShowHoraIngresoDateInput] = useState(false);
    const [horaingresoDate, setHoraIngresoDate] = useState("");

    const [showIngresoDateInput, setShowIngresoDateInput] = useState(false);
    const [ingresoDate, setIngresoDate] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const formatTime = (hours, minutes) => {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const minTime = "08:00";
    const maxTime = "18:00";

    let dynamicMinTime = minTime;

    if (ingresoDate === today) {
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        if (currentHours >= 18) {
            dynamicMinTime = "18:00";
        } else {
            dynamicMinTime = formatTime(
                currentHours + (currentMinutes > 0 ? 1 : 0),
                0
            );
        }
    }

    const [servicios, setServicios] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [precioServicio, setPrecioServicio] = useState(0);
    const [serviciosEnModal, setServiciosEnModal] = useState([]);
    const [errorServicio, setErrorServicio] = useState("");
    const [errorServicios, setErrorServicios] = useState("");

    const abrirModal = () => {
        setShowModal(true);
        setServicioSeleccionado("");
        setPrecioServicio(0);
        setServiciosEnModal([]);
    };

    const agregarServicioAlModal = () => {
        let hayError = false;

        if (!servicioSeleccionado) {
            setErrorServicio("Debes seleccionar un servicio");
            alert("Debes de seleccionar un servicio antes de agregarlo.");
            return;
        }

        if (hayError) {
            alert("Debes llenar correctamente los campos del servicio.");
            return;
        }

        const servicio = serviciosDisponibles.find(s => s.nombre === servicioSeleccionado);
        if (servicio) {
            setServiciosEnModal([...serviciosEnModal, servicio]);
            setServicioSeleccionado("");
            setPrecioServicio(0);
            setErrorServicio("");
        }

        const nuevoServicio = {
            nombre: servicioSeleccionado,
            precioUnitarioServicio,
            cantidadServicio,
        };

        setServiciosEnModal([...serviciosEnModal, nuevoServicio]);
        setServicioSeleccionado("");
        setPrecioUnitarioServicio(0);
        setCantidadServicio(1);
        setTocoValidarServicio(false);
        setTocoValidarCantidadServicio(false);
    };

    const guardarServiciosDelModal = () => {

        if (serviciosEnModal.length === 0) {
            alert("Debes agregar al menos un servicio antes de guardar.");
            return;
        }

        setServicios([...servicios, ...serviciosEnModal]);


        setServiciosEnModal([]);

        setShowModal(false);
    };

    const handleGuardarCambios = () => {
        if (validacionesOK) {
            setMostrarModalEditar(false); 
        }
    };


    const cancelarModal = () => {
        setServiciosEnModal([]);
        setShowModal(false);
    };

    const { darkMode } = useTheme();

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de citas</h1>
            </div>

            <button onClick={openCrearModal} className="crear-btn mb-4">
                Crear cita
            </button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar cita..."
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
                            <th>Manicurista</th>
                            <th>Servicios</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citasActuales.length > 0 ? (
                            citasActuales.map((cita) => {
                                const esEditable = cita.estado === 'Pendiente';

                                return (
                                    <tr key={cita.id}>
                                        <td>{cita.cliente}</td>
                                        <td>{cita.manicurista}</td>
                                        <td>{cita.servicios}</td>
                                        <td>{cita.fecha}</td>
                                        <td>{cita.hora}</td>
                                        <td>
                                            <span
                                                className={`estado ${cita.estado === 'Pendiente'
                                                    ? 'estado-pendiente'
                                                    : cita.estado === 'Completada'
                                                        ? 'estado-completada'
                                                        : 'estado-anulada'
                                                    }`}
                                            >
                                                {cita.estado}
                                            </span>
                                        </td>
                                        <td className="text-center space-x-2">
                                            <button
                                                onClick={() => abrirEditarModal(cita)}
                                                className="acciones-btn editar-btn flex items-center justify-center p-2"
                                                title="Editar la cita"
                                            >
                                                <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                            </button>
                                            <button
                                                onClick={() => openVerModal(cita)}
                                                className="acciones-btn ver-btn flex items-center justify-center p-2"
                                                title="Ver detalle de la cita"
                                            >
                                                <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                            </button>

                                            <button
                                                onClick={() => esEditable && completarCita(cita)}
                                                className={`acciones-btn ver-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Completar la cita"
                                            >
                                                <AiOutlineCheck size={18} className="text-green-500 hover:text-green-700" />
                                            </button>

                                            <button
                                                onClick={() => esEditable && cancelarCita(cita)}
                                                className={`acciones-btn eliminar-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Cancelar la cita"
                                            >
                                                <MdBlock size={18} className="text-red-500 hover:text-red-700" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron citas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                            <h2 className="titulo-usuario">Crear cita</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleCrearCita(); }} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <select
                                                name="cliente"
                                                className="input-select"
                                                vvalue={clienteSeleccionado}
                                                onChange={(e) => {
                                                    setClienteSeleccionado(e.target.value);
                                                    setErrorCliente("");
                                                }}
                                                onBlur={() => {
                                                    if (!clienteSeleccionado) {
                                                        setErrorCliente("Debes seleccionar un cliente");
                                                    }
                                                }}
                                            >
                                                <option value="">Selecciona cliente *</option>
                                                <option value="Paula Gallego">Martha Ciro</option>
                                                <option value="Martha Ciro">Gloria Aristizabal</option>
                                                <option value="Adriana Viana">Andrea Agudelo</option>
                                            </select>
                                            {errorCliente && (
                                                <p className="error-texto">{errorCliente}</p>
                                            )}
                                        </div>
                                        <div className="campo">
                                            <select
                                                name="manicurista"
                                                className="input-select"
                                                value={manicurista}
                                                onChange={(e) => {
                                                    setManicurista(e.target.value);
                                                    setErrorManicurista("");
                                                }}
                                                onBlur={() => {
                                                    if (!manicurista) {
                                                        setErrorManicurista("Debes seleccionar una manicurista");
                                                    }
                                                }}
                                            >
                                                <option value="">Selecciona manicurista *</option>
                                                <option value="Laura Martínez">Sofia Perez</option>
                                                <option value="Carolina Pérez">Mónica Sánchez</option>
                                                <option value="Ana Torres">Carla Muñoz</option>
                                            </select>
                                            {errorManicurista && (
                                                <p className="error-texto">{errorManicurista}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="fila-formulario">
                                        <div className="campo">

                                            <div className="mb-4">
                                                {showIngresoDateInput || ingresoDate ? (
                                                    <input
                                                        type="date"
                                                        id="fechaIngreso"
                                                        name="fechaIngreso"
                                                        className="input-fecha-activo-fecha-cita"
                                                        value={ingresoDate}
                                                        min={today}
                                                        onChange={(e) => {
                                                            setIngresoDate(e.target.value);
                                                            setHoraIngresoDate("");
                                                            setErrorIngresoDate("");
                                                        }}
                                                        onBlur={() => {
                                                            if (!ingresoDate) {
                                                                setShowIngresoDateInput(false);
                                                                setErrorIngresoDate("Debes de seleccionar una fecha");
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => setShowIngresoDateInput(true)}
                                                        className="input-fecha-placeholder-fecha-cita"
                                                    >
                                                        Fecha de la cita *
                                                    </div>
                                                )}
                                            </div>
                                            {errorIngresoDate && (
                                                <p className="error-texto">{errorIngresoDate}</p>
                                            )}

                                        </div>
                                        <div className="campo">
                                            <div className="mb-4">
                                                {showHoraIngresoDateInput || horaingresoDate ? (
                                                    <input
                                                        type="time"
                                                        id="horaIngreso"
                                                        name="horaIngreso"
                                                        className="input-fecha-activo-cita"
                                                        value={horaingresoDate}
                                                        min={dynamicMinTime}
                                                        max={maxTime}
                                                        onChange={(e) => {
                                                            setHoraIngresoDate(e.target.value);
                                                            setErrorHoraIngresoDate("");
                                                        }}
                                                        onBlur={() => {
                                                            if (!horaingresoDate) {
                                                                setShowHoraIngresoDateInput(false);
                                                                setErrorHoraIngresoDate("Debes seleccionar una hora");
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => setShowHoraIngresoDateInput(true)}
                                                        className="input-fecha-placeholder-cita"
                                                    >
                                                        Hora de la cita *
                                                    </div>
                                                )}
                                            </div>
                                            {errorHoraIngresoDate && (
                                                <p className="error-texto">{errorHoraIngresoDate}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="fila-formulario">
                                    <button
                                        type="button"
                                        className="btn-agregar-servicio"
                                        onClick={abrirModal}
                                    >
                                        Agregar servicios a la cita
                                    </button>
                                </div>

                                <div className="servicios-agregados">
                                    <h3 className="titulo-seccion">Servicios agregados</h3>
                                    {servicios.length === 0 ? (
                                        <>
                                            <p className="mensaje-vacio">No has agregado servicios aún.</p>
                                            {errorServicios && (
                                                <p className="error-texto">{errorServicios}</p>
                                            )}
                                        </>

                                    ) : (
                                        <div className="lista-servicios-grid">
                                            {servicios.map((srv, index) => (
                                                <div key={index} className="servicio-card">
                                                    <div className="info-servicio">
                                                        <span className="nombre-servicio">{srv.nombre}</span>
                                                        <span className="detalle-servicio">Precio: ${srv.precio}</span>
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
                                    <div className="campo">
                                        <input
                                            type="text"
                                            className="input-texto"
                                            value={descripcion}
                                            onChange={(e) => {
                                                setDescripcion(e.target.value);
                                                setErrorDescripcion("");
                                            }}
                                            placeholder="Descripción de la cita"
                                            onBlur={() => {
                                                if (!descripcion) {
                                                    setErrorDescripcion("Debes ingresar una descripción");
                                                }
                                            }}
                                        />
                                        {errorDescripcion && (
                                            <p className="error-texto">{errorDescripcion}</p>
                                        )}
                                    </div>

                                </div>
                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear cita
                                    </button>
                                </div>
                            </form>
                            {showModal && (
                                <div className="modal-fondo">
                                    <div className="modal-contenido-cita">
                                        <h2 className="solo-oscuro">Agregar servicios</h2>

                                        <div className="modal-form-row">
                                            <div className="campo">
                                                <select
                                                    value={servicioSeleccionado}
                                                    onChange={(e) => {
                                                        const srv = serviciosDisponibles.find(
                                                            (s) => s.nombre === e.target.value
                                                        );
                                                        if (srv) {
                                                            setServicioSeleccionado(srv.nombre);
                                                            setPrecioServicio(srv.precio);
                                                            setErrorServicio("");
                                                        } else {
                                                            setServicioSeleccionado("");
                                                            setPrecioServicio(0);
                                                        }
                                                    }}
                                                    className="input-select modal-input"
                                                    onBlur={() => {
                                                        if (!servicioSeleccionado) {
                                                            setErrorServicio("Debes seleccionar un servicio");
                                                        }
                                                    }}
                                                >
                                                    <option value="">Selecciona servicio</option>
                                                    {serviciosDisponibles.map((srv, index) => (
                                                        <option key={index} value={srv.nombre}>
                                                            {srv.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errorServicio && (
                                                    <p className="error-texto">{errorServicio}</p>
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                className="input-texto modal-input"
                                                value={precioServicio ? `$${precioServicio}` : ""}
                                                placeholder="Precio"
                                                readOnly
                                            />
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
                                                serviciosEnModal.map((srv, index) => (
                                                    <div key={index} className="servicio-item-modal">
                                                        {srv.nombre} - ${srv.precio}
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
                                                Guardar servicios
                                            </button>
                                            <button
                                                onClick={cancelarModal}
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

            {isEditarModalOpen && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div
                        className="ventana-popup max-h-[300vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="contenido-popup3">
                            <h2 className="titulo-usuario">Editar cita</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();


                                    const errores = {};

                                    if (!cliente) errores.cliente = "Este campo es obligatorio";
                                    if (!manicurista) errores.manicurista = "Este campo es obligatorio";
                                    if (!ingresoDate) errores.fecha = "Este campo es obligatorio";
                                    if (!horaingresoDate) errores.hora = "Este campo es obligatorio";
                                    if (!descripcion.trim()) errores.descripcion = "Este campo es obligatorio";
                                    if (servicios.length === 0) errores.servicios = "Agrega al menos un servicio";

                                    setErrores(errores);

                                    if (Object.keys(errores).length > 0) return;

                                    const citaActualizada = {
                                        ...citaSeleccionada,
                                        cliente,
                                        manicurista,
                                        fecha: ingresoDate,
                                        hora: horaingresoDate,
                                        descripcion,
                                        servicios: servicios.map(s => s.nombre).join(", ")
                                    };

                                    const nuevasCitas = citas.map(c =>
                                        c.id === citaSeleccionada.id ? citaActualizada : c
                                    );

                                    setCitas(nuevasCitas);
                                    setIsEditarModalOpen(false);
                                }}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre del cliente:</label>
                                            <select
                                                name="cliente"
                                                className="input-select"
                                                value={cliente}
                                                onChange={(e) => {
                                                    setCliente(e.target.value);
                                                    validarCampo("cliente", e.target.value);
                                                }}
                                                onBlur={(e) => validarCampo("cliente", e.target.value)}
                                            >
                                                <option value="">Selecciona cliente</option>
                                                <option value="Martha Ciro">Martha Ciro</option>
                                                <option value="Paula Gallego">Paula Gallego</option>
                                                <option value="Adriana Viana">Adriana Viana</option>
                                            </select>
                                            {errores.cliente && <p className="error-texto">{errores.cliente}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre de la manicurista:</label>
                                            <select
                                                name="manicurista"
                                                className="input-select"
                                                value={manicurista}
                                                onChange={(e) => {
                                                    setManicurista(e.target.value);
                                                    validarCampo("manicurista", e.target.value);
                                                }}
                                                onBlur={(e) => validarCampo("manicurista", e.target.value)}
                                            >
                                                <option value="">Selecciona manicurista</option>
                                                <option value="Sofia Perez">Sofia Perez</option>
                                                <option value="Mónica Sánchez">Mónica Sánchez</option>
                                                <option value="Carla Muñoz">Carla Muñoz</option>
                                            </select>
                                            {errores.manicurista && <p className="error-texto">{errores.manicurista}</p>}
                                        </div>
                                    </div>
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Fecha:</label>
                                            <input
                                                type="date"
                                                className="input-fecha-activo-fecha-cita"
                                                value={ingresoDate}
                                                onChange={(e) => {
                                                    setIngresoDate(e.target.value);
                                                    validarCampo("fecha", e.target.value);
                                                }}
                                                onBlur={(e) => validarCampo("fecha", e.target.value)}
                                            />
                                            {errores.fecha && <p className="error-texto">{errores.fecha}</p>}
                                        </div>
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Hora:</label>
                                            <input
                                                type="time"
                                                className="input-fecha-activo-cita"
                                                value={horaingresoDate}
                                                onChange={(e) => {
                                                    setHoraIngresoDate(e.target.value);
                                                    validarCampo("hora", e.target.value);
                                                }}
                                                onBlur={(e) => validarCampo("hora", e.target.value)}
                                            />
                                            {errores.hora && <p className="error-texto">{errores.hora}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <button
                                        type="button"
                                        className="btn-agregar-servicio"
                                        onClick={abrirModal}
                                    >
                                        Editar servicios
                                    </button>
                                    {errores.servicios && <p className="error-texto">{errores.servicios}</p>}
                                </div>

                                <div className="servicios-agregados">
                                    <h3 className="titulo-seccion">Servicios agregados</h3>
                                    {servicios.length === 0 ? (
                                        <p className="mensaje-vacio">No has agregado servicios aún.</p>
                                    ) : (
                                        <div className="lista-servicios-grid">
                                            {servicios.map((srv, index) => (
                                                <div key={index} className="servicio-card">
                                                    <div className="info-servicio">
                                                        <span className="nombre-servicio">{srv.nombre}</span>
                                                        <span className="detalle-servicio">
                                                            Precio: ${srv.precio}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="btn-eliminar-servicio"
                                                        onClick={() => {
                                                            const nuevosServicios = servicios.filter(
                                                                (_, i) => i !== index
                                                            );
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
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Descripción:</label>
                                        <input
                                            type="text"
                                            className="input-texto"
                                            value={descripcion}
                                            onChange={(e) => {
                                                setDescripcion(e.target.value);
                                                validarCampo("descripcion", e.target.value);
                                            }}
                                            onBlur={(e) => validarCampo("descripcion", e.target.value)}
                                            placeholder="Descripción de la cita"
                                        />
                                        {errores.descripcion && <p className="error-texto">{errores.descripcion}</p>}
                                    </div>
                                </div>

                                <div className="button-container">
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={closeEditarModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                            {showModal && (
                                <div className="modal-fondo">
                                    <div className="modal-contenido-cita">
                                        <h2 className="solo-oscuro">Editar servicios</h2>

                                        <div className="modal-form-row">
                                            <select
                                                value={servicioSeleccionado}
                                                onChange={(e) => {
                                                    const srv = serviciosDisponibles.find(
                                                        (s) => s.nombre === e.target.value
                                                    );
                                                    if (srv) {
                                                        setServicioSeleccionado(srv.nombre);
                                                        setPrecioServicio(srv.precio);
                                                    } else {
                                                        setServicioSeleccionado("");
                                                        setPrecioServicio(0);
                                                    }
                                                }}
                                                className="input-select modal-input"
                                            >
                                                <option value="">Selecciona servicio</option>
                                                {serviciosDisponibles.map((srv, index) => (
                                                    <option key={index} value={srv.nombre}>
                                                        {srv.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            <input
                                                type="text"
                                                className="input-texto modal-input"
                                                value={precioServicio ? `$${precioServicio}` : ""}
                                                placeholder="Precio"
                                                readOnly
                                            />
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
                                                serviciosEnModal.map((srv, index) => (
                                                    <div key={index} className="servicio-item-modal">
                                                        {srv.nombre} - ${srv.precio}
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
                                            <button className="btn-crear" onClick={handleGuardarCambios}>Guardar cambios</button>
                                            <button
                                                onClick={cancelarModal}
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

            {isVerModalOpen && citaSeleccionada && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles de la cita</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del cliente:</strong> {citaSeleccionada.cliente}</p>
                                        <p><strong>Nombre de la manicurista:</strong> {citaSeleccionada.manicurista}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Servicio a realizar:</strong> {citaSeleccionada.servicios}</p>
                                        <p><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Hora:</strong> {citaSeleccionada.hora || "26/05/1997"}</p>
                                        <p><strong>Descripción:</strong> {citaSeleccionada.descripcion || "05/10/2024"}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center h-full">
                                    <p><strong>Estado:</strong> {citaSeleccionada.estado}</p>
                                </div>
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
        </div>
    );
};

export default GestionCitas;
