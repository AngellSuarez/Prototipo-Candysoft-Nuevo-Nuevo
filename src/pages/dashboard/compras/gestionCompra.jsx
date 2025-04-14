import React, { useState } from "react";
import "../../../css/gestionar.css";
import "../../../css/compras.css";
import { AiOutlineEye, AiFillFilePdf, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";

const GestionCompras = () => {

    const [compras, setCompras] = useState([
        { id: 1, proveedor: 'Diego Mora', fecha_ingreso: '12/05/2024', total: 23400, estado: 'Pendiente' },
        { id: 2, proveedor: 'Spa S.A.S', fecha_ingreso: '14/02/2025', total: 12340, estado: 'Anulada' },
        { id: 3, proveedor: 'Adriana Viana', fecha_ingreso: '12/01/2024', total: 30000, estado: 'Pendiente' },
    ]);

    const [compraSeleccionado, setCompraSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const [paginaActual, setPaginaActual] = useState(1);
    const comprasPorPagina = 4;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const MySwal = withReactContent(Swal);

    const anularCompra = (compra) => {
        if (compra.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Anular compra',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>anular</strong> la compra del proveedor <strong>${compra.proveedor}</strong>?</p>`,
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
                const nuevasCompras = compras.map(c =>
                    c.id === compra.id ? { ...c, estado: 'Anulada' } : c
                );
                setCompras(nuevasCompras);

                MySwal.fire({
                    icon: 'success',
                    title: 'Compra anulada',
                    text: `La compra del proveedor ${compra.proveedor} ha sido anulada correctamente.`,
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

    const completarCompra = (compra) => {
        if (compra.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Completar compra',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>completar</strong> la compra del proveedor <strong>${compra.proveedor}</strong>?</p>`,
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
                const nuevasCompras = compras.map(c =>
                    c.id === compra.id ? { ...c, estado: 'Completada' } : c
                );
                setCompras(nuevasCompras);

                MySwal.fire({
                    icon: 'success',
                    title: 'Compra completada',
                    text: `La compra del proveedor ${compra.proveedor} ha sido marcada como completada.`,
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

    const [formCompra, setFormCompra] = useState({
        proveedor: "",
        fecha_ingreso: "",
        fecha_compra: ""
    });

    const [erroresCompra, setErroresCompra] = useState({});

    const validarCampo = (name, value) => {
        let error = "";
        if (!value.trim()) {
            if (name === "proveedor") error = "El proveedor es obligatorio";
            if (name === "fecha_ingreso") error = "La fecha de ingreso es obligatoria";
            if (name === "fecha_compra") error = "La fecha de compra es obligatoria";
        }
        setErroresCompra((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCompra({ ...formCompra, [name]: value });

        if (erroresCompra[name]) {
            validarCampo(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const handleCrear = (e) => {
        e.preventDefault();

        let hayErrores = false;
        const nuevosErrores = {};

        if (!formCompra.proveedor.trim()) {
            nuevosErrores.proveedor = "El proveedor es obligatorio";
            hayErrores = true;
        }

        if (!formCompra.fecha_ingreso.trim()) {
            nuevosErrores.fecha_ingreso = "La fecha de ingreso es obligatoria";
            hayErrores = true;
        }

        if (!formCompra.fecha_compra.trim()) {
            nuevosErrores.fecha_compra = "La fecha de compra es obligatoria";
            hayErrores = true;
        }

        if (insumos.length === 0) {
            setErrorInsumosCompra("Debes agregar al menos un insumo");
            hayErrores = true;
        } else {
            setErrorInsumosCompra("");
        }

        setErroresCompra(nuevosErrores);

        if (hayErrores) {
            alert("Por favor completa todos los campos correctamente.");
            return;
        }

        setCrearModalOpen(false);
        alert("Compra creada exitosamente.");
    };

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (compra) => {
        setCompraSeleccionado(compra);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setCompraSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const comprasFiltrados = compras.filter(compra =>
        Object.values(compra).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const indexUltimoCompra = paginaActual * comprasPorPagina;
    const indexPrimerCompra = indexUltimoCompra - comprasPorPagina;
    const comprasActuales = comprasFiltrados.slice(indexPrimerCompra, indexUltimoCompra);
    const totalPaginas = Math.ceil(comprasFiltrados.length / comprasPorPagina);

    const cambiarPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return;
        setPaginaActual(numero);
    };

    const [showIngresoDateInput, setShowIngresoDateInput] = useState(false);
    const [showCompraDateInput, setShowCompraDateInput] = useState(false);

    const insumosDisponibles = [
        { nombre: "Barniz", precio: 5000 },
        { nombre: "Uñas", precio: 2000 },
        { nombre: "Algodón", precio: 1000 },
    ];

    const [insumos, setInsumos] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const [errorInsumo, setErrorInsumo] = useState("");
    const [errorCantidad, setErrorCantidad] = useState("");
    const [insumosEnModal, setInsumosEnModal] = useState([]);
    const [errorInsumosCompra, setErrorInsumosCompra] = useState("");


    const validarCantidad = () => {
        if (!cantidad || isNaN(cantidad) || Number(cantidad) < 1) {
            setErrorCantidad("La cantidad es obligatoria");
        } else {
            setErrorCantidad("");
        }
    };


    const agregarInsumoAlModal = () => {
        let errores = false;

        const insumoEncontrado = insumosDisponibles.find((i) => i.nombre === insumoSeleccionado);
        if (!insumoSeleccionado || !insumoEncontrado) {
            setErrorInsumo("El insumo es obligatorio");
            errores = true;
        }

        if (!cantidad || parseInt(cantidad) <= 0) {
            setErrorCantidad("La cantidad debe ser mayor a cero");
            errores = true;
        }

        if (errores) return;

        const nuevoInsumo = {
            nombre: insumoEncontrado.nombre,
            precioUnitario: insumoEncontrado.precio,
            cantidad: parseInt(cantidad),
        };

        setInsumosEnModal([...insumosEnModal, nuevoInsumo]);
        setInsumoSeleccionado("");
        setPrecioUnitario(0);
        setCantidad("");
    };


    const abrirModal = () => {
        setShowModal(true);
        setInsumoSeleccionado("");
        setPrecioUnitario(0);
        setCantidad(1);
        setInsumosEnModal([]);
    };


    const guardarInsumosDelModal = () => {
        if (insumosEnModal.length === 0) {
            alert("Debes agregar al menos un insumo antes de guardar.");
            return;
        }

        setInsumos((prev) => [...prev, ...insumosEnModal]);
        setInsumosEnModal([]);
        setInsumoSeleccionado("");
        setPrecioUnitario(0);
        setCantidad("");
        setShowModal(false);
        setErrorInsumosCompra("");

    };

    const cancelarModal = () => {
        setInsumosEnModal([]);
        setShowModal(false);
    };



    const calcularSubtotal = () => {
        return insumos.reduce(
            (total, ins) => total + ins.precioUnitario * ins.cantidad,
            0
        );
    };

    const subtotal = calcularSubtotal();
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const { darkMode } = useTheme();

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de compras</h1>
            </div>

            <button onClick={openCrearModal} className="crear-btn mb-4">
                Crear compra
            </button>

            {/* Barra de búsqueda */}
            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar compra..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>

            <div className="overflow-hidden">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Fecha Ingreso</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprasActuales.length > 0 ? (
                            comprasActuales.map((compra) => {
                                const esEditable = compra.estado === 'Pendiente';

                                return (
                                    <tr key={compra.id}>
                                        <td>{compra.proveedor}</td>
                                        <td>{compra.fecha_ingreso}</td>
                                        <td>${compra.total.toLocaleString()}</td>
                                        <td>
                                            <span
                                                className={`estado ${compra.estado === 'Pendiente'
                                                    ? 'estado-pendiente'
                                                    : compra.estado === 'Completada'
                                                        ? 'estado-completada'
                                                        : 'estado-anulada'
                                                    }`}
                                            >
                                                {compra.estado}
                                            </span>
                                        </td>
                                        <td className="text-center space-x-2">
                                            <button
                                                onClick={() => openVerModal(compra)}
                                                className="acciones-btn editar-btn flex items-center justify-center p-2"
                                                title="Ver factura de la compra"
                                            >
                                                <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                            </button>

                                            <button
                                                onClick={() => esEditable && completarCompra(compra)}
                                                className={`acciones-btn ver-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Completar la compra"
                                            >
                                                <AiOutlineCheck size={18} className="text-green-500 hover:text-green-700" />
                                            </button>

                                            <button
                                                onClick={() => esEditable && anularCompra(compra)}
                                                className={`acciones-btn eliminar-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                                disabled={!esEditable}
                                                title="Anular la compra"
                                            >
                                                <MdBlock size={18} className="text-red-500 hover:text-red-700" />
                                            </button>

                                            <button
                                                className="acciones-btn ver-btn flex items-center justify-center p-2"
                                                title="Imprimir un pdf"
                                            >
                                                <AiFillFilePdf size={18} className="text-red-500 hover:text-red-700" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron compras</td>
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
                        <div className="contenido-popup3">
                            <h2 className="titulo-usuario">Crear compra</h2>
                            <form onSubmit={handleCrear} className="space-y-3">
                                <div className="fila-formulario">
                                    <div className="w-full campo relative">
                                        <select
                                            name="proveedor"
                                            className="input-select w-full"
                                            value={formCompra.proveedor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="">Proveedor *</option>
                                            <option value="Diego Mora">Diego Mora</option>
                                            <option value="Spa S.A.S">Spa S.A.S</option>
                                            <option value="Adriana Viana">Adriana Viana</option>
                                        </select>
                                        {erroresCompra.proveedor && (
                                            <p className="error-texto text-red-600 text-left mt-1">{erroresCompra.proveedor}</p>
                                        )}
                                    </div>


                                    <div className="w-full campo relative">
                                        {showIngresoDateInput || formCompra.fecha_ingreso ? (
                                            <input
                                                type="date"
                                                name="fecha_ingreso"
                                                className="input-fecha-activo-compra w-full"
                                                value={formCompra.fecha_ingreso}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    if (erroresCompra.fecha_ingreso) {
                                                        validarCampo("fecha_ingreso", e.target.value);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!formCompra.fecha_ingreso) setShowIngresoDateInput(false);
                                                    validarCampo("fecha_ingreso", formCompra.fecha_ingreso);
                                                }}
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setShowIngresoDateInput(true)}
                                                className="input-fecha-placeholder-compra w-full"
                                            >
                                                Fecha de ingreso <span className="text-red-600">*</span>
                                            </div>
                                        )}
                                        {erroresCompra.fecha_ingreso && (
                                            <p className="error-texto text-red-600 text-left mt-1">{erroresCompra.fecha_ingreso}</p>
                                        )}

                                    </div>

                                    <div className="w-full campo relative">
                                        {showCompraDateInput || formCompra.fecha_compra ? (
                                            <input
                                                type="date"
                                                id="fechaCompra"
                                                name="fecha_compra"
                                                className="input-fecha-activo-compra w-full"
                                                value={formCompra.fecha_compra}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    if (erroresCompra.fecha_compra) {
                                                        validarCampo("fecha_compra", e.target.value);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!formCompra.fecha_compra) setShowCompraDateInput(false);
                                                    validarCampo("fecha_compra", formCompra.fecha_compra);
                                                }}
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setShowCompraDateInput(true)}
                                                className="input-fecha-placeholder-compra w-full"
                                            >
                                                Fecha de compra <span className="text-red-600">*</span>
                                            </div>
                                        )}
                                        {erroresCompra.fecha_compra && (
                                            <p className="error-texto text-red-600 text-left mt-1">{erroresCompra.fecha_compra}</p>
                                        )}
                                    </div>

                                </div>

                                <div className="fila-formulario">
                                    <button type="button" className="btn-agregar-insumo" onClick={() => setShowModal(true)}>
                                        Agregar insumos a la compra
                                    </button>

                                </div>
                                {errorInsumosCompra && (
                                    <p className="mensaje-error-insumos">{errorInsumosCompra}</p>
                                )}

                                <div className="insumo-agregados">
                                    <h3 className="titulo-seccion">Insumos agregados</h3>
                                    {insumos.length === 0 ? (
                                        <p className="mensaje-vacio">No has agregado insumos aún.</p>
                                    ) : (
                                        <div className="lista-insumos-grid">
                                            {insumos.map((ins, index) => (
                                                <div key={index} className="insumo-card">
                                                    <div className="info-insumo">
                                                        <span className="nombre-insumo">{ins.nombre}</span>
                                                        <span className="detalle-insumo">Precio: ${ins.precioUnitario}</span>
                                                        <span className="detalle-insumo">Cantidad: {ins.cantidad}</span>
                                                    </div>
                                                    <button
                                                        className="btn-eliminar-insumo"
                                                        onClick={() => {
                                                            const nuevosInsumos = insumos.filter((_, i) => i !== index);
                                                            setInsumos(nuevosInsumos);
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
                                    <input
                                        type="text"
                                        value={`Total: $${total.toFixed(2)}`}
                                        className="input-texto"
                                        readOnly
                                    />
                                </div>

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear compra
                                    </button>
                                </div>
                            </form>

                            {showModal && (
                                <div className="modal-fondo">
                                    <div className="modal-contenido-compra">
                                        <h2 className="solo-oscuro">Agregar insumos</h2>

                                        <div className="modal-form-row">
                                            <div className="campo">
                                                <select
                                                    value={insumoSeleccionado}
                                                    onChange={(e) => {
                                                        const ins = insumosDisponibles.find((i) => i.nombre === e.target.value);
                                                        if (ins) {
                                                            setInsumoSeleccionado(ins.nombre);
                                                            setPrecioUnitario(ins.precio);
                                                        } else {
                                                            setInsumoSeleccionado("");
                                                            setPrecioUnitario(0);
                                                        }
                                                        setErrorInsumo(""); // Limpiar error al cambiar
                                                    }}
                                                    className="input-select modal-input"
                                                >
                                                    <option value="">Insumo *</option>
                                                    {insumosDisponibles.map((ins, index) => (
                                                        <option key={index} value={ins.nombre}>
                                                            {ins.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errorInsumo && (
                                                    <p className="error-texto text-red-600 text-left mt-1">{errorInsumo}</p>
                                                )}
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="text"
                                                    className="input-texto modal-input"
                                                    value={precioUnitario ? `$${precioUnitario}` : ""}
                                                    placeholder="Precio Unitario"
                                                    readOnly
                                                />
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="number"
                                                    className={`input-texto modal-input ${errorCantidad ? "input-error" : ""}`}
                                                    value={cantidad}
                                                    min="1"
                                                    onChange={(e) => {
                                                        setCantidad(e.target.value);
                                                        if (errorCantidad) validarCantidad();
                                                    }}
                                                    onBlur={validarCantidad}
                                                    placeholder="Cantidad *"
                                                />
                                                {errorCantidad && (
                                                    <p className="error-texto text-red-600 text-left mt-1">{errorCantidad}</p>
                                                )}

                                            </div>
                                        </div>

                                        <div className="modal-botones">
                                            <button onClick={agregarInsumoAlModal} className="btn-agregar">
                                                Agregar insumo
                                            </button>
                                        </div>

                                        <div className="insumos-agregados-modal">
                                            <h4>Insumos agregados:</h4>
                                            {insumosEnModal.length === 0 ? (
                                                <p>No has agregado insumos aún.</p>
                                            ) : (
                                                insumosEnModal.map((ins, index) => (
                                                    <div
                                                        key={index}
                                                        className="insumo-item-modal"
                                                    >
                                                        {ins.nombre} - ${ins.precioUnitario} x{" "}
                                                        {ins.cantidad}
                                                        <button
                                                            className="btn-eliminar-insumo-agregar"
                                                            onClick={() => {
                                                                const nuevosInsumosEnModal = insumosEnModal.filter((_, i) => i !== index);
                                                                setInsumosEnModal(nuevosInsumosEnModal);
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="modal-botones">
                                            <button onClick={guardarInsumosDelModal} className="btn-crear">
                                                Guardar insumos
                                            </button>
                                            <button onClick={() => setShowModal(false)} className="btn-cancelar">
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

            {isVerModalOpen && compraSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup-2">
                            <h2 className="titulo-usuario">Factura</h2>
                            <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="" className="logo-ver-compra" />
                            <hr class="linea" />
                            <div>
                                <h5 className="informacion-proveedor">Compra #1</h5>
                                <div className="fechas">
                                    <p>Fecha de ingreso: 12/05/2024</p>
                                    <p>Fecha de compra: 11/05/2024</p>
                                </div>
                                <div className="informacion-proveedor">
                                    <p><strong>Información Proveedor</strong></p>
                                    <p>Paula Gallego</p>
                                    <p>3007787515</p>
                                    <p>paulagallego@gmail.com</p>
                                    <p>Cr23b#84b186, Medellín</p>
                                </div>
                            </div>
                            <hr class="linea" />
                            <div className="insumos-factura">
                                <h4 className="facturados">Insumos Facturados</h4>

                                <div className="header-factura">
                                    <p ><strong>Insumo</strong></p>
                                    <p>Precio</p>
                                    <p>Cantidad</p>
                                    <p>Subtotal</p>
                                    <p>IVA</p>
                                    <p>Total</p>
                                </div>

                                <div className="fila-factura">
                                    <p className="col-insumo">Barniz</p>
                                    <p className="dinero">$2.000</p>
                                    <p className="dinero">2</p>
                                    <p className="dinero">$4.000</p>
                                    <p className="dinero">$760</p>
                                    <p className="dinero">$4.760</p>
                                </div>

                                <div className="fila-factura">
                                    <p className="col-insumo">Uñas</p>
                                    <p className="dinero">$4.000</p>
                                    <p className="dinero">3</p>
                                    <p className="dinero">$12.000</p>
                                    <p className="dinero">$2.280</p>
                                    <p className="dinero">$14.280</p>
                                </div>
                            </div>
                            <div className="valores-totales">
                                <p><strong>Subtotal de la compra:</strong> <span>$19.042</span></p>
                                <p><strong>IVA total de la compra:</strong> <span>$3.618</span></p>
                                <p><strong>Total a pagar:</strong> <span className="total">$22.660</span></p>
                            </div>
                            <div className="footer-popup">
                                <p>"Este comprobante corresponde a la compra realizada a proveedor y es de uso exclusivo para control interno"</p>
                                <p>CandyNails Medellín © 2025</p>
                            </div>
                        </div>

                        <div className="button-container">
                            <button className="btn-volver" onClick={closeVerModal}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionCompras;
