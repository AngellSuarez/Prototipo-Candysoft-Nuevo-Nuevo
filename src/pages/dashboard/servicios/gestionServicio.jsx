import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionServicio = () => {
    const [servicios, setServicios] = useState([
        { id: 1, nombre: "Manicure semipermanente", descripcion: "Hazte las uñas", precio: "55.000", imagen: "https://nailscoruna.com/wp-content/uploads/2023/01/nails-coruna-unas-gel.jpg", estado: true },
        { id: 2, nombre: "Pedicure semipermanente", descripcion: "Organizate las uñas", precio: "50.000", imagen: "https://http2.mlstatic.com/D_NQ_NP_812039-MCO73710008107_122023-O.webp", estado: false },
        { id: 3, nombre: "Uñas acrílicas", descripcion: "Tus uñas perfectas", precio: "70.000", imagen: "https://i.pinimg.com/736x/88/dd/32/88dd322f97c08b935a54536637aac33b.jpg", estado: true },
        { id: 4, nombre: "Uñas en gel", descripcion: "Mejora tus uñas", precio: "85.000", imagen: "https://i.pinimg.com/236x/63/ff/5e/63ff5e6c628eb4b4c47a884af21ee5a2.jpg", estado: true },
        { id: 5, nombre: "Retoque de uñas acrílicas", descripcion: "Hazte las uñas", precio: "35.000", imagen: "https://i.pinimg.com/236x/54/f9/50/54f950a1e39169b3302c6bd92a44e2d7.jpg", estado: true },
    ]);

    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const servicioPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => {
        setCrearModalOpen(false);
        setFormData({ nombre: "", descripcion: "", precio: "", imagen: "" });
        setErrores({});
        setTouched({});
    };

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: ""
    });

    const [errores, setErrores] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        if (!value.trim()) {
            switch (name) {
                case "nombre":
                    return "El nombre es obligatorio";
                case "descripcion":
                    return "La descripción es obligatoria";
                case "precio":
                    return "El precio es obligatorio";
                case "imagen":
                    return "La imagen es obligatoria";
                default:
                    return "Campo obligatorio";
            }
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrores((prev) => ({ ...prev, [name]: error }));
        }


        if (errores[name]) {
            setErrores((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrores((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleImagenChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagen: reader.result }));
                setErrores(prev => ({ ...prev, imagen: "" }));
            };
            reader.readAsDataURL(file);
        } else {
            setErrores(prev => ({ ...prev, imagen: "La imagen es obligatoria" }));
        }
    };

    const handleCrear = (e) => {
        e.preventDefault();
        let erroresTemp = {};

        Object.keys(formData).forEach((campo) => {
            const valor = formData[campo];
            const error = validateField(campo, valor);
            if (error) erroresTemp[campo] = error;
        });

        if (Object.keys(erroresTemp).length === 0) {
            setServicios([
                ...servicios,
                { ...formData, id: servicios.length + 1, estado: true }
            ]);
            closeCrearModal();
        } else {
            setErrores(erroresTemp);
            alert("Por favor completa todos los campos correctamente.");
        }
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarServicio = (servicio) => {
        MySwal.fire({
            title: `Eliminar el servicio`,
            html: `
                        <p class="texto-blanco">¿Estás seguro de que deseas eliminar el <strong>${servicio.nombre}</strong>?</p>
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

    const inputClass = (name) =>
        errores[name] ? "input-texto input-error" : "input-texto";

    const renderPlaceholder = (label) => `${label} *`;

    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [servicioEditando, setServicioEditando] = useState(null);

    const openEditarModal = (servicio) => {
        setServicioEditando(servicio);
        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setServicioEditando(null);
        setEditarModalOpen(false);
    };

    const handleEditarServicio = (id) => {
        const servicio = servicios.find(u => u.id === id);
        openEditarModal(servicio);
    };

    const [erroresEditar, setErroresEditar] = useState({});

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (servicio) => {
        setServicioSeleccionado(servicio);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setServicioSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleToggleEstado = (id) => {
        setServicios(servicios.map(servicio =>
            servicio.id === id ? { ...servicio, estado: !servicio.estado } : servicio
        ));
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const serviciosFiltrados = servicios.filter(servicio =>
        Object.values(servicio).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoServicio = paginaActual * servicioPorPagina;
    const indexPrimerServicio = indexUltimoServicio - servicioPorPagina;
    const serviciosActuales = serviciosFiltrados.slice(indexPrimerServicio, indexUltimoServicio);
    const totalPaginas = Math.ceil(serviciosFiltrados.length / servicioPorPagina);

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
                <h1 className="titulo">Gestión de servicios</h1>

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
                Crear servicio
            </button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar servicio..."
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
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviciosActuales.length > 0 ? (
                            serviciosActuales.map((servicio) => (
                                <tr key={servicio.id}>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.precio}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(servicio.id)}
                                            className={`estado-btn ${servicio.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {servicio.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarServicio(servicio.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el servicio"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => openVerModal(servicio)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del servicio"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminarServicio(servicio)}
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                            title="Eliminar el servicio"
                                        >
                                            <FiTrash2 size={16} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron servicios</td>
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
                            <h2 className="text-xl font-semibold mb-4">Crear Servicio</h2>
                            <form onSubmit={handleCrear} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo relative">
                                            <input
                                                type="text"
                                                name="nombre"
                                                placeholder={renderPlaceholder("Nombre", "nombre")}
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={inputClass("nombre")}
                                            />
                                            {errores.nombre && <p className="error-texto">{errores.nombre}</p>}
                                        </div>

                                        <div className="campo relative">
                                            <input
                                                type="text"
                                                name="precio"
                                                placeholder={renderPlaceholder("Precio", "precio")}
                                                value={formData.precio}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={inputClass("precio")}
                                            />
                                            {errores.precio && <p className="error-texto">{errores.precio}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="fila-formulario">

                                    <div className="campo relative">
                                        <input
                                            type="text"
                                            name="descripcion"
                                            placeholder={renderPlaceholder("Descripción", "descripcion")}
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClass("descripcion")}
                                        />
                                        {errores.descripcion && (
                                            <p className="error-texto">{errores.descripcion}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="fila-imagen">
                                    <label htmlFor="imagenInput" className="custom-file-upload">
                                        <input
                                            id="imagenInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImagenChange}
                                            onBlur={handleBlur}
                                            className="hidden"
                                        />
                                        📷 Subir Imagen
                                    </label>

                                    {errores.imagen && <p className="error-texto-imagen">{errores.imagen}</p>}

                                    {formData.imagen && (
                                        <img
                                            src={formData.imagen}
                                            alt="Vista previa"
                                            className="imagen-previa"
                                        />
                                    )}
                                </div>


                                <div className="button-container">
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={closeCrearModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear Servicio
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isEditarModalOpen && servicioEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar servicio</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let isValid = true;
                                    let errors = {};

                                    if (servicioEditando.nombre.trim() === '') {
                                        errors.nombre = 'Este campo es obligatorio';
                                        isValid = false;
                                    }
                                    if (servicioEditando.precio.trim() === '') {
                                        errors.precio = 'Este campo es obligatorio';
                                        isValid = false;
                                    }
                                    if (servicioEditando.descripcion.trim() === '') {
                                        errors.descripcion = 'Este campo es obligatorio';
                                        isValid = false;
                                    }

                                    if (isValid) {
                                        setServicios(prev =>
                                            prev.map(s => s.id === servicioEditando.id ? servicioEditando : s)
                                        );
                                        closeEditarModal();
                                    } else {
                                        setErroresEditar(errors);
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
                                                value={servicioEditando.nombre}
                                                onChange={(e) => {
                                                    setServicioEditando({ ...servicioEditando, nombre: e.target.value });
                                                    if (e.target.value.trim() === '') {
                                                        setErroresEditar((prev) => ({ ...prev, nombre: 'Este campo es obligatorio' }));
                                                    } else {
                                                        setErroresEditar((prev) => ({ ...prev, nombre: null }));
                                                    }
                                                }}
                                                placeholder="Nombre"
                                                className="input-texto"
                                            />
                                            {erroresEditar?.nombre && <p className="error-mensaje">{erroresEditar.nombre}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Precio:</label>
                                            <input
                                                type="text"
                                                name="precio"
                                                value={servicioEditando.precio}
                                                onChange={(e) => {
                                                    setServicioEditando({ ...servicioEditando, precio: e.target.value });
                                                    if (e.target.value.trim() === '') {
                                                        setErroresEditar((prev) => ({ ...prev, precio: 'Este campo es obligatorio' }));
                                                    } else {
                                                        setErroresEditar((prev) => ({ ...prev, precio: null }));
                                                    }
                                                }}
                                                placeholder="Precio"
                                                className="input-texto"
                                            />
                                            {erroresEditar?.precio && <p className="error-mensaje">{erroresEditar.precio}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Descripción:</label>
                                        <input
                                            type="text"
                                            name="descripcion"
                                            value={servicioEditando.descripcion}
                                            onChange={(e) => {
                                                setServicioEditando({ ...servicioEditando, descripcion: e.target.value });
                                                if (e.target.value.trim() === '') {
                                                    setErroresEditar((prev) => ({ ...prev, descripcion: 'Este campo es obligatorio' }));
                                                } else {
                                                    setErroresEditar((prev) => ({ ...prev, descripcion: null }));
                                                }
                                            }}
                                            placeholder="Descripción"
                                            className="input-texto"
                                        />
                                        {erroresEditar?.descripcion && <p className="error-mensaje">{erroresEditar.descripcion}</p>}
                                    </div>

                                    <div className="campo">
                                        <label className="subtitulo-editar-todos">Estado:</label>
                                        <select
                                            name="estado"
                                            value={servicioEditando.estado ? "activo" : "inactivo"}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setServicioEditando({ ...servicioEditando, estado: value === "activo" });
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

                                <div className="fila-imagen">
                                    <label className="custom-file-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setServicioEditando({ ...servicioEditando, imagen: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        📷 Cambiar Imagen
                                    </label>
                                </div>

                                {servicioEditando.imagen && (
                                    <div className="vista-previa">
                                        <div className="imagen-container">
                                            <img src={servicioEditando.imagen} alt="Vista previa" className="imagen-preview" />
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

            {isVerModalOpen && servicioSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h1 className="titulo-usuario">Detalles del servicio</h1>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del servicio:</strong> {servicioSeleccionado.nombre}</p>
                                        <p><strong>Precio:</strong> {servicioSeleccionado.precio}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Descripción:</strong> {servicioSeleccionado.descripcion}</p>
                                        <p><strong>Estado:</strong> {servicioSeleccionado.estado ? "Activo" : "Inactivo"}</p>
                                    </div>
                                </div>
                                {servicioSeleccionado.imagen && (
                                    <div className="vista-previa">
                                        <div className="imagen-container">
                                            <img src={servicioSeleccionado.imagen} alt="Imagen del servicio" className="imagen-preview" />
                                        </div>
                                    </div>
                                )}
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

export default GestionServicio;