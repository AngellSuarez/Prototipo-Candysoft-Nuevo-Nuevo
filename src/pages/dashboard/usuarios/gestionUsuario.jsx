import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { useTheme } from "../../tema/ThemeContext";

const GestionUsuarios = () => {

    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: "Sofia", apellido: "Perez", tipoDocumento: "CC", celular: "3007762312", documento: "11355647", correo: "sofi@gmail.com", ciudad: "Medellin", telefono: "3118675434", direccion: "Calle 12", rol: "Manicurista", estado: false },
        { id: 2, nombre: "Laura", apellido: "Monsalve", tipoDocumento: "CC", celular: "3124567898", documento: "10456532", correo: "lau@gmail.com", ciudad: "Envigado", telefono: "3007765412", direccion: "Calle 24", rol: "Recepcionista", estado: true },
    ]);

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuarioPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        tipoDocumento: "",
        documento: "",
        celular: "",
        direccion: "",
        ciudad: "",
        rol: "",
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
                case "direccion":
                    error = "La dirección es obligatoria";
                    break;
                case "ciudad":
                    error = "La ciudad es obligatoria";
                    break;
                case "rol":
                    error = "El rol es obligatorio";
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

            if (name === "celular") {
                const soloNumeros = value.replace(/\D/g, "");
                if (soloNumeros.length !== 10) {
                    error = "El celular debe tener exactamente 10 números";
                }
            }
        }

        setErrores((prev) => ({ ...prev, [name]: error }));
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarUsuario = (usuario) => {
        MySwal.fire({
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
        })
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


    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setUsuarioSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleToggleEstado = (id) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id ? { ...usuario, estado: !usuario.estado } : usuario
        ));
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

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
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
                            <th>Identificación</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
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
                                    <td>{usuario.documento}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.telefono}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(usuario.id)}
                                            className={`estado-btn ${usuario.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {usuario.estado ? "Activo" : "Inactivo"}
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
                                            name="celular"
                                            placeholder={renderPlaceholder("Celular", "celular")}
                                            className={inputClass("celular")}
                                            value={formData.celular}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.celular && <p className="error-texto">{errores.celular}</p>}
                                    </div>
                                </div>


                                <div className="fila-formulario">
                                    <div className="campo">
                                        <input
                                            type="text"
                                            name="direccion"
                                            placeholder={renderPlaceholder("Dirección", "direccion")}
                                            className={inputClass("direccion")}
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errores.direccion && <p className="error-texto">{errores.direccion}</p>}
                                    </div>
                                    <div className="campo">
                                        <select
                                            name="ciudad"
                                            className={selectClass("ciudad")}
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


                                <div className="fila-formulario">
                                    <div className="campo">
                                        <select
                                            name="rol"
                                            className={selectClass("rol")}
                                            value={formData.rol}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Seleccionar Rol *</option>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Recepcionista">Recepcionista</option>
                                            <option value="Manicurista">Manicurista</option>
                                            <option value="Proveedor">Proveedor</option>
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
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let isValid = true;
                                    let errors = {};

                                    Object.keys(usuarioEditando).forEach((key) => {
                                        const value = usuarioEditando[key];

                                        if (
                                            key !== "estado" &&
                                            (typeof value === "string" ? value.trim() === "" : false)
                                        ) {
                                            errors[key] = "Este campo es obligatorio";
                                            isValid = false;
                                        }
                                    });

                                    if (isValid) {
                                        setUsuarios((prev) =>
                                            prev.map((u) => (u.id === usuarioEditando.id ? usuarioEditando : u))
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
                                                value={usuarioEditando.nombre}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, nombre: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        nombre: valor.trim() === '' ? 'Este campo es obligatorio' : null,
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
                                                value={usuarioEditando.apellido}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, apellido: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        apellido: valor.trim() === '' ? 'Este campo es obligatorio' : null,
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
                                                value={usuarioEditando.tipoDocumento}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, tipoDocumento: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        tipoDocumento: valor.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Tipo de Documento</option>
                                                <option value="CC">CC</option>
                                                <option value="CE">CE</option>
                                            </select>
                                            {erroresEditar.tipoDocumento && (
                                                <p className="error-mensaje">{erroresEditar.tipoDocumento}</p>
                                            )}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Número documento:</label>
                                            <input
                                                type="text"
                                                name="documento"
                                                value={usuarioEditando.documento}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, documento: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        documento: valor.trim() === '' ? 'Este campo es obligatorio' : null,
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
                                                value={usuarioEditando.correo}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, correo: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        correo: valor.trim() === '' ? 'Este campo es obligatorio' : null,
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
                                                value={usuarioEditando.celular}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, celular: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        celular: valor.trim() === '' ? 'Este campo es obligatorio' : null,
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
                                            <label className="subtitulo-editar-todos">Dirección:</label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={usuarioEditando.direccion}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, direccion: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        direccion: valor.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                placeholder="Dirección"
                                                className="input-texto col-span-2"
                                            />
                                            {erroresEditar.direccion && <p className="error-mensaje">{erroresEditar.direccion}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Ciudad:</label>
                                            <select
                                                name="ciudad"
                                                value={usuarioEditando.ciudad}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, ciudad: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        ciudad: valor.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Seleccionar Ciudad</option>
                                                <option value="medellin">Medellín</option>
                                                <option value="bogota">Bogotá</option>
                                                <option value="cali">Cali</option>
                                            </select>
                                            {erroresEditar.ciudad && <p className="error-mensaje">{erroresEditar.ciudad}</p>}
                                        </div>
                                    </div>

                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Rol:</label>
                                            <select
                                                name="rol"
                                                value={usuarioEditando.rol}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, rol: valor });
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        rol: valor.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Seleccionar Rol</option>
                                                <option value="Administrador">Administrador</option>
                                                <option value="Recepcionista">Recepcionista</option>
                                                <option value="Manicurista">Manicurista</option>
                                                <option value="Proveedor">Proveedor</option>
                                            </select>
                                            {erroresEditar.rol && <p className="error-mensaje">{erroresEditar.rol}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Estado:</label>
                                            <select
                                                name="estado"
                                                value={usuarioEditando.estado ? "activo" : "inactivo"}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setUsuarioEditando({ ...usuarioEditando, estado: value === "activo" });
                                                    setErroresEditar(prev => ({
                                                        ...prev,
                                                        estado: value.trim() === "" ? "Campo obligatorio" : "",
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
                                        <p><strong>Nombre del Usuario:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                                        <p><strong>Tipo de Documento:</strong> {usuarioSeleccionado.tipoDocumento}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Número de identificación:</strong> {usuarioSeleccionado.documento}</p>
                                        <p><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Teléfono:</strong> {usuarioSeleccionado.celular}</p>
                                        <p><strong>Dirección:</strong> {usuarioSeleccionado.direccion}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Rol:</strong> {usuarioSeleccionado.rol}</p>
                                        <p><strong>Estado:</strong> {usuarioSeleccionado.estado ? "Activo" : "Inactivo"}</p>
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
        </div >
    );
};

export default GestionUsuarios;