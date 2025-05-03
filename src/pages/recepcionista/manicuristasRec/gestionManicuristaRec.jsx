import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionManicuristaRec = () => {

    const [manicuristas, setManicuristas] = useState([
        { id: 1, nombre: "Sofia", apellido: "Pérez", documento: "11355647", tipoDocumento: "CC", telefono: "3118675434", correo: "sofi@gmail.com", fecha_c: "10/04/2025", fecha_n: "12/10/2000", estado: true },
        { id: 2, nombre: "Mónica", apellido: "Sánchez", documento: "104586758", tipoDocumento: "CC", telefono: "3004659823", correo: "monica946@gmail.com", fecha_c: "01/04/2025", fecha_n: "12/11/1998", estado: true },
        { id: 3, nombre: "Carla", apellido: "Muñoz", documento: "1345913112", tipoDocumento: "CC", telefono: "3138846578", correo: "muñoz@gmail.com", fecha_c: "02/03/2025", fecha_n: "12/04/1996", estado: false },
    ]);

    const [showBirthDateInput, setShowBirthDateInput] = useState(false);
    const [birthDate, setBirthDate] = useState("");

    const [showHireDateInput, setShowHireDateInput] = useState(false);
    const [hireDate, setHireDate] = useState("");

    const [ManicuristaSeleccionado, setManicuristaSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const manicuristaPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        tipoDocumento: "",
        documento: "",
        telefono: "",
        fechaNacimiento: "",
        fechaContratacion: "",
    });

    const [errores, setErrores] = useState({});

    const validarCampo = (name, value) => {
        let error = "";

        if (!value.trim()) {
            switch (name) {
                case "nombre":
                    error = "El nombre es obligatorio";
                    break;
                case "apellido":
                    error = "El apellido es obligatorio";
                    break;
                case "correo":
                    error = "El correo electrónico es obligatorio";
                    break;
                case "tipoDocumento":
                    error = "El tipo de documento es obligatorio";
                    break;
                case "documento":
                    error = "El número de documento es obligatorio";
                    break;
                case "telefono":
                    error = "El número de teléfono es obligatorio";
                    break;
                case "fechaNacimiento":
                    error = "La fecha de nacimiento es obligatoria";
                    break;
                case "fechaContratacion":
                    error = "La fecha de contratación es obligatoria";
                    break;
                default:
                    error = "Campo obligatorio";
            }
        } else {
            if (name === "correo") {
                const dominiosPermitidos = ["@gmail.com", "@outlook.com", "@yahoo.es"];
                const incluyeDominio = dominiosPermitidos.some((dom) =>
                    value.toLowerCase().endsWith(dom)
                );
                if (!value.includes("@") || !incluyeDominio) {
                    error =
                        "Correo inválido. Usa @gmail.com, @outlook.com o @yahoo.es";
                }
            }

            if (name === "telefono") {
                const soloNumeros = value.replace(/\D/g, "");
                if (soloNumeros.length !== 10) {
                    error = "El teléfono debe tener exactamente 10 números";
                }
            }

            if (name === "fechaNacimiento") {
                const fecha = new Date(value);
                const hoy = new Date();
                const edad = hoy.getFullYear() - fecha.getFullYear();
                const mes = hoy.getMonth() - fecha.getMonth();
                const dia = hoy.getDate() - fecha.getDate();

                if (edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)))) {
                    error = "Debe ser mayor de 18 años";
                }

                if (formData.fechaContratacion) {
                    const fecha18Anios = new Date(fecha);
                    fecha18Anios.setFullYear(fecha.getFullYear() + 18);

                    if (new Date(formData.fechaContratacion) < fecha18Anios) {
                        setErrores((prev) => ({
                            ...prev,
                            fechaContratacion:
                                "La fecha de contratación debe ser al menos 18 años después de la fecha de nacimiento",
                        }));
                    } else {
                        setErrores((prev) => ({ ...prev, fechaContratacion: "" }));
                    }
                }
            }

            if (name === "fechaContratacion") {
                if (formData.fechaNacimiento) {
                    const fechaNacimientoObj = new Date(formData.fechaNacimiento);
                    const fecha18Anios = new Date(fechaNacimientoObj);
                    fecha18Anios.setFullYear(fechaNacimientoObj.getFullYear() + 18);

                    if (new Date(value) < fecha18Anios) {
                        error =
                            "La fecha de contratación debe ser al menos 18 años después de la fecha de nacimiento";
                    }
                }
            }
        }

        setErrores((prev) => ({ ...prev, [name]: error }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarManicurista = (manicurista) => {
        MySwal.fire({
            title: `Eliminar manicurista`,
            html: `
                    <p class="texto-blanco">¿Estás seguro de que deseas eliminar a <strong>${manicurista.nombre} ${manicurista.apellido}</strong>?</p>
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

    const handleCrear = (e) => {
        e.preventDefault();

        let erroresTemp = {};
        Object.keys(formData).forEach((campo) => {
            validarCampo(campo, formData[campo]);
            if (!formData[campo].trim()) {
                erroresTemp[campo] = "Campo obligatorio";
            }
        });

        const hayErrores =
            Object.values(errores).some((e) => e) ||
            Object.values(formData).some((val) => val.trim() === "");

        if (!hayErrores) {
            setManicuristas((prev) => [
                ...prev,
                { id: prev.length + 1, ...formData, estado: true },
            ]);
            closeCrearModal();
        } else {
            alert("Por favor completa todos los campos correctamente.");
        }
    };

    const inputClass = (name) =>
        errores[name] ? "input-texto input-error" : "input-texto";

    const selectClass = (name) =>
        errores[name] ? "input-select input-error" : "input-select";

    const renderPlaceholder = (label, name) => {
        return `${label} *`;
    };


    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [manicuristaEditando, setManicuristaEditando] = useState(null);

    const openEditarModal = (manicurista) => {
        const formatoFecha = (fecha) => {
            const partes = fecha.includes('/') ? fecha.split('/') : fecha.split('-');
            const [dia, mes, anio] = partes;
            return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        };

        setManicuristaEditando({
            ...manicurista,
            fecha_n: formatoFecha(manicurista.fecha_n),
            fecha_c: formatoFecha(manicurista.fecha_c)
        });

        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setManicuristaEditando(null);
        setEditarModalOpen(false);
    };

    const handleEditarManicurista = (id) => {
        const manicurista = manicuristas.find(u => u.id === id);
        openEditarModal(manicurista);
    };

    const [erroresEditar, setErroresEditar] = useState({});



    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (manicurista) => {
        setManicuristaSeleccionado(manicurista);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setManicuristaSeleccionado(null);
        setVerModalOpen(false);
    };


    const handleToggleEstado = (id) => {
        setManicuristas(manicuristas.map(manicurista =>
            manicurista.id === id ? { ...manicurista, estado: !manicurista.estado } : manicurista
        ));
    };


    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const manicuristasFiltrados = manicuristas.filter(manicurista =>
        Object.values(manicurista).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoManicurista = paginaActual * manicuristaPorPagina;
    const indexPrimerManicurista = indexUltimoManicurista - manicuristaPorPagina;
    const manicuristasActuales = manicuristasFiltrados.slice(indexPrimerManicurista, indexUltimoManicurista);
    const totalPaginas = Math.ceil(manicuristasFiltrados.length / manicuristaPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
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
                <h1 className="titulo">Gestión de manicuristas</h1>

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

                    <Link to="/recepcionista/dashboard/perfil">
                        <span title="Tú perfil">
                            <User className="icon" />
                        </span>
                    </Link>

                </div>
            </div>
            <button onClick={openCrearModal} className="crear-btn mt-4">
                Crear manicurista
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar manicurista..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Identificación</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {manicuristasActuales.length > 0 ? (
                            manicuristasActuales.map((manicurista) => (
                                <tr key={manicurista.id}>
                                    <td>{manicurista.nombre}</td>
                                    <td>{manicurista.apellido}</td>
                                    <td>{manicurista.documento}</td>
                                    <td>{manicurista.telefono}</td>
                                    <td>{manicurista.correo}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(manicurista.id)}
                                            className={`estado-btn ${manicurista.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {manicurista.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarManicurista(manicurista.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar la manicurista"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => openVerModal(manicurista)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalle de la manicurista"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => handleEliminarManicurista(manicurista)}
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                            title="Eliminar la manicurista"
                                        >
                                            <FiTrash2 size={16} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No se encontraron manicuristas</td>
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
                            <h2 className="text-xl font-semibold mb-4">Crear Manicurista</h2>
                            <form onSubmit={handleCrear} className="form-crear-usuario">
                                <div className="fila-formulario">
                                    <div className="campo relative">
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder={renderPlaceholder("Nombre", "nombre")}
                                            className={inputClass("nombre")}
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.nombre && <p className="error-texto absolute left-0 top-1/2 -translate-y-1/2 text-left text-red-600">{errores.nombre}</p>}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="apellido"
                                            placeholder={renderPlaceholder("Apellido", "apellido")}
                                            className={inputClass("apellido")}
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.apellido && <p className="error-texto">{errores.apellido}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <select
                                            name="tipoDocumento"
                                            className={selectClass("tipoDocumento")}
                                            value={formData.tipoDocumento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Tipo de Documento *</option>
                                            <option value="CC">CC</option>
                                            <option value="CE">CE</option>
                                        </select>
                                        {errores.tipoDocumento && <p className="error-texto">{errores.tipoDocumento}</p>}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="documento"
                                            placeholder={renderPlaceholder("Número de Documento", "documento")}
                                            className={inputClass("documento")}
                                            value={formData.documento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.documento && <p className="error-texto">{errores.documento}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            type="email"
                                            name="correo"
                                            placeholder={renderPlaceholder("Correo Electrónico", "correo")}
                                            className={inputClass("correo")}
                                            value={formData.correo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.correo && <p className="error-texto">{errores.correo}</p>}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder={renderPlaceholder("Celular", "telefono")}
                                            className={inputClass("telefono")}
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.telefono && <p className="error-texto">{errores.telefono}</p>}
                                    </div>
                                </div>


                                <div className="fila-formulario">
                                    <div className="campo">
                                        {showBirthDateInput || birthDate ? (
                                            <input
                                                type="date"
                                                name="fechaNacimiento"
                                                className="input-fecha-activo"
                                                value={formData.fechaNacimiento}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        ) : (
                                            <div onClick={() => setShowBirthDateInput(true)} className="input-fecha-placeholder">
                                                Fecha de nacimiento *
                                            </div>
                                        )}
                                        {errores.fechaNacimiento && <p className="error-texto">{errores.fechaNacimiento}</p>}
                                    </div>

                                    <div className="campo">
                                        {showHireDateInput || hireDate ? (
                                            <input
                                                type="date"
                                                id="fechaContratacion"
                                                name="fechaContratacion"
                                                className="input-fecha-activo"
                                                value={formData.fechaContratacion}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setShowHireDateInput(true)} className="input-fecha-placeholder">
                                                Fecha de contratación *
                                            </div>
                                        )}
                                        {errores.fechaContratacion && <p className="error-texto">{errores.fechaContratacion}</p>}
                                    </div>
                                </div>

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear Manicurista
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditarModalOpen && manicuristaEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar manicurista</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    const campos = {
                                        nombre: manicuristaEditando.nombre,
                                        apellido: manicuristaEditando.apellido,
                                        tipoDocumento: manicuristaEditando.tipoDocumento,
                                        documento: manicuristaEditando.documento,
                                        correo: manicuristaEditando.correo,
                                        telefono: manicuristaEditando.telefono,
                                        fecha_nacimiento: manicuristaEditando.fecha_n,
                                        fecha_contratacion: manicuristaEditando.fecha_c,
                                    };

                                    const nuevosErrores = {};
                                    Object.entries(campos).forEach(([campo, valor]) => {
                                        if (!valor.trim()) {
                                            nuevosErrores[campo] = "Campo obligatorio";
                                        }
                                    });

                                    if (Object.keys(nuevosErrores).length > 0) {
                                        setErroresEditar(nuevosErrores);
                                        return;
                                    }

                                    setManicuristas((prev) =>
                                        prev.map((u) => u.id === manicuristaEditando.id ? manicuristaEditando : u)
                                    );
                                    closeEditarModal();
                                }}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre:</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={manicuristaEditando.nombre}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, nombre: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        nombre: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Nombre"
                                                className="input-texto"
                                            />
                                            {erroresEditar.nombre && <p className="error-mensaje">{erroresEditar.nombre}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Apellido:</label>
                                            <input
                                                type="text"
                                                name="apellido"
                                                value={manicuristaEditando.apellido}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, apellido: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        apellido: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Apellido"
                                                className="input-texto"
                                            />
                                            {erroresEditar.apellido && <p className="error-mensaje">{erroresEditar.apellido}</p>}
                                        </div>
                                    </div>
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Tipo documento:</label>
                                            <select
                                                name="tipoDocumento"
                                                value={manicuristaEditando.tipoDocumento}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, tipoDocumento: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        tipoDocumento: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Tipo de Documento</option>
                                                <option value="CC">CC</option>
                                                <option value="CE">CE</option>
                                            </select>
                                            {erroresEditar.tipoDocumento && <p className="error-mensaje">{erroresEditar.tipoDocumento}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Número documento:</label>
                                            <input
                                                type="text"
                                                name="documento"
                                                value={manicuristaEditando.documento}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, documento: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        documento: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Documento"
                                                className="input-texto"
                                            />
                                            {erroresEditar.documento && <p className="error-mensaje">{erroresEditar.documento}</p>}
                                        </div>
                                    </div>

                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Correo:</label>
                                            <input
                                                type="email"
                                                name="correo"
                                                value={manicuristaEditando.correo}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, correo: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        correo: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Correo Electrónico"
                                                className="input-texto"
                                            />
                                            {erroresEditar.correo && <p className="error-mensaje">{erroresEditar.correo}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Celular:</label>
                                            <input
                                                type="tel"
                                                name="celular"
                                                value={manicuristaEditando.telefono}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, telefono: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        celular: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Celular"
                                                className="input-texto"
                                            />
                                            {erroresEditar.celular && <p className="error-mensaje">{erroresEditar.celular}</p>}
                                        </div>
                                    </div>

                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Fecha nacimiento:</label>
                                            <input
                                                type="date"
                                                name="fecha_nacimiento"
                                                value={manicuristaEditando.fecha_n}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, fecha_n: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        fecha_nacimiento: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Fecha de nacimiento"
                                                className="input-fecha-activo"
                                            />
                                            {erroresEditar.fecha_nacimiento && <p className="error-mensaje">{erroresEditar.fecha_nacimiento}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Fecha contratación:</label>
                                            <input
                                                type="date"
                                                name="fecha_contratacion"
                                                value={manicuristaEditando.fecha_c}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setManicuristaEditando({ ...manicuristaEditando, fecha_c: value });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        fecha_contratacion: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                placeholder="Fecha de contratación"
                                                className="input-fecha-activo"
                                            />
                                            {erroresEditar.fecha_contratacion && <p className="error-mensaje">{erroresEditar.fecha_contratacion}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Estado:</label>
                                        <select
                                            name="estado"
                                            value={manicuristaEditando.estado ? "activo" : "inactivo"}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setManicuristaEditando({ ...manicuristaEditando, estado: value === "activo" });
                                                setErroresEditar(prev => ({
                                                    ...prev,
                                                    estado: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
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

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeEditarModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {isVerModalOpen && ManicuristaSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles de la manicurista</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre de la manicurista:</strong> {ManicuristaSeleccionado.nombre} {ManicuristaSeleccionado.apellido}</p>
                                        <p><strong>Tipo de Documento:</strong> {ManicuristaSeleccionado.tipoDocumento}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Número de identificación:</strong> {ManicuristaSeleccionado.documento}</p>
                                        <p><strong>Correo:</strong> {ManicuristaSeleccionado.correo}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Teléfono:</strong> {ManicuristaSeleccionado.telefono}</p>
                                        <p><strong>Fecha de nacimiento:</strong> {ManicuristaSeleccionado.fecha_n}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Fecha de contratación:</strong> {ManicuristaSeleccionado.fecha_c}</p>
                                        <p><strong>Estado:</strong> {ManicuristaSeleccionado.estado ? "Activo" : "Inactivo"}</p>
                                    </div>

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

export default GestionManicuristaRec;