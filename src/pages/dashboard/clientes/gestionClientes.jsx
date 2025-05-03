import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlineEye } from "react-icons/ai";
import "../../../css/gestionar.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const GestionClientes = () => {

    const [clientes, setClientes] = useState([
        { id: 1, nombre: "Martha", apellido: "Ciro", documento: "11355647", tipoDocumento: "CC", correo: "martha@gmail.com", celular: "3118675434", estado: false },
        { id: 2, nombre: "Gloria", apellido: "Aristizabal", documento: "10456532", tipoDocumento: "CC", correo: "glori@gmail.com", celular: "3007765412", estado: true },
        { id: 3, nombre: "Andrea", apellido: "Agudelo", documento: "10413421345", tipoDocumento: "CC", correo: "andre@gmail.com", celular: "3007345678", estado: true },
    ]);

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const clientesPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        tipoDocumento: "",
        documento: "",
        celular: ""
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
                case "celular":
                    error = "El número de celular es obligatorio";
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
                    error = "Correo inválido. Usa @gmail.com, @outlook.com o @yahoo.es";
                }
            }

            if (name === "celular") {
                const soloNumeros = value.replace(/\D/g, "");
                if (soloNumeros.length !== 10) {
                    error = "El celular debe tener exactamente 10 números";
                }
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

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
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
            setClientes((prev) => [
                ...prev,
                { id: prev.length + 1, ...formData, estado: true },
            ]);
            closeCrearModal();
        } else {
            alert("Por favor completa todos los campos correctamente.");
        }
    };

    const MySwal = withReactContent(Swal);
    const handleEliminarCliente = (cliente) => {
        MySwal.fire({
            title: `Eliminar el cliente`,
            html: `
                        <p class="texto-blanco">¿Estás seguro de que deseas eliminar el <strong>${cliente.nombre} ${cliente.apellido}</strong>?</p>
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

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isEditarModalOpen, setEditarModalOpen] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);

    const openEditarModal = (cliente) => {
        setClienteEditando(cliente);
        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setClienteEditando(null);
        setEditarModalOpen(false);
    };

    const handleEditarCliente = (id) => {
        const cliente = clientes.find(u => u.id === id);
        openEditarModal(cliente);
    };

    const [erroresEditar, setErroresEditar] = useState({});


    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (cliente) => {
        setClienteSeleccionado(cliente);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setClienteSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleToggleEstado = (id) => {
        setClientes(clientes.map(cliente =>
            cliente.id === id ? { ...cliente, estado: !cliente.estado } : cliente
        ));
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const clientesFiltrados = clientes.filter(cliente =>
        Object.values(cliente).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoCliente = paginaActual * clientesPorPagina;
    const indexPrimerCliente = indexUltimoCliente - clientesPorPagina;
    const clientesActuales = clientesFiltrados.slice(indexPrimerCliente, indexUltimoCliente);
    const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

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
                <h1 className="titulo">Gestión de clientes</h1>

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
                Crear Cliente
            </button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar cliente..."
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
                            <th>Correo</th>
                            <th>Celular</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesActuales.length > 0 ? (
                            clientesActuales.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellido}</td>
                                    <td>{cliente.documento}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.celular}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(cliente.id)}
                                            className={`estado-btn ${cliente.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {cliente.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarCliente(cliente.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el cliente"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => openVerModal(cliente)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del cliente"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminarCliente(cliente)}
                                            title="Eliminar el cliente"
                                            className="acciones-btn eliminar-btn flex items-center justify-center p-2"
                                        >
                                            <FiTrash2 size={16} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No se encontraron clientes</td>
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
                            <h2 className="text-xl font-semibold mb-4">Crear cliente</h2>
                            <form onSubmit={handleCrear} className="space-y-3">
                                <div className="fila-formulario">
                                    <div className="campo relative">
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre *"
                                            className="input-texto"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.nombre && <p className="error-texto">{errores.nombre}</p>}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="apellido"
                                            placeholder="Apellido *"
                                            className="input-texto"
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
                                            className="input-select"
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
                                            placeholder="Documento *"
                                            className="input-texto"
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
                                            placeholder="Correo Electrónico *"
                                            className="input-texto"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.correo && <p className="error-texto">{errores.correo}</p>}
                                    </div>
                                    <div className="campo">
                                        <input
                                            type="tel"
                                            name="celular"
                                            placeholder="Celular *"
                                            className="input-texto"
                                            value={formData.celular}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.celular && <p className="error-texto">{errores.celular}</p>}
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear cliente
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {isEditarModalOpen && clienteEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar cliente</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    const campos = {
                                        nombre: clienteEditando.nombre,
                                        apellido: clienteEditando.apellido,
                                        tipoDocumento: clienteEditando.tipoDocumento,
                                        documento: clienteEditando.documento,
                                        correo: clienteEditando.correo,
                                        celular: clienteEditando.celular,
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

                                    setClientes((prev) =>
                                        prev.map((u) => u.id === clienteEditando.id ? clienteEditando : u)
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
                                                value={clienteEditando.nombre}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, nombre: value });
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
                                                value={clienteEditando.apellido}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, apellido: value });
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
                                                value={clienteEditando.tipoDocumento}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, tipoDocumento: value });
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
                                                value={clienteEditando.documento}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, documento: value });
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
                                                value={clienteEditando.correo}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, correo: value });
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
                                                value={clienteEditando.celular}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setClienteEditando({ ...clienteEditando, celular: value });
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
                                </div>
                                <div className="campo col-span-2">
                                    <label className="subtitulo-editar-todos">Estado:</label>
                                    <select
                                        name="estado"
                                        value={clienteEditando.estado ? "activo" : "inactivo"}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setClienteEditando({ ...clienteEditando, estado: value === "activo" });
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


            {isVerModalOpen && clienteSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del cliente</h2>

                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del cliente:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                                        <p><strong>Tipo de Documento:</strong> {clienteSeleccionado.tipoDocumento}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Número de identificación:</strong> {clienteSeleccionado.documento}</p>
                                        <p><strong>Correo:</strong> {clienteSeleccionado.correo}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Celular:</strong> {clienteSeleccionado.celular}</p>
                                        <p><strong>Estado:</strong> {clienteSeleccionado.estado ? "Activo" : "Inactivo"}</p>
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

export default GestionClientes;
