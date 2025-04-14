import React, { useState } from "react";
import { AiOutlineEye, AiOutlineCheck } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import "../../../css/gestionar.css";
import "../../../css/abastecimientos.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from "../../tema/ThemeContext";

const GestionAbastecimientos = () => {
    const [abastecimientos, setAbastecimientos] = useState([
        { id: 1, fecha: "12/03/2025", manicurista: "Sofia Pérez", insumo: "Esmalte rojo", cantidad: 5, estado: 'Pendiente' },
        { id: 2, fecha: "13/03/2025", manicurista: "Mónica Sánchez", insumo: "Lima", cantidad: 10, estado: 'Pendiente' },
        { id: 3, fecha: "14/03/2025", manicurista: "Carla Muñoz", insumo: "Removedor de esmalte", cantidad: 3, estado: 'Pendiente' }
    ]);

    const { darkMode } = useTheme();

    const [abastecimientoSeleccionado, setAbastecimientoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 3;

    const [isCrearModalOpen, setCrearModalOpen] = useState(false);

    const [manicuristaSeleccionada, setManicuristaSeleccionada] = useState("");
    const [errorManicurista, setErrorManicurista] = useState("");
    const [errorFechaAbastecimiento, setErrorFechaAbastecimiento] = useState("");
    const [errorInsumos, setErrorInsumos] = useState("");
    const [tocoValidar, setTocoValidar] = useState(false);
    const [errorInsumoSeleccionado, setErrorInsumoSeleccionado] = useState("");
    const [tocoValidarInsumo, setTocoValidarInsumo] = useState(false);
    const [errorCantidad, setErrorCantidad] = useState("");
    const [tocoValidarCantidad, setTocoValidarCantidad] = useState(false);


    const handleCrearAbastecimiento = (e) => {
        e.preventDefault();
        setTocoValidar(true);

        let hayError = false;
        let errores = [];

        if (!manicuristaSeleccionada) {
            const mensaje = "Debes seleccionar la manicurista";
            setErrorManicurista(mensaje);
            errores.push(mensaje);
            hayError = true;
        } else {
            setErrorManicurista("");
        }

        if (!abastecimientoDate) {
            const mensaje = "El campo de fecha es obligatorio";
            setErrorFechaAbastecimiento(mensaje);
            errores.push(mensaje);
            hayError = true;
        } else {
            setErrorFechaAbastecimiento("");
        }
        if (insumos.length === 0) {
            const mensaje = "Debes agregar al menos un insumo";
            setErrorInsumos(mensaje);
            errores.push(mensaje);
            hayError = true;
        } else {
            setErrorInsumos("");
        }

        if (hayError) {
            alert("Por favor completa todos los campos correctamente.");
            return;
        }

        alert("¡Abastecimiento creado con éxito!");
        closeCrearModal();
        setTocoValidar(false);
    };

    const openCrearModal = () => setCrearModalOpen(true);
    const closeCrearModal = () => setCrearModalOpen(false);

    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const openVerModal = (abastecimiento) => {
        setAbastecimientoSeleccionado(abastecimiento);
        setVerModalOpen(true);
    };

    const closeVerModal = () => {
        setAbastecimientoSeleccionado(null);
        setVerModalOpen(false);
    };

    const handleBuscar = (e) => {
        const valorBusqueda = e.target.value.toLowerCase();
        setBusqueda(valorBusqueda);
        setPaginaActual(1);
    };

    const abastecimientosFiltrados = abastecimientos.filter(abastecimiento =>
        Object.values(abastecimiento).some(valor =>
            String(valor).toLowerCase().includes(busqueda)
        )
    );

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(abastecimientosFiltrados.length / itemsPorPagina)) {
            setPaginaActual(nuevaPagina);
        }
    };

    const MySwal = withReactContent(Swal);

    const anularAbastecimiento = (abastecimiento) => {
        if (abastecimiento.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Anular abastecimiento',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>anular</strong> el abastecimiento de la manicurista <strong>${abastecimiento.manicurista}</strong>?</p>`,
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
                const nuevosAbastecimientos = abastecimientos.map(c =>
                    c.id === abastecimiento.id ? { ...c, estado: 'Anulado' } : c
                );
                setAbastecimientos(nuevosAbastecimientos);

                MySwal.fire({
                    icon: 'success',
                    title: 'Abastecimiento anulado',
                    text: `El abastecimiento de la manicurista ${abastecimiento.manicurista} ha sido anulado correctamente.`,
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

    const completarAbastecimiento = (abastecimiento) => {
        if (abastecimiento.estado !== 'Pendiente') return;

        MySwal.fire({
            title: 'Completar abastecimiento',
            html: `<p class="texto-blanco">¿Estás seguro de que deseas <strong>completar</strong> el abastecimiento de la manicurista <strong>${abastecimiento.manicurista}</strong>?</p>`,
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
                const nuevosAbastecimientos = abastecimientos.map(c =>
                    c.id === abastecimiento.id ? { ...c, estado: 'Completado' } : c
                );
                setAbastecimientos(nuevosAbastecimientos);

                MySwal.fire({
                    icon: 'success',
                    title: 'Abastecimiento completado',
                    text: `El abastecimiento de la manicurista ${abastecimiento.manicurista} ha sido marcado como completado.`,
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


    const indexUltima = paginaActual * itemsPorPagina;
    const indexPrimera = indexUltima - itemsPorPagina;
    const abastecimientosActuales = abastecimientosFiltrados.slice(indexPrimera, indexUltima);
    const totalPaginas = Math.ceil(abastecimientosFiltrados.length / itemsPorPagina);

    const [showAbastecimientoDateInput, setShowAbastecimientoDateInput] = useState(false);
    const [abastecimientoDate, setAbastecimientoDate] = useState("");

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
    const [insumosEnModal, setInsumosEnModal] = useState([]);

    const abrirModal = () => {
        setShowModal(true);
        setInsumoSeleccionado("");
        setPrecioUnitario(0);
        setCantidad(1);
        setInsumosEnModal([]);
    };

    const agregarInsumoAlModal = () => {
        let hayError = false;

        if (!insumoSeleccionado) {
            setErrorInsumoSeleccionado("Debes seleccionar un insumo");
            setTocoValidarInsumo(true);
            hayError = true;
        } else {
            setErrorInsumoSeleccionado("");
        }

        if (!cantidad || cantidad < 1) {
            setErrorCantidad("Debes ingresar una cantidad válida");
            setTocoValidarCantidad(true);
            hayError = true;
        } else {
            setErrorCantidad("");
        }

        if (hayError) {
            alert("Debes llenar correctamente los campos de insumo.");
            return;
        }

        const nuevoInsumo = {
            nombre: insumoSeleccionado,
            precioUnitario,
            cantidad,
        };

        setInsumosEnModal([...insumosEnModal, nuevoInsumo]);

        setInsumoSeleccionado("");
        setPrecioUnitario(0);
        setCantidad(1);
        setTocoValidarInsumo(false);
        setTocoValidarCantidad(false);
    };


    const guardarInsumosDelModal = () => {

        if (insumosEnModal.length === 0) {
            alert("Debes agregar al menos un insumo antes de guardar.");
            return;
        }
        setInsumos([...insumos, ...insumosEnModal]);
        setInsumosEnModal([]);
        setShowModal(false);


    };

    const cancelarModal = () => {
        setInsumosEnModal([]);
        setShowModal(false);
    };

    return (
        <div className={`roles-container ${darkMode ? "dark" : ""}`}>
            <h1>Gestión de Abastecimientos</h1>

            <button onClick={openCrearModal} className="crear-btn">Crear abastecimiento</button>

            <div className="busqueda-container mb-4">
                <input
                    type="text"
                    placeholder="Buscar abastecimiento..."
                    value={busqueda}
                    onChange={handleBuscar}
                    className="busqueda-input"
                />
            </div>
            <table className="roles-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Manicurista</th>
                        <th>Insumo</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {abastecimientosActuales.length > 0 ? (
                        abastecimientosActuales.map((abastecimiento) => {
                            const esEditable = abastecimiento.estado === 'Pendiente';

                            return (
                                <tr key={abastecimiento.id}>
                                    <td>{abastecimiento.fecha}</td>
                                    <td>{abastecimiento.manicurista}</td>
                                    <td>{abastecimiento.insumo}</td>
                                    <td>{abastecimiento.cantidad}</td>
                                    <td>{abastecimiento.estado}</td>
                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => openVerModal(abastecimiento)}
                                            className="acciones-btn editar-btn flex items-center justify-center p-2"
                                            title="Ver detalles del abastecimiento"
                                        >
                                            <AiOutlineEye size={18} className="text-pink-500 hover:text-pink-700" />
                                        </button>

                                        <button
                                            onClick={() => esEditable && completarAbastecimiento(abastecimiento)}
                                            className={`acciones-btn ver-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                            disabled={!esEditable}
                                            title="Completar el abastecimiento"
                                        >
                                            <AiOutlineCheck size={18} className="text-green-500 hover:text-green-700" />
                                        </button>
                                        <button
                                            onClick={() => esEditable && anularAbastecimiento(abastecimiento)}
                                            className={`acciones-btn eliminar-btn flex items-center justify-center p-2 ${!esEditable && 'opacity-50 cursor-not-allowed'}`}
                                            disabled={!esEditable}
                                            title="Anular el abastecimiento"
                                        >
                                            <MdBlock size={18} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>

                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center p-4">No se encontraron abastecimientos</td>
                        </tr>
                    )}
                </tbody>
            </table>

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
                            <h2 className="titulo-usuario">Crear abastecimiento</h2>
                            <form onSubmit={handleCrearAbastecimiento}>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="fila-formulario">
                                        <div className="campo">
                                            <select
                                                id="manicurista"
                                                className="input-select w-full"
                                                value={manicuristaSeleccionada}
                                                onChange={(e) => {
                                                    setManicuristaSeleccionada(e.target.value);
                                                    setErrorManicurista("");
                                                }}
                                                onBlur={() => {
                                                    if (!manicuristaSeleccionada) {
                                                        setErrorManicurista("Debes seleccionar la manicurista");
                                                    }
                                                }}
                                            >
                                                <option value="">Seleccione una manicurista *</option>
                                                <option value="Sofia Pérez">Sofia Pérez</option>
                                                <option value="Mónica Sánchez">Mónica Sánchez</option>
                                                <option value="Carla Muñoz">Carla Muñoz</option>
                                            </select>

                                            {errorManicurista && (
                                                <p className="error-texto">{errorManicurista}</p>
                                            )}
                                        </div>
                                        <div className="campo">
                                            <div className="mb-4">
                                                {showAbastecimientoDateInput || abastecimientoDate ? (
                                                    <input
                                                        type="date"
                                                        id="fechaAbastecimiento"
                                                        name="fechaAbastecimiento"
                                                        className="input-fecha-activo-abastecimiento"
                                                        value={abastecimientoDate}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        max={new Date().toISOString().split('T')[0]}
                                                        onChange={(e) => {
                                                            setAbastecimientoDate(e.target.value);
                                                            setErrorFechaAbastecimiento("");
                                                        }}
                                                        onBlur={() => {
                                                            if (!abastecimientoDate) {
                                                                setErrorFechaAbastecimiento("El campo de fecha es obligatorio");
                                                            }
                                                            setShowAbastecimientoDateInput(false);
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => setShowAbastecimientoDateInput(true)}
                                                        className="input-fecha-placeholder-abastecimiento"
                                                    >
                                                        Fecha de abastecimiento *
                                                    </div>
                                                )}
                                                {errorFechaAbastecimiento && (
                                                    <p className="error-texto">{errorFechaAbastecimiento}</p>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="fila-formulario">
                                    <button
                                        type="button"
                                        className="btn-agregar-insumo"
                                        onClick={() => {
                                            setShowModal(true);
                                            setErrorInsumos("");
                                        }}
                                    >
                                        Agregar insumos al abastecimiento
                                    </button>
                                </div>
                                {errorInsumos && tocoValidar && (
                                    <p className="error-texto">{errorInsumos}</p>
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

                                <div className="button-container">
                                    <button type="button" className="btn-cancelar" onClick={closeCrearModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-crear">
                                        Crear abastecimiento
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
                                                        const ins = insumosDisponibles.find(
                                                            (i) => i.nombre === e.target.value
                                                        );
                                                        if (ins) {
                                                            setInsumoSeleccionado(ins.nombre);
                                                            setPrecioUnitario(ins.precio);
                                                            setErrorInsumoSeleccionado("");
                                                        } else {
                                                            setInsumoSeleccionado("");
                                                            setPrecioUnitario(0);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        setTocoValidarInsumo(true);
                                                        if (!insumoSeleccionado) {
                                                            setErrorInsumoSeleccionado("Debes seleccionar un insumo");
                                                        }
                                                    }}
                                                    className="input-select modal-input"
                                                >
                                                    <option value="">Insumo</option>
                                                    {insumosDisponibles.map((ins, index) => (
                                                        <option key={index} value={ins.nombre}>
                                                            {ins.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errorInsumoSeleccionado && tocoValidarInsumo && (
                                                    <p className="error-texto">{errorInsumoSeleccionado}</p>
                                                )}
                                            </div>

                                            <div className="campo">
                                                <input
                                                    type="number"
                                                    className="input-texto modal-input"
                                                    value={cantidad}
                                                    min="1"
                                                    onChange={(e) => {
                                                        const valor = parseInt(e.target.value);
                                                        setCantidad(valor);
                                                        if (valor >= 1) {
                                                            setErrorCantidad("");
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        setTocoValidarCantidad(true);
                                                        if (!cantidad || cantidad < 1) {
                                                            setErrorCantidad("Debes ingresar una cantidad válida");
                                                        }
                                                    }}
                                                    placeholder="Cantidad"
                                                />
                                                {errorCantidad && tocoValidarCantidad && (
                                                    <p className="error-texto">{errorCantidad}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="modal-botones">
                                            <button
                                                onClick={agregarInsumoAlModal}
                                                className="btn-agregar"
                                            >
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
                                                        {ins.nombre} x{" "}
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
                                            <button
                                                onClick={guardarInsumosDelModal}
                                                className="btn-crear"
                                            >
                                                Guardar insumos
                                            </button>
                                            <button
                                                onClick={cancelarModal}
                                                className="btn-cancelar"
                                            >
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

            {isVerModalOpen && abastecimientoSeleccionado && (
                <div className="overlay-popup" onClick={closeVerModal}>
                    <div className="ventana-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="contenido-popup2">
                            <h2 className="titulo-usuario">Detalle del abastecimiento</h2>
                            <div className="info-usuario">
                                <div className="fila-formulario">
                                    <p><strong>Manicurista:</strong> {abastecimientoSeleccionado.manicurista}</p>
                                    <p><strong>Fecha:</strong> {abastecimientoSeleccionado.fecha}</p>
                                </div>
                                <div>
                                    <p><strong>Estado:</strong> {abastecimientoSeleccionado.estado}</p>
                                </div>
                            </div>
                            <div className="tabla-liq">
                                <table className="liq-table">
                                    <thead>
                                        <tr>
                                            <th>Insumo</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{abastecimientoSeleccionado.insumo}</td>
                                            <td>{abastecimientoSeleccionado.cantidad}</td>
                                        </tr>
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
        </div>
    );
};

export default GestionAbastecimientos;