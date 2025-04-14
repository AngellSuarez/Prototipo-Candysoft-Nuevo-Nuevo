import React, { useState } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import "../../../css/gestionar.css";
import { AiOutlineEye } from "react-icons/ai";
import { useTheme } from "../../tema/ThemeContext";

const GestionInsumos = () => {

    const [insumos, setInsumos] = useState([
        { id: 1, nombre: "Esmalte Rojo", unidad: "Paquetes", cantidad: 50, estado: true },
        { id: 2, nombre: "Removedor de esmalte", unidad: "Botellas", cantidad: 30, estado: false },
    ]);

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const insumosPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);
    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);


    const [formData, setFormData] = useState({
        nombre: "",
        cantidad: "",
        unidad: "",
    });

    const [errores, setErrores] = useState({});

    const validarCampo = (name, value) => {
        let error = "";


        if (!value.trim()) {
            switch (name) {
                case "nombre":
                    error = "El nombre es obligatorio";
                    break;
                case "cantidad":
                    error = "La cantidad es obligatoria";
                    break;
                case "unidad":
                    error = "La unidad es obligatoria";
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
    const [insumoEditando, setInsumoEditando] = useState(null);

    const openEditarModal = (insumo) => {
        setInsumoEditando(insumo);
        setEditarModalOpen(true);
    };

    const closeEditarModal = () => {
        setInsumoEditando(null);
        setEditarModalOpen(false);
    };

    const handleEditarInsumo = (id) => {
        const insumo = insumos.find(u => u.id === id);
        openEditarModal(insumo);
    };
    const [erroresEditar, setErroresEditar] = useState({});


    const handleToggleEstado = (id) => {
        setInsumos(insumos.map(insumo =>
            insumo.id === id ? { ...insumo, estado: !insumo.estado } : insumo
        ));
    };

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (insumo) => {
        setInsumoSeleccionado(insumo);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setInsumoSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const insumosFiltrados = insumos.filter(insumo =>
        Object.values(insumo).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoInsumo = paginaActual * insumosPorPagina;
    const indexPrimerInsumo = indexUltimoInsumo - insumosPorPagina;
    const insumosActuales = insumosFiltrados.slice(indexPrimerInsumo, indexUltimoInsumo);
    const totalPaginas = Math.ceil(insumosFiltrados.length / insumosPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const { darkMode } = useTheme();

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Insumos</h1>
            </div>
            <button onClick={openCrearModal} className="crear-btn mt-4">
                Crear Insumo
            </button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar insumo..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Nombre del Insumo</th>
                            <th>Unidad</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insumosActuales.length > 0 ? (
                            insumosActuales.map((insumo) => (
                                <tr key={insumo.id}>
                                    <td>{insumo.nombre}</td>
                                    <td>{insumo.unidad}</td>
                                    <td>{insumo.cantidad}</td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleEstado(insumo.id)}
                                            className={`estado-btn ${insumo.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                                            {insumo.estado ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => handleEditarInsumo(insumo.id)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Editar el insumo"
                                        >
                                            <FiEdit size={16} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                        <button
                                            onClick={() => openVerModal(insumo)}
                                            className="acciones-btn ver-btn flex items-center justify-center p-2"
                                            title="Ver detalles del insumo"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No se encontraron insumos</td>
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
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Crear Insumo</h2>
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
                                                name="cantidad"
                                                placeholder={renderPlaceholder("Cantidad", "cantidad")}
                                                value={formData.cantidad}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={inputClass("cantidad")}
                                            />
                                            {errores.cantidad && <p className="error-texto">{errores.cantidad}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="fila-formulario">
                                    <div className="campo relative">
                                        <select
                                            name="unidad"
                                            placeholder={renderPlaceholder("Unidad", "unidad")}
                                            value={formData.unidad}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={selectClass("unidad")}
                                        >
                                            <option value="">Seleccionar unidad *</option>
                                            <option value="Paquetes">Paquetes</option>
                                            <option value="Botellas">Botellas</option>
                                            <option value="Litros">Litros</option>
                                        </select>
                                        {errores.unidad && <p className="error-texto">{errores.unidad}</p>}
                                    </div>
                                </div>

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear Insumo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {isEditarModalOpen && insumoEditando && (
                <div className="overlay-popup" onClick={closeEditarModal}>
                    <div className="ventana-popup max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="text-xl font-semibold mb-4">Editar insumo</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const errors = {};

                                    const nombreValido = String(insumoEditando.nombre || "").trim();
                                    const cantidadValida = String(insumoEditando.cantidad || "").trim();
                                    const unidadValida = String(insumoEditando.unidad || "").trim();

                                    if (!nombreValido) {
                                        errors.nombre = 'Este campo es obligatorio';
                                    }
                                    if (!cantidadValida) {
                                        errors.cantidad = 'Este campo es obligatorio';
                                    }
                                    if (!unidadValida) {
                                        errors.unidad = 'Este campo es obligatorio';
                                    }


                                    setErroresEditar(errors);
                                    if (Object.keys(errors).length === 0) {
                                        setInsumos((prev) =>
                                            prev.map((u) =>
                                                u.id === insumoEditando.id ? { ...u, ...insumoEditando } : u
                                            )
                                        );
                                        closeEditarModal();
                                    }
                                }}
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Nombre:</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={insumoEditando.nombre}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInsumoEditando((prev) => ({ ...prev, nombre: value }));
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        nombre: value.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                placeholder="Nombre"
                                                className="input-texto"
                                            />
                                            {erroresEditar.nombre && <p className="error-mensaje">{erroresEditar.nombre}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Cantidad:</label>
                                            <input
                                                type="text"
                                                name="cantidad"
                                                value={String(insumoEditando.cantidad)}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInsumoEditando((prev) => ({ ...prev, cantidad: value }));
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        cantidad: value.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                placeholder="Cantidad"
                                                className="input-texto"
                                            />
                                            {erroresEditar.cantidad && <p className="error-mensaje">{erroresEditar.cantidad}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Unidad:</label>
                                            <select
                                                name="unidad"
                                                value={insumoEditando.unidad || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInsumoEditando((prev) => ({ ...prev, unidad: value }));
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        unidad: value.trim() === '' ? 'Este campo es obligatorio' : null,
                                                    }));
                                                }}
                                                className="input-select"
                                            >
                                                <option value="">Seleccionar unidad</option>
                                                <option value="Paquetes">Paquetes</option>
                                                <option value="Botellas">Botellas</option>
                                                <option value="Litros">Litros</option>

                                            </select>
                                            {erroresEditar.unidad && <p className="error-mensaje">{erroresEditar.unidad}</p>}
                                        </div>

                                        <div className="campo">
                                            <label className="subtitulo-editar-todos">Estado:</label>
                                            <select
                                                name="estado"
                                                value={
                                                    insumoEditando.estado === true
                                                        ? 'activo'
                                                        : insumoEditando.estado === false
                                                            ? 'inactivo'
                                                            : ''
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInsumoEditando((prev) => ({
                                                        ...prev,
                                                        estado: value === 'activo' ? true : value === 'inactivo' ? false : '',
                                                    }));
                                                    setErroresEditar((prev) => ({
                                                        ...prev,
                                                        estado: value === '' ? 'Este campo es obligatorio' : null,
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


            {isVerModalOpen && insumoSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalles del insumo</h2>
                            <div className="info-usuario space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <p><strong>Nombre del insumo:</strong> {insumoSeleccionado.nombre}</p>
                                        <p><strong>Unidad:</strong> {insumoSeleccionado.unidad}</p>
                                    </div>
                                    <div className="fila-formulario">
                                        <p><strong>Cantidad:</strong> {insumoSeleccionado.cantidad}</p>
                                        <p><strong>Estado:</strong> {insumoSeleccionado.estado ? "Activo" : "Inactivo"}</p>
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

export default GestionInsumos;