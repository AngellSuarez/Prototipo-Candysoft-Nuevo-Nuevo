import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlineEye } from "react-icons/ai";
import "../../../css/gestionar.css";
import "../../../css/rolesform.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

import {
    listar_roles,
    listar_permisos,
    crear_rol,
    actualizar_rol_con_permisos,
    borrar_rol,
    cambiar_estado_rol,
    detalles_con_permisos,
    obtener_permisos_por_rol,
    asignar_permisos_rol
} from '../../../services/roles_service';

const GestionRoles = () => {

    const [roles, setRoles] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const rolesPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
    const [errores, setErrores] = useState({});

    const [modulosSeleccionados, setModulosSeleccionados] = useState([]);
    const [modulosDisponibles, setModulos] = useState([]);

    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [rolEditando, setRolEditando] = useState(null);
    const [erroresEditar, setErroresEditar] = useState({});

    const [isVerModalOpen, setVerModalOpen] = useState(false);

    const { darkMode } = useTheme();
    const MySwal = withReactContent(Swal);

    const [isNotificacionesModalOpen, setIsNotificacionesModalOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([
        { id: 1, mensaje: "Nueva novedad creada por Paula. Cambio en el horario de ingreso" },
        { id: 2, mensaje: "Se ha agendado una cita para el 03/05/2025." }
    ]);

    useEffect(() => {
        const obtener_roles = async () => {
            try {
                const data = await listar_roles();
                setRoles(data);
                console.log(data);
            } catch (error) {
                console.error("Error al llamar los roles: ", error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudieron cargar los roles.',
                    icon: 'error',
                    confirmButtonColor: '#7e2952',
                    customClass: { popup: 'swal-rosado' }
                });
            }
        };

        obtener_roles();
    }, []);

    useEffect(() => {
        const obtener_modulos = async () => {
            try {
                const data = await listar_permisos();
                setModulos(data);
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

        obtener_modulos();
    }, []);

    const validarCampo = (name, value) => {
        let error = "";
        if (!value.trim()) {
            error = name === "nombre" ? "El nombre del rol es obligatorio" : "La descripción del rol es obligatoria";
        }
        setErrores((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errores[name]) validarCampo(name, value);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const handleModuloChange = (modulo) => {
        setModulosSeleccionados((prev) =>
            prev.includes(modulo)
                ? prev.filter((m) => m !== modulo)
                : [...prev, modulo]
        );
    };

    const handleCrear = async (e) => {
        e.preventDefault();

        let nuevosErrores = {};
        if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre del rol es obligatorio";
        if (!formData.descripcion.trim()) nuevosErrores.descripcion = "La descripción del rol es obligatoria";
        if (modulosSeleccionados.length === 0) nuevosErrores.modulos = "Debe seleccionar al menos un módulo";

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            Swal.fire({
                title: 'Advertencia',
                text: 'Por favor completa todos los campos correctamente.',
                icon: 'warning',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
            return;
        }

        try {
            const nuevoRol = await crear_rol(formData.nombre, formData.descripcion);
            await asignar_permisos_rol(nuevoRol.id, modulosSeleccionados.map(m => m.id));
            Swal.fire({
                title: 'Éxito',
                text: 'Rol y permisos creados correctamente.',
                icon: 'success',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
            closeCrearModal();
            const dataActualizada = await listar_roles();
            setRoles(dataActualizada);
        } catch (error) {
            console.error("Error al crear el rol o asignando permisos: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Ocurrió un error al guardar la información.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const handleEditarChange = (e) => {
        const { name, value } = e.target;
        setRolEditando({ ...rolEditando, [name]: value });
        if (erroresEditar[name]) validarCampoEditar(name, value);
    };

    const handleEditarBlur = (e) => {
        const { name, value } = e.target;
        validarCampoEditar(name, value);
    };

    const validarCampoEditar = (name, value) => {
        let error = "";
        if (!value.trim()) {
            error = name === "nombre" ? "El nombre del rol es obligatorio" : "La descripción del rol es obligatoria";
        }
        setErroresEditar((prev) => ({ ...prev, [name]: error }));
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();

        const nuevosErrores = {};
        if (!rolEditando.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
        if (!rolEditando.descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
        if (modulosSeleccionados.length === 0) nuevosErrores.modulos = "Debe seleccionar al menos un módulo";

        setErroresEditar(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            Swal.fire({
                title: 'Advertencia',
                text: 'Por favor completa todos los campos correctamente.',
                icon: 'warning',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
            return;
        }

        try {
            await actualizar_rol_con_permisos(
                rolEditando.id,
                {
                    nombre: rolEditando.nombre,
                    descripcion: rolEditando.descripcion,
                    estado: rolEditando.estado
                },
                modulosSeleccionados.map(m => m.id)
            );
            Swal.fire({
                title: 'Éxito',
                text: 'Rol actualizado correctamente.',
                icon: 'success',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
            closeEditarModal();
            const dataActualizada = await listar_roles();
            setRoles(dataActualizada);
        } catch (error) {
            console.error("Error al actualizar el rol: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar la información.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const openEditarModal = async (rol) => {
        setRolEditando(rol);
        setEditarModalOpen(true);
        try {
            const permisosRol = await obtener_permisos_por_rol(rol.id);
            setModulosSeleccionados(permisosRol.map(p => modulosDisponibles.find(m => m.id === p.permiso_id)).filter(Boolean));
        } catch (error) {
            console.error("Error al cargar los permisos del rol: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al cargar los permisos para editar.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const closeEditarModal = () => {
        setRolEditando(null);
        setEditarModalOpen(false);
        setErroresEditar({}); // Limpiar errores al cerrar
        setModulosSeleccionados([]); // Resetear módulos seleccionados al cerrar
    };

    const handleEditarRol = (id) => {
        const rol = roles.find(u => u.id === id);
        openEditarModal(rol);
    };

    const openVerModal = async (rol) => {
        try {
            const detalles = await detalles_con_permisos(rol.id);
            console.log(detalles);
            setRolSeleccionado(detalles);
            setVerModalOpen(true);
        } catch (error) {
            console.error("Error al obtener los detalles del rol: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al cargar los detalles del rol.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const closeVerModal = () => {
        setRolSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleToggleEstado = async (id) => {
        try {
            await cambiar_estado_rol(id);
            setRoles(prevRoles =>
                prevRoles.map(rol =>
                    rol.id === id ? { ...rol, estado: rol.estado === 'activo' ? 'inactivo' : 'activo' } : rol
                )
            );
            Swal.fire({
                title: 'Éxito',
                text: 'Estado del rol actualizado correctamente.',
                icon: 'success',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        } catch (error) {
            console.error("Error al cambiar el estado del rol: ", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudo cambiar el estado del rol.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                customClass: { popup: 'swal-rosado' }
            });
        }
    };

    const handleEliminarRol = (rol) => {
        if (rol.nombre.toLowerCase() === 'administrador') {
            MySwal.fire({
                title: 'Acción no permitida',
                text: 'El rol de Administrador no puede ser eliminado.',
                icon: 'error',
                confirmButtonColor: '#7e2952',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-rosado'
                }
            });
            return;
        }

        MySwal.fire({
            title: `¿Eliminar el rol ${rol.nombre}?`,
            text: 'Esta acción no se puede deshacer.',
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await borrar_rol(rol.id);
                    MySwal.fire({
                        title: "Eliminado",
                        text: `El rol ${rol.nombre} ha sido eliminado.`,
                        icon: "success",
                        confirmButtonColor: '#7e2952',
                        customClass: { popup: 'swal-rosado' }

                    });
                    const dataActualizada = await listar_roles();
                    setRoles(dataActualizada);
                } catch (error) {
                    MySwal.fire({
                        title: 'Error',
                        text: error.message || 'No se pudo eliminar el rol.',
                        icon: 'error',
                        confirmButtonColor: '#7e2952',
                        customClass: { popup: 'swal-rosado' }
                    });
                }
            }
        });
    };

    const handleBuscar = (e) => {
        setBusqueda(e.target.value.toLowerCase());
        setPaginaActual(1);
    };

    const rolesFiltrados = roles.filter(rol => {
        const nombreMatch = rol.nombre.toLowerCase().includes(busqueda);
        const estadoMatch = (rol.estado ? 'activo' : 'inactivo').includes(busqueda);
        return nombreMatch || estadoMatch;
    });


    const indexUltimoRol = paginaActual * rolesPorPagina;
    const indexPrimerRol = indexUltimoRol - rolesPorPagina;
    const rolesActuales = rolesFiltrados.slice(indexPrimerRol, indexUltimoRol);
    const totalPaginas = Math.ceil(rolesFiltrados.length / rolesPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const openNotificacionesModal = () => setIsNotificacionesModalOpen(true);
    const closeNotificacionesModal = () => setIsNotificacionesModalOpen(false);

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="fila-formulario">
                <h1 className="titulo">Gestión de roles</h1>

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
                Crear rol
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar rol..."
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
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rolesActuales.length > 0 ? (
                            rolesActuales.map((rol) => (
                                <tr key={rol.id}>
                                    <td>{rol.nombre}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(rol.id)}
                                            className={`estado-btn ${rol.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}
                                        >
                                            {rol.estado === 'activo' ? "activo" : "inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarRol(rol.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el rol"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => openVerModal(rol)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del rol"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => handleEliminarRol(rol)}
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                            title="Eliminar el rol"
                                        >
                                            <FiTrash2 size={18} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No se encontraron roles</td>
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
                    <div className="ventana-popup " onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Crear rol</h2>
                            <form onSubmit={handleCrear} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo relative">
                                            <input
                                                type="text"
                                                className="input-nombre"
                                                name="nombre"
                                                placeholder="Nombre del Rol *"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errores.nombre && <p className="error-texto absolute left-0 top-1/2 -translate-y-1/2 text-left text-red-600">{errores.nombre}</p>}
                                        </div>
                                        <div className="campo relative">
                                            <input
                                                type="text"
                                                className="input-nombre"
                                                name="descripcion"
                                                placeholder="Descripción del Rol *"
                                                value={formData.descripcion}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errores.descripcion && <p className="error-texto absolute left-0 top-1/2 -translate-y-1/2 text-left text-red-600">{errores.descripcion}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid-roles">
                                    {[0, 1, 2].map((columna) => (
                                        <div key={columna} className="grid-column">
                                            {modulosDisponibles
                                                .slice(columna * 4, columna === 2 ? 14 : (columna + 1) * 4)
                                                .map((modulo) => (
                                                    <label
                                                        key={modulo.id}
                                                        className="border checkbox-label rounded-lg p-4 shadow-md flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span className="permiso-info">{modulo.modulo}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={modulosSeleccionados.includes(modulo)}
                                                            onChange={() => handleModuloChange(modulo)}
                                                            className="checkbox-input"
                                                        />
                                                    </label>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                                {errores.modulos && <p className="error-texto text-red-600">{errores.modulos}</p>}
                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear rol
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditarModalOpen && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar rol</h2>
                            <form
                                onSubmit={handleGuardarCambios}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre:</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={rolEditando?.nombre || ""}
                                                onChange={handleEditarChange}
                                                onBlur={handleEditarBlur}
                                                className="input-texto"
                                                placeholder="Nombre"
                                            />
                                            {erroresEditar.nombre && (
                                                <div style={{ textAlign: 'left' }}>
                                                    <p className="error-mensaje-rol">{erroresEditar.nombre}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Descripción:</label>
                                            <input
                                                type="text"
                                                name="descripcion"
                                                value={rolEditando?.descripcion || ""}
                                                onChange={handleEditarChange}
                                                onBlur={handleEditarBlur}
                                                className="input-texto"
                                                placeholder="Descripción"
                                            />
                                            {erroresEditar.descripcion && (
                                                <div style={{ textAlign: 'left' }}>
                                                    <p className="error-mensaje-rol">{erroresEditar.descripcion}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid-roles">
                                    {[0, 1, 2].map((columna) => (
                                        <div key={columna} className="grid-column">
                                            {modulosDisponibles.slice(columna * 4, columna === 2 ? 14 : (columna + 1) * 4).map((modulo) => (
                                                <label
                                                    key={modulo.id}
                                                    className="border checkbox-label rounded-lg p-4 shadow-md flex items-center justify-between cursor-pointer"
                                                >
                                                    <span className="permiso-info">{modulo.modulo}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={modulosSeleccionados.some(m => m.id === modulo.id)}
                                                        onChange={() => handleModuloChange(modulo)}
                                                        className="checkbox-input"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {erroresEditar.modulos && (
                                    <div style={{ textAlign: 'left' }}>
                                        <p className="error-mensaje-rol">{erroresEditar.modulos}</p>
                                    </div>
                                )}

                                <div className="campo">
                                    <label className="subtitulo-editar-todos">Estado:</label>
                                    <select
                                        name="estado"
                                        value={rolEditando?.estado ? "activo" : "inactivo"}
                                        onChange={handleEditarChange}
                                        className="input-select"
                                    >
                                        <option value="">Selecciona el estado</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                    {erroresEditar.estado && <p className="error-mensaje">{erroresEditar.estado}</p>}
                                </div>

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeEditarModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {isVerModalOpen && rolSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del rol</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del rol:</strong> {rolSeleccionado.rol.nombre}</p>
                                        <p><strong>Descripción del rol:</strong> {rolSeleccionado.rol.descripcion}</p>
                                    </div>
                                    <p><strong>Estado:</strong> {rolSeleccionado.rol.estado}</p>
                                </div>
                            </div>
                            <div className="tabla-liq">
                                <table className="liq-table">
                                    <thead>
                                        <tr>
                                            <th>Módulo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rolSeleccionado.modulos && rolSeleccionado.modulos.length > 0 ? (
                                            rolSeleccionado.modulos.map((modulo) => (
                                                <tr key={modulo.id}>
                                                    <td>{modulo.modulo}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="text-center">Este rol no tiene módulos asignados</td>
                                            </tr>
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

export default GestionRoles;