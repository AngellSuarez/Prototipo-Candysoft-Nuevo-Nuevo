import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionProveedoresRec = () => {

    const [proveedores, setProveedores] = useState([
        { id: 1, nombre: "Diego Mora", tipoDocumento: "CC", ciudad: "Medellin", documento: "1031234532", telefono: "3001234212", correo: "diego@gmail.com", direccion: "Carrera 12", estado: false },
        { id: 2, nombre: "Spa S.A.S", tipoDocumento: "NIT", ciudad: "Bogota", documento: "13425323G", telefono: "3012347654", correo: "spa@gmail.com", direccion: "Calle 24", estado: true, nombreContacto: "Juliana", apellidoContacto: "Perez", telefonoContacto: "3009876543", correoContacto: "juliana@spa.com" },
        { id: 3, nombre: "Adriana Viana", tipoDocumento: "CC", ciudad: "Medellin", documento: "101351198", telefono: "3023456787", correo: "adriana@gmail.com", direccion: "Calle 33", estado: true }
    ]);

    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const proveedorPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        tipoDocumento: "",
        documento: "",
        celular: "",
        correo: "",
        direccion: "",
        ciudad: "",
        nombreContacto: "",
        apellidoContacto: "",
        telefonoContacto: "",
        correoContacto: ""
    });

    const [errores, setErrores] = useState({});

    const obtenerNombreCampo = (campo) => {
        const nombres = {
            nombre: "nombre",
            tipoDocumento: "tipo de documento",
            documento: "documento",
            celular: "celular",
            correo: "correo",
            direccion: "dirección",
            ciudad: "ciudad",
            nombreContacto: "nombre del contacto",
            apellidoContacto: "apellido del contacto",
            telefonoContacto: "teléfono del contacto",
            correoContacto: "correo del contacto"
        };
        return nombres[campo] || campo;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (value.trim() !== "") {
            setErrores((prev) => {
                const nuevosErrores = { ...prev };
                delete nuevosErrores[name];
                return nuevosErrores;
            });
        }
    };

    // Valida campos al perder el foco, con reglas específicas para celular y correo
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (!value.trim()) {
            const nombreCampo = obtenerNombreCampo(name);
            setErrores((prev) => ({ ...prev, [name]: `El ${nombreCampo} es obligatorio` }));
        } else {
            let error = "";

            if (name === "celular" || name === "telefonoContacto") {
                if (!/^\d{10}$/.test(value)) {
                    error = "El celular debe tener exactamente 10 números";
                }
            }

            if (name === "correo" || name === "correoContacto") {
                const dominiosPermitidos = ["@gmail.com", "@outlook.com", "@yahoo.es"];
                const incluyeDominio = dominiosPermitidos.some((dom) =>
                    value.toLowerCase().endsWith(dom)
                );
                if (!value.includes("@") || !incluyeDominio) {
                    error = "Correo inválido. Usa @gmail.com, @outlook.com o @yahoo.es";
                }
            }

            if (error) {
                setErrores((prev) => ({ ...prev, [name]: error }));
            } else {
                setErrores((prev) => {
                    const nuevosErrores = { ...prev };
                    delete nuevosErrores[name];
                    return nuevosErrores;
                });
            }
        }
    };

    // Maneja la creación del proveedor y valida campos dependiendo del tipo de documento
    const handleCrear = (e) => {
        e.preventDefault();

        let erroresTemp = {};

        const camposObligatorios = ["nombre", "tipoDocumento", "documento", "celular", "correo", "direccion", "ciudad"];

        if (formData.tipoDocumento === "NIT") {
            camposObligatorios.push("nombreContacto", "apellidoContacto", "telefonoContacto", "correoContacto");
        }

        camposObligatorios.forEach((campo) => {
            if (!formData[campo].trim()) {
                const nombreCampo = obtenerNombreCampo(campo);
                erroresTemp[campo] = `El ${nombreCampo} es obligatorio`;
            }
        });

        if (formData.tipoDocumento === "NIT") {
            if (!/^\d{10}$/.test(formData.telefonoContacto)) {
                erroresTemp.telefonoContacto = "El celular debe tener exactamente 10 números";
            }

            const dominiosPermitidos = ["@gmail.com", "@outlook.com", "@yahoo.es"];
            const incluyeDominio = dominiosPermitidos.some((dom) =>
                formData.correoContacto.toLowerCase().endsWith(dom)
            );
            if (!formData.correoContacto.includes("@") || !incluyeDominio) {
                erroresTemp.correoContacto = "Correo inválido. Usa @gmail.com, @outlook.com o @yahoo.es";
            }
        }

        setErrores(erroresTemp);

        const hayErrores = Object.keys(erroresTemp).length > 0;

        if (!hayErrores) {
            const nuevoProveedor = {
                id: proveedores.length + 1,
                ...formData,
                telefono: formData.celular,
                estado: true,
            };
            setProveedores([...proveedores, nuevoProveedor]);
            closeCrearModal();
        } else {
            alert("Por favor completa todos los campos correctamente.");
        }
    };

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [proveedorEditando, setProveedorEditando] = useState(null);

    const openEditarModal = (proveedor) => {
        setProveedorEditando(proveedor);
        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setProveedorEditando(null);
        setEditarModalOpen(false);
    };

    const handleEditarProveedor = (id) => {
        const proveedor = proveedores.find(u => u.id === id);
        openEditarModal(proveedor);
    };

    const [erroresEditar, setErroresEditar] = useState({});


    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (proveedor) => {
        setProveedorSeleccionado(proveedor);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setProveedorSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleToggleEstado = (id) => {
        setProveedores(proveedores.map(proveedor =>
            proveedor.id === id ? { ...proveedor, estado: !proveedor.estado } : proveedor
        ));
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarProveedor = (proveedor) => {
        MySwal.fire({
            title: `Eliminar al proveedor`,
            html: `
                <p class="texto-blanco">¿Estás seguro de que deseas eliminar a <strong>${proveedor.nombre}</strong>?</p>
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

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const proveedoresFiltrados = proveedores.filter(proveedor =>
        Object.values(proveedor).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoProveedor = paginaActual * proveedorPorPagina;
    const indexPrimerProveedor = indexUltimoProveedor - proveedorPorPagina;
    const proveedoresActuales = proveedoresFiltrados.slice(indexPrimerProveedor, indexUltimoProveedor);
    const totalPaginas = Math.ceil(proveedoresFiltrados.length / proveedorPorPagina);

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
                <h1 className="titulo">Gestión de proveedores</h1>

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
                Crear proveedor
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
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
                            <th>Identificación</th>
                            <th>Celular</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {proveedoresActuales.length > 0 ? (
                            proveedoresActuales.map((proveedor) => (
                                <tr key={proveedor.id}>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.documento}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>{proveedor.direccion}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(proveedor.id)}
                                            className={`estado-btn ${proveedor.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {proveedor.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarProveedor(proveedor.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el proveedor"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => openVerModal(proveedor)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del proveedor"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => handleEliminarProveedor(proveedor)}
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                            title="Eliminar el proveedor"
                                        >
                                            <FiTrash2 size={18} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No se encontraron proveedores</td>
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
                    <div
                        className="ventana-popup max-h-[300vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Crear proveedor</h2>

                            <form onSubmit={handleCrear} className="form-crear-usuario">

                                <div className="fila-formulario">
                                    <div className="campo relative">
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Nombre *"
                                            className="input-texto"
                                        />
                                        {errores.nombre && <p className="error-texto">{errores.nombre}</p>}
                                    </div>

                                    <div className="campo">
                                        <select
                                            name="tipoDocumento"
                                            className="input-select"
                                            value={formData.tipoDocumento}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setTipoDocumento(e.target.value);
                                            }}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Tipo de Documento *</option>
                                            <option value="CC">CC</option>
                                            <option value="CE">CE</option>
                                            <option value="NIT">NIT</option>
                                        </select>
                                        {errores.tipoDocumento && <p className="error-texto">{errores.tipoDocumento}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="documento"
                                            value={formData.documento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Documento *"
                                            className="input-texto"
                                        />
                                        {errores.documento && <p className="error-texto">{errores.documento}</p>}
                                    </div>

                                    <div className="campo">
                                        <input
                                            type="tel"
                                            name="celular"
                                            value={formData.celular}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Celular *"
                                            className="input-texto"
                                        />
                                        {errores.celular && <p className="error-texto">{errores.celular}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            type="email"
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Correo Electrónico *"
                                            className="input-texto"
                                        />
                                        {errores.correo && <p className="error-texto">{errores.correo}</p>}
                                    </div>

                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Dirección *"
                                            className="input-texto"
                                        />
                                        {errores.direccion && <p className="error-texto">{errores.direccion}</p>}
                                    </div>
                                </div>

                                {/* Ciudad en fila sola */}
                                <div className="fila-formulario">
                                    <div className="campo w-full">
                                        <select
                                            name="ciudad"
                                            className="input-select"
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccionar Ciudad *</option>
                                            <option value="medellin">Medellín</option>
                                            <option value="bogota">Bogotá</option>
                                            <option value="cali">Cali</option>
                                        </select>
                                        {errores.ciudad && <p className="error-texto">{errores.ciudad}</p>}
                                    </div>
                                </div>

                                {/* Info adicional si es NIT */}
                                {formData.tipoDocumento === "NIT" && (
                                    <div className="space-y-3">
                                        <h3 className="titulo-proveedor text-lg font-semibold mt-4">Información de Contacto de la Empresa</h3>
                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <input
                                                    type="text"
                                                    name="nombreContacto"
                                                    value={formData.nombreContacto}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Nombre contacto *"
                                                    className="input-texto"
                                                />
                                                {errores.nombreContacto && <p className="error-texto">{errores.nombreContacto}</p>}
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="text"
                                                    name="apellidoContacto"
                                                    value={formData.apellidoContacto}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Apellido contacto *"
                                                    className="input-texto"
                                                />
                                                {errores.apellidoContacto && <p className="error-texto">{errores.apellidoContacto}</p>}
                                            </div>
                                        </div>

                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <input
                                                    type="tel"
                                                    name="telefonoContacto"
                                                    value={formData.telefonoContacto}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Teléfono contacto *"
                                                    className="input-texto"
                                                />
                                                {errores.telefonoContacto && <p className="error-texto">{errores.telefonoContacto}</p>}
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="email"
                                                    name="correoContacto"
                                                    value={formData.correoContacto}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Correo contacto *"
                                                    className="input-texto"
                                                />
                                                {errores.correoContacto && <p className="error-texto">{errores.correoContacto}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear proveedor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditarModalOpen && proveedorEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div
                        className="ventana-popup max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar proveedor</h2>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const campos = {
                                        nombre: proveedorEditando.nombre,
                                        tipoDocumento: proveedorEditando.tipoDocumento,
                                        documento: proveedorEditando.documento,
                                        telefono: proveedorEditando.telefono,
                                        correo: proveedorEditando.correo,
                                        direccion: proveedorEditando.direccion,
                                        ciudad: proveedorEditando.ciudad,
                                        ...(proveedorEditando.tipoDocumento === "NIT" && {
                                            nombreContacto: proveedorEditando.nombreContacto,
                                            apellidoContacto: proveedorEditando.apellidoContacto,
                                            telefonoContacto: proveedorEditando.telefonoContacto,
                                            correoContacto: proveedorEditando.correoContacto,
                                        }),
                                    };

                                    const nuevosErrores = {};
                                    Object.entries(campos).forEach(([campo, valor]) => {
                                        if (!valor || valor.trim() === "") {
                                            nuevosErrores[campo] = "Esteampo obligatorio";
                                        }
                                    });

                                    if (Object.keys(nuevosErrores).length > 0) {
                                        setErroresEditar(nuevosErrores);
                                        return;
                                    }

                                    setProveedores((prev) =>
                                        prev.map((u) =>
                                            u.id === proveedorEditando.id ? proveedorEditando : u
                                        )
                                    );
                                    closeEditarModal();
                                }}
                                className="space-y-3"
                            >
                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Nombre:</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={proveedorEditando.nombre}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, nombre: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    nombre: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            placeholder="Nombre"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.nombre && (
                                            <p className="error-mensaje">{erroresEditar.nombre}</p>
                                        )}
                                    </div>
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Tipo Documento:</label>
                                        <select
                                            name="tipoDocumento"
                                            value={proveedorEditando.tipoDocumento}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, tipoDocumento: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    tipoDocumento: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            className="input-select"
                                        >
                                            <option value="">Tipo de Documento</option>
                                            <option value="CC">CC</option>
                                            <option value="CE">CE</option>
                                            <option value="NIT">NIT</option>
                                        </select>
                                        {erroresEditar?.tipoDocumento && (
                                            <p className="error-mensaje">{erroresEditar.tipoDocumento}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Documento:</label>
                                        <input
                                            type="text"
                                            name="documento"
                                            value={proveedorEditando.documento}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, documento: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    documento: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            placeholder="Documento"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.documento && (
                                            <p className="error-mensaje">{erroresEditar.documento}</p>
                                        )}
                                    </div>
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Celular:</label>
                                        <input
                                            type="tel"
                                            name="celular"
                                            value={proveedorEditando.telefono}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, telefono: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    telefono: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            placeholder="Celular"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.telefono && (
                                            <p className="error-mensaje">{erroresEditar.telefono}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Correo:</label>
                                        <input
                                            type="email"
                                            name="correo"
                                            value={proveedorEditando.correo}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, correo: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    correo: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            placeholder="Correo Electrónico"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.correo && (
                                            <p className="error-mensaje">{erroresEditar.correo}</p>
                                        )}
                                    </div>
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Dirección:</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={proveedorEditando.direccion}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, direccion: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    direccion: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            placeholder="Dirección"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.direccion && (
                                            <p className="error-mensaje">{erroresEditar.direccion}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Ciudad:</label>
                                        <select
                                            name="ciudad"
                                            value={proveedorEditando.ciudad}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProveedorEditando({ ...proveedorEditando, ciudad: value });
                                                setErroresEditar((prev) => ({
                                                    ...prev,
                                                    ciudad: value.trim() === "" ? "Este campo es obligatorio" : "",
                                                }));
                                            }}
                                            className="input-select"
                                        >
                                            <option value="">Seleccionar Ciudad</option>
                                            <option value="medellin">Medellín</option>
                                            <option value="bogota">Bogotá</option>
                                            <option value="cali">Cali</option>
                                        </select>
                                        {erroresEditar?.ciudad && (
                                            <p className="error-mensaje">{erroresEditar.ciudad}</p>
                                        )}
                                    </div>

                                    {(proveedorEditando?.tipoDocumento === "CC" ||
                                        proveedorEditando?.tipoDocumento === "CE") && (
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Estado:</label>
                                                <select
                                                    name="estado"
                                                    value={proveedorEditando.estado ? "activo" : "inactivo"}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setProveedorEditando({
                                                            ...proveedorEditando,
                                                            estado: value === "activo",
                                                        });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            estado:
                                                                value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    className="input-select"
                                                >
                                                    <option value="">Selecciona el estado</option>
                                                    <option value="activo">Activo</option>
                                                    <option value="inactivo">Inactivo</option>
                                                </select>
                                                {erroresEditar.estado && (
                                                    <p className="error-mensaje">{erroresEditar.estado}</p>
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                                {proveedorEditando.tipoDocumento === "NIT" && (
                                    <div className="space-y-3">
                                        <h3 className="titulo-proveedor text-lg font-semibold">
                                            Información de contacto de la empresa
                                        </h3>

                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Nombre contacto:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Nombre contacto"
                                                    value={proveedorEditando.nombreContacto || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setProveedorEditando({
                                                            ...proveedorEditando,
                                                            nombreContacto: value,
                                                        });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            nombreContacto:
                                                                value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    className="input-texto"
                                                />
                                                {erroresEditar?.nombreContacto && (
                                                    <p className="error-mensaje">
                                                        {erroresEditar.nombreContacto}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Apellido contacto:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Apellido contacto"
                                                    value={proveedorEditando.apellidoContacto || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setProveedorEditando({
                                                            ...proveedorEditando,
                                                            apellidoContacto: value,
                                                        });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            apellidoContacto:
                                                                value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    className="input-texto"
                                                />
                                                {erroresEditar?.apellidoContacto && (
                                                    <p className="error-mensaje">
                                                        {erroresEditar.apellidoContacto}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="fila-formulario">
                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Teléfono contacto:</label>
                                                <input
                                                    type="tel"
                                                    placeholder="Teléfono contacto"
                                                    value={proveedorEditando.telefonoContacto || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setProveedorEditando({
                                                            ...proveedorEditando,
                                                            telefonoContacto: value,
                                                        });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            telefonoContacto:
                                                                value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    className="input-texto"
                                                />
                                                {erroresEditar?.telefonoContacto && (
                                                    <p className="error-mensaje">
                                                        {erroresEditar.telefonoContacto}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="campo">
                                                <label className="subtitulo-editar-todos">Correo contacto:</label>
                                                <input
                                                    type="email"
                                                    placeholder="Correo contacto"
                                                    value={proveedorEditando.correoContacto || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setProveedorEditando({
                                                            ...proveedorEditando,
                                                            correoContacto: value,
                                                        });
                                                        setErroresEditar((prev) => ({
                                                            ...prev,
                                                            correoContacto:
                                                                value.trim() === "" ? "Este campo es obligatorio" : "",
                                                        }));
                                                    }}
                                                    className="input-texto"
                                                />
                                                {erroresEditar?.correoContacto && (
                                                    <p className="error-mensaje">
                                                        {erroresEditar.correoContacto}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Estado para NIT al final */}
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Estado:</label>
                                            <select
                                                name="estado"
                                                value={proveedorEditando.estado ? "activo" : "inactivo"}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setProveedorEditando({
                                                        ...proveedorEditando,
                                                        estado: value === "activo",
                                                    });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        estado:
                                                            value.trim() === "" ? "Este campo es obligatorio" : "",
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Selecciona el estado</option>
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                            {erroresEditar.estado && (
                                                <p className="error-mensaje">{erroresEditar.estado}</p>
                                            )}
                                        </div>
                                    </div>
                                )}


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

            {isVerModalOpen && proveedorSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del proveedor</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del proveedor:</strong> {proveedorSeleccionado.nombre}</p>
                                        <p><strong>Tipo de Documento:</strong> {proveedorSeleccionado.tipoDocumento}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Número de identificación:</strong> {proveedorSeleccionado.documento}</p>
                                        <p><strong>Correo:</strong> {proveedorSeleccionado.correo}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Teléfono:</strong> {proveedorSeleccionado.telefono}</p>
                                        <p><strong>Dirección:</strong> {proveedorSeleccionado.direccion}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Ciudad:</strong> {proveedorSeleccionado.ciudad}</p>
                                        <p><strong>Estado:</strong> {proveedorSeleccionado.estado ? "Activo" : "Inactivo"}</p>
                                    </div>
                                </div>

                                {proveedorSeleccionado.tipoDocumento === "NIT" && (
                                    <div className="mt-4 space-y-2">
                                        <h3 className="titulo-proveedor text-lg font-semibold">Datos del contacto de la empresa</h3>
                                        <div className="fila-formulario">
                                            <p><strong>Nombre:</strong> {proveedorSeleccionado.nombreContacto || 'No registrado'}</p>
                                            <p><strong>Apellido:</strong> {proveedorSeleccionado.apellidoContacto || 'No registrado'}</p>
                                        </div>
                                        <div className="fila-formulario">
                                            <p><strong>Teléfono:</strong> {proveedorSeleccionado.telefonoContacto || 'No registrado'}</p>
                                            <p><strong>Correo:</strong> {proveedorSeleccionado.correoContacto || 'No registrado'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
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

        </div >
    );
};

export default GestionProveedoresRec;   