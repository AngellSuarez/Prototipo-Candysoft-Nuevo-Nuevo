import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

import { listar_usuarios, cambiar_estado_usuario, eliminar_usuario, crear_usuario, editar_usuario } from "../../../services/usuarios_service"
import { listar_roles } from "../../../services/roles_service";

const GestionUsuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuarioPorPagina = 5;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        correo: '',
        rol_id: '',
        passwordConfirm: ''

    });

    const handle_crear_usuario = async (e) => {
        e.preventDefault();

        // Validación básica (puedes extenderla)
        if (!formData.username || !formData.password || !formData.nombre || !formData.apellido || !formData.correo || !formData.rol_id) {
            MySwal.fire({
                title: 'Error',
                text: 'Por favor, completa todos los campos obligatorios.',
                icon: 'warning',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
            return;
        }

        try {
            const respuestaApi = await crear_usuario(
                formData.username,
                formData.password,
                formData.nombre,
                formData.apellido,
                formData.correo,
                formData.rol_id
            );
            console.log(respuestaApi)

            if (respuestaApi && respuestaApi.message) {
                MySwal.fire({
                    title: 'Usuario Creado',
                    text: respuestaApi.message,
                    icon: 'success',
                    confirmButtonColor: '#7e2952',
                    customClass: { popup: 'swal-rosado' }
                }).then(() => {
                    window.location.reload();
                });
            } else {
                MySwal.fire({
                    title: 'Éxito',
                    text: 'El usuario ha sido creado exitosamente.',
                    icon: 'success',
                    confirmButtonColor: '#7e2952',
                    customClass: { popup: 'swal-rosado' }
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error("Error al crear el usuario: ", error);
            MySwal.fire({
                title: 'Error',
                text: error.message || 'No se pudo crear el usuario.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const [errores, setErrores] = useState({});

    const validarCampo = (name, value) => {
        let error = "";

        if (!value.trim()) {
            switch (name) {
                case 'username':
                    error = 'el nombre de usuario es obligatorio';
                    break;
                case 'password':
                    error = "la contraseña es necesaria";
                    break;
                case "nombre":
                    error = "El nombre es obligatorio";
                    break;
                case "apellido":
                    error = "El apellido es obligatorio";
                    break;
                case "correo":
                    error = "El correo electrónico es obligatorio";
                    break;
                case "rol_id": // Asegúrate de usar el name correcto de tu select de rol
                    error = "El rol es obligatorio";
                    break;
                case "passwordConfirm":
                    error = "La confirmación de la contraseña es obligatoria";
                    break;
                default:
                    error = "Campo obligatorio";
            }
        } else {
            if (name === "correo") {
                if (!value.includes("@") || !/\S+@\S+\.\S+/.test(value)) {
                    error = "Correo electrónico inválido.";
                }
            } else if (name === "password") {
                if (value.length < 6) {
                    error = "La contraseña debe tener al menos 6 caracteres.";
                } else if (!/\d/.test(value)) {
                    error = "La contraseña debe contener al menos un número.";
                } else if (!/[^a-zA-Z0-9\s]/.test(value)) {
                    error = "La contraseña debe contener al menos un carácter especial.";
                }
            } else if (name === "passwordConfirm" && formData.password !== value) {
                error = "Las contraseñas no coinciden.";
            }
        }

        setErrores({ ...errores, [name]: error });
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarUsuario = async (usuario) => {
        const resultado = await MySwal.fire({
            title: `Eliminar al usuario`,
            html: `
                <p class="texto-blanco">¿Estás seguro de que deseas eliminar a <strong>${usuario.nombre} ${usuario.apellido}</strong>?</p>
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
        });

        if (resultado.isConfirmed) {
            try {
                const respuestaApi = await eliminar_usuario(usuario.id);
                let swalConfig = {};

                // Ajustar la lógica de los mensajes basados en la respuesta de la API
                if (respuestaApi && respuestaApi.message === 'Usuario desactivado correctamente') {
                    swalConfig = {
                        title: 'Usuario Desactivado',
                        text: 'El usuario ha sido desactivado exitosamente.',
                        icon: 'success',
                        confirmButtonColor: '#7e2952',
                    };
                } else if (respuestaApi && respuestaApi.message === 'Usuario y sus asociados eliminados permanentemente') {
                    swalConfig = {
                        title: 'Usuario Eliminado',
                        text: 'El usuario y sus datos asociados han sido eliminados permanentemente.',
                        icon: 'success',
                        confirmButtonColor: '#7e2952',
                    };
                } else if (respuestaApi && respuestaApi.message) {
                    swalConfig = {
                        title: 'Éxito',
                        text: respuestaApi.message,
                        icon: 'success',
                        confirmButtonColor: '#7e2952',
                    };
                } else if (!respuestaApi?.ok) {
                    swalConfig = {
                        title: 'Usuario Eliminado',
                        text: 'El usuario y sus datos asociados han sido eliminados permanentemente.',
                        icon: 'success',
                        confirmButtonColor: '#7e2952',
                    };
                } else {
                    swalConfig = {
                        title: 'Éxito',
                        text: 'Operación realizada con éxito.',
                        icon: 'success',
                        confirmButtonColor: '#7e2952',
                    };
                }

                MySwal.fire(swalConfig).then(() => {
                    window.location.reload();
                });

            } catch (error) {
                MySwal.fire({
                    title: 'Error',
                    text: `Ocurrió un error al eliminar el usuario: ${error.message}`,
                    icon: 'error',
                    confirmButtonColor: '#7e2952',
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });


        if (errores[name]) {
            validarCampo(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: 'Acción no permitida',
            text: 'No puedes copiar y pegar en este campo.',
            icon: 'warning',
            confirmButtonColor: '#7e2952',
            customClass: { popup: 'swal-rosado' }
        });
    };

    const inputClass = (name) =>
        errores[name] ? "input-texto input-error" : "input-texto";

    const selectClass = (name) =>
        errores[name] ? "input-select input-error" : "input-select";

    const renderPlaceholder = (label, name) => {
        return `${label} *`;
    };


    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const openEditarModal = (usuario) => {
        setUsuarioEditando(usuario);
        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setUsuarioEditando(null);
        setEditarModalOpen(false);
    };

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const handleEditarUsuario = (id) => {
        const usuario = usuarios.find(u => u.id === id);
        openEditarModal(usuario);
    };
    const [erroresEditar, setErroresEditar] = useState({});

    const handleEditarCambio = (e) => {
        const { name, value } = e.target;

        setUsuarioEditando((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (erroresEditar[name]) {
            validarCampo(name, value);
        }
    };




    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setUsuarioSeleccionado(null);
        setVerModalOpen(false);
    };


    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const usuariosFiltrados = usuarios.filter(usuario =>
        Object.values(usuario).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoUsuario = paginaActual * usuarioPorPagina;
    const indexPrimerUsuario = indexUltimoUsuario - usuarioPorPagina;
    const usuariosActuales = usuariosFiltrados.slice(indexPrimerUsuario, indexUltimoUsuario);
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuarioPorPagina);

    const { darkMode } = useTheme();

    const [isNotificacionesModalOpen, setIsNotificacionesModalOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([
        { id: 1, mensaje: "Nueva novedad creada por Paula. Cambio en el horario de ingreso" },
        { id: 2, mensaje: "Se ha agendado una cita para el 03/05/2025." }
    ]);

    useEffect(() => {
        const obtener_usuarios = async () => {
            try {
                const data = await listar_usuarios();
                setUsuarios(data);
                console.log(data);
            } catch (error) {
                console.error("Error al llamar los usuarios: ", error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudieron cargar los usuarios',
                    icon: 'error',
                    confirmButtonColor: '#7e2952',
                    customClass: { popup: 'swal-rosado' }
                });
            }
        };

        obtener_usuarios();
    }, []);

    useEffect(() => {
        const obtener_roles = async () => {
            try {
                const data = await listar_roles();
                setRoles(data);
                console.log(data);
            } catch (error) {
                console.error("Error al llamar los módulos: ", error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudieron cargar los módulos.',
                    icon: 'error',
                    confirmButtonColor: '#7e2952',
                    customClass: { popup: 'swal-rosado' }
                });
            }
        };

        obtener_roles();
    }, []);

    const handleToggleEstado = async (id) => {
        try {
            await cambiar_estado_usuario(id);
            setUsuarios(prevUsuarios =>
                prevUsuarios.map(usuario =>
                    usuario.id === id ? { ...usuario, estado: usuario.estado === 'activo' ? 'inactivo' : 'activo' } : usuario
                )
            );
            Swal.fire({
                title: 'Exito',
                text: 'Estado del usuario actualizado con exito',
                icon: 'success',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        } catch (error) {
            console.error("Error al cambiar el estado del usuario: ", error)
            Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudo cambiar el estado del usuario',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const openNotificacionesModal = () => setIsNotificacionesModalOpen(true);
    const closeNotificacionesModal = () => setIsNotificacionesModalOpen(false);

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="fila-formulario">
                <h1 className="titulo">Gestión de usuarios</h1>

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
                Crear usuario
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
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
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuariosActuales.length > 0 ? (
                            usuariosActuales.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.rol_id_out}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(usuario.id)}
                                            className={`estado-btn ${usuario.estado === "activo" ? 'estado-activo' : 'estado-inactivo'}`}
                                        >
                                            {usuario.estado === "activo" ? "activo" : "inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarUsuario(usuario.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el usuario"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => openVerModal(usuario)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del usuario"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>


                                        <button
                                            onClick={() => handleEliminarUsuario(usuario)}
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                            title="Eliminar el usuario"
                                        >
                                            <FiTrash2 size={18} className="text-red-500 hover:text-red-700" />
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No se encontraron usuarios</td>
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
                            <h2 className="text-xl font-semibold mb-4">Crear usuario</h2>
                            <form onSubmit={handle_crear_usuario} className="form-crear-usuario">

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
                                            type="text"
                                            name="username"
                                            placeholder={renderPlaceholder("Nombre usuario", "username")}
                                            className={inputClass("username")}
                                            value={formData.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.username && <p className="error-texto">{errores.username}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder={renderPlaceholder("Contraseña", "password")}
                                            className={inputClass("password")}
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onPaste={handlePaste}
                                        />
                                        {errores.password && <p className="error-texto">{errores.password}</p>}
                                    </div>

                                    <div className="campo">
                                        <input
                                            type="password"
                                            name="passwordConfirm"
                                            placeholder={renderPlaceholder("Confirmar contraseña", "passwordConfirm")}
                                            className={inputClass("passwordConfirm")}
                                            value={formData.passwordConfirm}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onPaste={handlePaste}
                                        />
                                        {errores.passwordConfirm && <p className="error-texto">{errores.passwordConfirm}</p>}
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <select
                                            name="rol_id"
                                            className={selectClass("rol")}
                                            value={formData.rol_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccionar Rol *</option>
                                            {roles.map((rol) => (
                                                <option key={rol.id} value={rol.id}>
                                                    {rol.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errores.rol && <p className="error-texto">{errores.rol}</p>}
                                    </div>
                                </div>


                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditarModalOpen && usuarioEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    let isValid = true;
                                    let errors = {};
                                    console.log(usuarioEditando)

                                    console.log("Valor de usuarioEditando justo antes del forEach:", usuarioEditando);
                                    Object.keys(usuarioEditando).forEach((key) => {
                                        if (
                                            key !== "estado" &&
                                            key !== "password" &&
                                            key !== "passwordConfirm" &&
                                            (typeof usuarioEditando[key] === "string" ? usuarioEditando[key].trim() === "" : false)
                                        ) {
                                            errors[key] = "Este campo es obligatorio";
                                            isValid = false;
                                        }
                                    });
                                    if (!isValid) {
                                        setErroresEditar(errors);
                                        return;
                                    }

                                    try {
                                        
                                        await editar_usuario(
                                            usuarioEditando.id,
                                            usuarioEditando.username,
                                            usuarioEditando.password,
                                            usuarioEditando.nombre,
                                            usuarioEditando.apellido,
                                            usuarioEditando.correo,
                                            usuarioEditando.rol_id
                                        );

                                        setUsuarios((prev) =>
                                            prev.map((u) => (u.id === usuarioEditando.id ? usuarioEditando : u))
                                        );

                                        closeEditarModal();
                                    } catch (error) {
                                        console.error("Error al editar el usuario:", error);
                                        alert("Hubo un error al editar el usuario. Revisa la consola.");
                                    }
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
                                                value={usuarioEditando.nombre}
                                                onChange={handleEditarCambio}
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
                                                value={usuarioEditando.apellido}
                                                onChange={handleEditarCambio}
                                                placeholder="Apellido"
                                                className="input-texto"
                                            />
                                            {erroresEditar.apellido && <p className="error-mensaje">{erroresEditar.apellido}</p>}
                                        </div>
                                    </div>

                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Correo:</label>
                                            <input
                                                type="email"
                                                name="correo"
                                                value={usuarioEditando.correo}
                                                onChange={handleEditarCambio}
                                                placeholder="Correo Electrónico"
                                                className="input-texto"
                                            />
                                            {erroresEditar.correo && <p className="error-mensaje">{erroresEditar.correo}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre usuario:</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={usuarioEditando.username}
                                                onChange={handleEditarCambio}
                                                placeholder="Username"
                                                className="input-texto"
                                            />
                                            {erroresEditar.usename && <p className="error-mensaje">{erroresEditar.username}</p>}
                                        </div>
                                    </div>


                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Rol:</label>
                                            <div className="campo">
                                                <select
                                                    name="rol_id"
                                                    className={selectClass("rol")}
                                                    value={usuarioEditando.rol_id}
                                                    onChange={handleEditarCambio}
                                                    onBlur={handleBlur}
                                                >
                                                    <option value="">Seleccionar Rol *</option>
                                                    {roles.map((rol) => (
                                                        <option key={rol.id} value={rol.id}>
                                                            {rol.nombre}
                                                        </option>
                                                    ))}

                                                </select>
                                                {errores.rol && <p className="error-texto">{errores.rol}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Contraseña:</label>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Nueva Contraseña (opcional)"
                                                className="input-texto"
                                                value={usuarioEditando.password || ""}
                                                onChange={handleEditarCambio}
                                                onPaste={handlePaste}
                                            />
                                            {erroresEditar.password && <p className="error-mensaje">{erroresEditar.password}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Confirmar Contraseña:</label>
                                            <input
                                                type="password"
                                                name="passwordConfirm"
                                                placeholder="Confirmar Nueva Contraseña"
                                                className="input-texto"
                                                value={usuarioEditando.passwordConfirm || ""}
                                                onChange={handleEditarCambio}
                                                onPaste={handlePaste}
                                            />
                                            {erroresEditar.passwordConfirm && <p className="error-mensaje">{erroresEditar.passwordConfirm}</p>}
                                        </div>
                                    </div>

                                    <div className="fila-formulario">

                                    </div>
                                    <div className="button-container">
                                        <button type="button" className="btn-cancelar" onClick={closeEditarModal}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-crear">
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {isVerModalOpen && usuarioSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del usuario</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del Usuario:</strong> {usuarioSeleccionado.username} </p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Nombre y apellido:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Correo electronico:</strong> {usuarioSeleccionado.correo}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Rol:</strong> {usuarioSeleccionado.rol_id_out}</p>
                                        <p><strong>Estado:</strong> {usuarioSeleccionado.estado}</p>
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
        </div >
    );
};

export default GestionUsuarios;