import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';
import "../../../css/gestionar.css";
import "../../../css/horarios.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";

const GestionHorariosMan = () => {

    const [horarios, setHorarios] = useState([
        { id: 1, manicurista: "Paula González", fecha: "2025-03-20", horaEntrada: "08:00", horaSalida: "16:00", motivo: "Turno regular", estado: false },
        { id: 2, manicurista: "Paula González", fecha: "2025-03-21", horaEntrada: "11:00", horaSalida: "18:00", motivo: "Horario flexible", estado: true },
        { id: 3, manicurista: "Paula González", fecha: "2025-03-28", horaEntrada: "12:00", horaSalida: "18:00", motivo: "Horario flexible", estado: true },
    ]);

    const [showHireDateInput, setShowHireDateInput] = useState(false);
    const [hireDate, setHireDate] = useState("");

    const [showHoraEntradaInput, setShowHoraEntradaInput] = useState(false);
    const [showHoraSalidaInput, setShowHoraSalidaInput] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState({
        manicurista: "",
        fecha: "",
        horaEntrada: "",
        horaSalida: "",
        motivo: ""
    });
    const horariosPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        manicurista: "",
        fecha: "",
        horaEntrada: "",
        horaSalida: "",
        motivo: ""
    });

    const [errores, setErrores] = useState({});

    const validarCampo = (name, value) => {
        let error = "";

        if (!value.trim()) {
            switch (name) {
                case "manicurista":
                    error = "El nombre de la manicurista es obligatorio";
                    break;
                case "fecha":
                    error = "La fecha es obligatoria";
                    break;
                case "horaEntrada":
                    error = "La hora de entrada es obligatoria";
                    break;
                case "horaSalida":
                    error = "La hora de salida es obligatoria";
                    break;
                case "motivo":
                    error = "El motivo es obligatorio";
                    break;
                default:
                    error = "Campo obligatorio";
            }
        }

        setErrores((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errores[name]) {
            validarCampo(name, value);
        }
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarHorario = (horario) => {
        MySwal.fire({
            title: `Eliminar la novedad`,
            html: `
                                <p class="texto-blanco">¿Estás seguro de que deseas eliminar la novedad de la manicurista <strong>${horario.manicurista}</strong> en la fecha <strong>${horario.fecha}</strong>?</p>
                                `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7e2952',
            cancelButtonColor: '#d8d6d7',
            reverseButtons: true,
            customClass: {
                popup: 'swal-rosado'
            }
        })
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const handleCrearHorario = (e) => {
        e.preventDefault();

        let erroresTemp = {};
        let erroresEditarTemp = {};

        Object.keys(formData).forEach((campo) => {
            if ((campo !== "horaEntrada" && campo !== "horaSalida") && !formData[campo].trim()) {
                switch (campo) {
                    case "manicurista":
                        erroresTemp[campo] = "El nombre de la manicurista es obligatorio";
                        break;
                    case "fecha":
                        erroresTemp[campo] = "La fecha es obligatoria";
                        break;
                    case "motivo":
                        erroresTemp[campo] = "El motivo es obligatorio";
                        break;
                    default:
                        erroresTemp[campo] = "Campo obligatorio";
                }
            }
        });

        if (!formData.fecha || formData.fecha.trim() === "") {
            erroresTemp["fecha"] = "La fecha es obligatoria";
        }

        if (!horarioSeleccionado.horaEntrada || horarioSeleccionado.horaEntrada.trim() === "") {
            erroresEditarTemp["horaEntrada"] = "La hora de entrada es obligatoria";
        }

        if (!horarioSeleccionado.horaSalida || horarioSeleccionado.horaSalida.trim() === "") {
            erroresEditarTemp["horaSalida"] = "La hora de salida es obligatoria";
        }

        setErrores(erroresTemp);
        setErroresEditar(erroresEditarTemp);

        const hayErrores = Object.values(erroresTemp).some((error) => error !== "") ||
            Object.values(erroresEditarTemp).some((error) => error !== "");

        if (!hayErrores) {
            const nuevoHorario = {
                id: horarios.length + 1,
                ...formData,
                horaEntrada: horarioSeleccionado.horaEntrada,
                horaSalida: horarioSeleccionado.horaSalida,
                estado: true
            };


            setHorarios([...horarios, nuevoHorario]);

            setFormData({
                manicurista: "",
                fecha: "",
                horaEntrada: "",
                horaSalida: "",
                motivo: ""
            });
            setHorarioSeleccionado({ horaEntrada: "", horaSalida: "" });
            setErrores({});
            setErroresEditar({});
            closeCrearModal();
        } else {
            alert("Por favor completa todos los campos obligatorios antes de continuar.");
            console.warn("Por favor completa todos los campos correctamente.");
        }
    };

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [horarioEditando, setHorarioEditando] = useState(null);
    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [isVerModalOpen, setVerModalOpen] = useState(false);

    const handleEditarHorario = (horario) => {
        setHorarioSeleccionado(horario);
        setHorarioEditando({ ...horario });
        setShowHoraEntradaInput(true);
        setShowHoraSalidaInput(true);
        setEditarModalOpen(true);
    };

    const [erroresEditar, setErroresEditar] = useState({});

    const closeEditarModal = () => {
        setEditarModalOpen(false);
        setHorarioSeleccionado({
            manicurista: "",
            fecha: "",
            horaEntrada: "",
            horaSalida: "",
            motivo: ""
        });
    };

    const handleVerHorario = (horario) => {
        setHorarioSeleccionado(horario);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setVerModalOpen(false);
        setHorarioSeleccionado({
            manicurista: "",
            fecha: "",
            horaEntrada: "",
            horaSalida: "",
            motivo: ""
        });
    };

    const handleToggleEstado = (id) => {
        setHorarios(horarios.map(horario =>
            horario.id === id ? { ...horario, estado: !horario.estado } : horario
        ));
    };


    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const horariosFiltrados = horarios.filter(horario =>
        Object.values(horario).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimo = paginaActual * horariosPorPagina;
    const indexPrimero = indexUltimo - horariosPorPagina;
    const horariosPaginados = horariosFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(horariosFiltrados.length / horariosPorPagina);

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
                <h1 className="titulo">Gestión de novedades</h1>

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

                    <Link to="/manicurista/dashboard/perfil">
                        <span title="Tú perfil">
                            <User className="icon" />
                        </span>
                    </Link>

                </div>
            </div>

            <button onClick={openCrearModal} className="crear-btn mt-4">
                Crear novedad
            </button>

            <div className="busqueda-container mb-4">
                <input

                    type="text"
                    placeholder="Buscar novedades..."
                    className="busqueda-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Manicurista</th>
                            <th>Fecha</th>
                            <th>Hora Entrada</th>
                            <th>Hora Salida</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horariosPaginados.length > 0 ? (
                            horariosPaginados.map((horario) => (
                                <tr key={horario.id}>
                                    <td>{horario.manicurista}</td>
                                    <td>{horario.fecha}</td>
                                    <td>{horario.horaEntrada}</td>
                                    <td>{horario.horaSalida}</td>
                                    <td>{horario.motivo}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(horario.id)}
                                            className={`estado-btn ${horario.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {horario.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarHorario(horario)}
                                            className="acciones-btn editar-btn"
                                            title="Editar novedad"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => handleVerHorario(horario)}
                                            className="acciones-btn ver-btn"
                                            title="Ver detalles de la novedad"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminarHorario(horario)}
                                            className="acciones-btn eliminar-btn"
                                            title="Eliminar novedad"
                                        >
                                            <FiTrash2 size={16} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontro esta novedad registrada</td>
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
                                <h2 className="text-xl font-semibold mb-4">Crear novedad</h2>
                                <form onSubmit={handleCrearHorario} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <select
                                                    name="manicurista"
                                                    className="input-select"
                                                    value={formData.manicurista}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <option value="">Seleccionar Manicurista *</option>
                                                    <option value="Paula González">Paula González</option>
                                                </select>
                                                {errores.manicurista && <p className="error-texto">{errores.manicurista}</p>}
                                            </div>
                                            <div className="campo">
                                                {(showHireDateInput || hireDate || errores.fecha) ? (
                                                    <input
                                                        type="date"
                                                        id="fecha"
                                                        name="fecha"
                                                        className={`input-fecha-activo ${errores.fecha ? "input-error" : ""}`}
                                                        value={formData.fecha}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => setShowHireDateInput(true)}
                                                        className="input-fecha-placeholder"
                                                    >
                                                        Fecha de ingreso *
                                                    </div>
                                                )}
                                                {errores.fecha && <p className="error-texto">{errores.fecha}</p>}
                                            </div>

                                        </div>

                                        <div className="fila-formulario">
                                            <div className="mb-4 campo">
                                                {showHoraEntradaInput || horarioSeleccionado.horaEntrada ? (
                                                    <input
                                                        type="time"
                                                        name="horaEntrada"
                                                        className="input-fecha-activo-horario"
                                                        value={horarioSeleccionado.horaEntrada}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setHorarioSeleccionado({ ...horarioSeleccionado, horaEntrada: value });
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                horaEntrada: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                            }));
                                                        }}
                                                        onBlur={() => {
                                                            if (!horarioSeleccionado.horaEntrada.trim()) {
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaEntrada: "Este campo es obligatorio",
                                                                }));
                                                            } else {
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaEntrada: "",
                                                                }));
                                                            }
                                                            setShowHoraEntradaInput(horarioSeleccionado.horaEntrada.trim() !== "");
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="input-fecha-placeholder-horario"
                                                        onClick={() => setShowHoraEntradaInput(true)}
                                                    >
                                                        Hora de entrada *
                                                    </div>
                                                )}
                                                {erroresEditar.horaEntrada && (
                                                    <p className="error-texto">{erroresEditar.horaEntrada}</p>
                                                )}
                                            </div>


                                            <div className="mb-4 campo">
                                                {showHoraSalidaInput || horarioSeleccionado.horaSalida ? (
                                                    <input
                                                        type="time"
                                                        name="horaSalida"
                                                        className="input-fecha-activo-horario"
                                                        value={horarioSeleccionado.horaSalida}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setHorarioSeleccionado({ ...horarioSeleccionado, horaSalida: value });
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                horaSalida: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                            }));
                                                        }}
                                                        onBlur={() => {
                                                            if (!horarioSeleccionado.horaSalida.trim()) {
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaSalida: "Este campo es obligatorio",
                                                                }));
                                                            } else {
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaSalida: "",
                                                                }));
                                                            }
                                                            setShowHoraSalidaInput(horarioSeleccionado.horaSalida.trim() !== "");
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="input-fecha-placeholder-horario"
                                                        onClick={() => setShowHoraSalidaInput(true)}
                                                    >
                                                        Hora de salida *
                                                    </div>
                                                )}

                                                {/* 🔥 Siempre mostrar mensaje si hay error */}
                                                {erroresEditar.horaSalida && (
                                                    <p className="error-texto">{erroresEditar.horaSalida}</p>
                                                )}
                                            </div>

                                        </div>

                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <input
                                                    type="text"
                                                    name="motivo"
                                                    className="input-texto"
                                                    placeholder="Motivo *"
                                                    value={formData.motivo}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errores.motivo && <p className="error-texto">{errores.motivo}</p>}
                                            </div>
                                        </div>
                                        <div className="button-container">
                                            <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn-crear">
                                                Crear novedad
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {isEditarModalOpen && horarioSeleccionado && (
                    <div className="overlay-popup" onClick={closeEditarModal}>
                        <div className="ventana-popup max-h-[300vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="contenido-popup2">
                                <h2 className="text-xl font-semibold mb-4">Editar novedad</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const nuevosErrores = {};

                                        if (!horarioEditando.manicurista.trim()) {
                                            nuevosErrores.manicurista = "Este campo es obligatorio";
                                        }
                                        if (!horarioEditando.fecha.trim()) {
                                            nuevosErrores.fecha = "Este campo es obligatorio";
                                        }
                                        if (!horarioSeleccionado.horaEntrada.trim()) {
                                            nuevosErrores.horaEntrada = "Este campo es obligatorio";
                                        }
                                        if (!horarioSeleccionado.horaSalida.trim()) {
                                            nuevosErrores.horaSalida = "Este campo es obligatorio";
                                        }
                                        if (!horarioSeleccionado.motivo.trim()) {
                                            nuevosErrores.motivo = "Este campo es obligatorio";
                                        }
                                        if (horarioSeleccionado.estado === "") {
                                            nuevosErrores.estado = "Campo obligatorio";
                                        }

                                        if (Object.keys(nuevosErrores).length > 0) {
                                            setErroresEditar(nuevosErrores);
                                            return;
                                        }

                                        closeEditarModal();
                                    }}
                                    className="space-y-3"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Manicurista:</label>
                                                <select
                                                    name="manicurista"
                                                    value={horarioEditando.manicurista}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setHorarioEditando({ ...horarioEditando, manicurista: value });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            manicurista: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    onBlur={() => {
                                                        if (!horarioEditando.manicurista.trim()) {
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                manicurista: "Este campo es obligatorio",
                                                            }));
                                                        }
                                                    }}
                                                    className="input-select"
                                                >
                                                    <option value="">Seleccionar Manicurista</option>
                                                    <option value="Paula González">Paula González</option>
                                                </select>
                                                {erroresEditar.manicurista && <p className="error-mensaje">{erroresEditar.manicurista}</p>}
                                            </div>
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Fecha:</label>
                                                <input
                                                    type="date"
                                                    className="input-texto"
                                                    value={horarioEditando.fecha}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setHorarioEditando({ ...horarioEditando, fecha: value });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            fecha: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    onBlur={() => {
                                                        if (!horarioEditando.fecha.trim()) {
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                fecha: "Este campo es obligatorio",
                                                            }));
                                                        }
                                                    }}
                                                    placeholder="Fecha"
                                                />
                                                {erroresEditar.fecha && <p className="error-mensaje">{erroresEditar.fecha}</p>}
                                            </div>
                                        </div>

                                        <div className="fila-formulario">
                                            <div className="mb-4 campo">
                                                <label className="subtitulo-editar-todos">Hora de entrada:</label>
                                                {horarioSeleccionado.horaEntrada || showHoraEntradaInput ? (
                                                    <input
                                                        type="time"
                                                        name="horaEntrada"
                                                        className="input-fecha-activo-horario"
                                                        value={horarioSeleccionado.horaEntrada}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setHorarioSeleccionado({ ...horarioSeleccionado, horaEntrada: value });
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                horaEntrada: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                            }));
                                                        }}
                                                        onBlur={() => {
                                                            if (!horarioSeleccionado.horaEntrada) {
                                                                setShowHoraEntradaInput(false);
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaEntrada: "Este campo es obligatorio",
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="input-fecha-placeholder-horario"
                                                        onClick={() => setShowHoraEntradaInput(true)}
                                                    >
                                                        Hora de entrada
                                                    </div>
                                                )}
                                                {erroresEditar.horaEntrada && <p className="error-texto">{erroresEditar.horaEntrada}</p>}
                                            </div>
                                            <div className="mb-4 campo">
                                                <label className="subtitulo-editar-todos">Hora de salida:</label>
                                                {horarioSeleccionado.horaSalida || showHoraSalidaInput ? (
                                                    <>
                                                        <input
                                                            type="time"
                                                            name="horaSalida"
                                                            className="input-fecha-activo-horario"
                                                            value={horarioSeleccionado.horaSalida}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setHorarioSeleccionado({ ...horarioSeleccionado, horaSalida: value });
                                                                setErroresEditar((prev) => ({
                                                                    ...prev,
                                                                    horaSalida: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                                }));
                                                            }}
                                                            onBlur={() => {
                                                                if (!horarioSeleccionado.horaSalida) {
                                                                    setShowHoraSalidaInput(false);
                                                                    setErroresEditar((prev) => ({
                                                                        ...prev,
                                                                        horaSalida: "Este campo es obligatorio",
                                                                    }));
                                                                }
                                                            }}
                                                        />
                                                    </>
                                                ) : (
                                                    <div
                                                        className="input-fecha-placeholder-horario"
                                                        onClick={() => setShowHoraSalidaInput(true)}
                                                    >
                                                        Hora de salida
                                                    </div>
                                                )}
                                                {erroresEditar.horaSalida && <p className="error-texto">{erroresEditar.horaSalida}</p>}
                                            </div>
                                        </div>
                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Motivo:</label>
                                                <input
                                                    className="input-texto"
                                                    value={horarioSeleccionado.motivo}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setHorarioSeleccionado({ ...horarioSeleccionado, motivo: value });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            motivo: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    onBlur={() => {
                                                        if (!horarioSeleccionado.motivo.trim()) {
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                motivo: "Este campo es obligatorio",
                                                            }));
                                                        }
                                                    }}
                                                    placeholder="Motivo"
                                                />
                                                {erroresEditar.motivo && <p className="error-mensaje">{erroresEditar.motivo}</p>}
                                            </div>

                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Estado:</label>
                                                <select
                                                    name="estado"
                                                    value={horarioSeleccionado.estado ? "activo" : "inactivo"}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setHorarioSeleccionado({ ...horarioSeleccionado, estado: value === "activo" });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            estado: value.trim() === "" ? "Campo obligatorio" : "",
                                                        }));
                                                    }}
                                                    onBlur={(e) => {
                                                        if (e.target.value.trim() === "") {
                                                            setErroresEditar((prev) => ({
                                                                ...prev,
                                                                estado: "Campo obligatorio",
                                                            }));
                                                        }
                                                    }}
                                                    className="input-select"
                                                >
                                                    <option value="">Selecciona el estado</option>
                                                    <option value="activo">Activo</option>
                                                    <option value="inactivo">Inactivo</option>
                                                </select>
                                                {erroresEditar.estado && <p className="error-mensaje">{erroresEditar.estado}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="button-container">
                                        <button type="button" className="btn-cancelar" onClick={closeEditarModal}>Cancelar</button>
                                        <button type="submit" className="btn-crear">Guardar cambios</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {
                    isVerModalOpen && horarioSeleccionado && (
                        <div className="overlay-popup" onClick={closeVerModal}>
                            <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                                <div className="contenido-popup2">
                                    <h2 className="titulo-usuario">Detalles de la novedad</h2>
                                    <div className="info-usuario space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="fila-formulario">
                                                <p><strong>Manicurista:</strong> {horarioSeleccionado.manicurista}</p>
                                                <p><strong>Fecha:</strong> {horarioSeleccionado.fecha}</p>
                                            </div>
                                            <div className="fila-formulario">
                                                <p><strong>Hora de Entrada:</strong> {horarioSeleccionado.horaEntrada}</p>
                                                <p><strong>Hora de Salida:</strong> {horarioSeleccionado.horaSalida}</p>
                                            </div>
                                            <div className="fila-formulario">
                                                <p><strong>Motivo:</strong> {horarioSeleccionado.motivo}</p>
                                                <p><strong>Estado:</strong> {horarioSeleccionado.estado ? "Activo" : "Inactivo"}</p>
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
                        </div>
                    )
                }

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
            </div >
        </div >
    );
};

export default GestionHorariosMan;