import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/crearcita.css';

const CrearCita = () => {
    const [categoriaActiva, setCategoriaActiva] = useState(null);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
    const [paso, setPaso] = useState(1);
    const [manicuristaSeleccionada, setManicuristaSeleccionada] = useState(null);
    const [fechaReserva, setFechaReserva] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState("");

    const servicios = {
        Manicure: [
            { nombre: 'Manicure Semipermanente', precio: 59900 },
            { nombre: 'Manicure tradicional', precio: 67900 },
            { nombre: 'Manicure spa', precio: 31900 },
        ],
        Pedicure: [
            { nombre: 'Pedicure Semipermanente', precio: 49900 },
            { nombre: 'Pedicure Tradicional', precio: 39900 },
            { nombre: 'Pedicure Spa', precio: 49900 },
        ],
        'Uñas acrílicas': [
            { nombre: 'Esculpidas', precio: 69900 },
            { nombre: 'Decoradas', precio: 80900 },
            { nombre: 'Francesas', precio: 70900 },
            { nombre: 'Uñas Baby Boomer', precio: 52900 },
        ],
    };

    const manicuristas = [
        "Sofia Andrea Pérez Arroyave",
        "Mónica Tatiana Sánchez Sepulveda",
        "Carla María Muñoz Ciro",
        "María Angela Gutierrez Osorio",
        "Elizabeth Andrea Cardona Puerta",
    ];

    const toggleCategoria = (index) => {
        setCategoriaActiva(categoriaActiva === index ? null : index);
    };

    const toggleServicio = (servicio) => {
        const existe = serviciosSeleccionados.find(s => s.nombre === servicio.nombre);
        setServiciosSeleccionados(existe
            ? serviciosSeleccionados.filter(s => s.nombre !== servicio.nombre)
            : [...serviciosSeleccionados, servicio]);
    };

    const total = serviciosSeleccionados.reduce((acc, item) => acc + item.precio, 0);

    const handleContinuar = () => {
        if (paso === 1 && serviciosSeleccionados.length === 0) {
            return Swal.fire('Selecciona al menos un servicio', '', 'warning');
        }

        if (paso === 2 && !manicuristaSeleccionada) {
            return Swal.fire('Selecciona una manicurista', '', 'warning');
        }

        if (paso === 3 && (!fechaReserva || !horaSeleccionada)) {
            return Swal.fire('Selecciona una fecha y una hora', '', 'warning');
        }

        setPaso(paso + 1);
    };

    const handleRegresar = () => {
        if (paso === 1) {
            window.location.href = "/cliente/servicios";
        } else {
            setPaso(paso - 1);
        }
    };

    return (
        <div className="citas-cliente-layout">
            <div className="citas-cliente-left">
                <div className="citas-cliente-btn-container">
                    <button className="citas-cliente-btn citas-cliente-back" onClick={handleRegresar}>
                        Regresar
                    </button>
                    {paso < 4 && (
                        <button className="citas-cliente-btn citas-cliente-next" onClick={handleContinuar}>
                            Continuar
                        </button>
                    )}
                </div>

                <div className="citas-cliente-sede">
                    {serviciosSeleccionados.length === 0 ? (
                        <p>Todavía no hay servicios seleccionados.</p>
                    ) : (
                        <div>
                            <h4 style={{
                                backgroundColor: "#fdd8e7",
                                borderRadius: "999px",
                                padding: "5px 15px",
                                display: "inline-block",
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "#7e2952",
                                marginBottom: "10px"
                            }}>
                                Servicios seleccionados:
                            </h4>
                            {serviciosSeleccionados.map((s, idx) => (
                                <div key={idx} className="servicio-seleccionado-item">
                                    <div className="servicio-seleccionado-header">
                                        <div className="servicio-seleccionado-nombre">{s.nombre}</div>
                                        <div className="servicio-seleccionado-precio">${s.precio.toLocaleString()}</div>
                                    </div>
                                    <div className="servicio-seleccionado-duracion">60 min</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <h4 style={{
                    backgroundColor: "#fdd8e7",
                    borderRadius: "999px",
                    padding: "5px 15px",
                    display: "inline-block",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#7e2952",
                    marginBottom: "10px",
                    marginTop: "20px",
                    textAlign: "center",
                }}>
                    Reserva a cargo de:
                </h4>
                {manicuristaSeleccionada ? (
                    <div
                        className="resumen-manicurista"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '15px',
                            color: '#0f0f0f',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}
                    >
                        <span role="img" aria-label="user">👤</span> {manicuristaSeleccionada}
                    </div>
                ) : (
                    <p
                        style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            marginTop: '10px',
                            color: '#0f0f0f'
                        }}
                    >
                        Aún no has seleccionado una manicurista.
                    </p>
                )}
                <h4 style={{
                    backgroundColor: "#fdd8e7",
                    borderRadius: "999px",
                    padding: "5px 15px",
                    display: "inline-block",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#7e2952",
                    marginBottom: "10px",
                    marginTop: "20px",
                    textAlign: "center",
                }}>
                    Fecha de la reserva:
                </h4>

                {fechaReserva && horaSeleccionada ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <span role="img" aria-label="calendar" style={{ fontSize: '20px', marginBottom: '5px' }}>📅</span>
                        <p style={{
                            fontSize: '14px',
                            color: '#0f0f0f',
                            textAlign: 'center',
                            margin: 0,
                            borderBottom: '1px solid #fdd8e7',
                            paddingBottom: '5px',
                            width: '100%'
                        }}>
                            {fechaReserva?.toLocaleDateString()} desde {horaSeleccionada}
                        </p>
                    </div>
                ) : (
                    <p style={{
                        fontSize: '16px',
                        color: '#0f0f0f',
                        textAlign: 'center',
                        marginBottom: '20px'
                    }}>
                        Aún no has seleccionado fecha y hora.
                    </p>
                )}

                <div className="citas-cliente-total">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                </div>
            </div>

            <div className="citas-cliente-right">
                {paso === 1 && (
                    <>
                        {Object.keys(servicios).map((categoria, index) => (
                            <div key={index} className="citas-cliente-categoria">
                                <div className="citas-cliente-categoria-header" onClick={() => toggleCategoria(index)}>
                                    <h3>{categoria}</h3>
                                    <span>{categoriaActiva === index ? '▲' : '▼'}</span>
                                </div>
                                {categoriaActiva === index && (
                                    <div className="citas-cliente-servicios">
                                        {servicios[categoria].map((servicio, idx) => (
                                            <div key={idx} className="citas-cliente-servicio-item">
                                                <div className="citas-cliente-servicio-info">
                                                    <div>{servicio.nombre}</div>
                                                    <div>${servicio.precio.toLocaleString()}</div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={serviciosSeleccionados.some(s => s.nombre === servicio.nombre)}
                                                    onChange={() => toggleServicio(servicio)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {paso === 2 && (
                    <div className="citas-cliente-manicuristas">
                        {["Según la disponibilidad", ...manicuristas].map((nombre, idx) => (
                            <div
                                key={idx}
                                className={`citas-cliente-manicurista-item ${manicuristaSeleccionada === nombre ? 'seleccionada' : ''}`}
                                onClick={() => setManicuristaSeleccionada(nombre)}
                            >
                                {manicuristaSeleccionada === nombre ? (
                                    <span className="check-circle">✔</span>
                                ) : (
                                    <span className="empty-circle"></span>
                                )}
                                <span>{nombre}</span>
                            </div>
                        ))}
                    </div>
                )}

                {paso === 3 && (
                    <div className="citas-cliente-paso3">
                        <h3>Elige la fecha y hora para tu cita</h3>
                        <div className="fecha-reserva-container">
                            <label htmlFor="fechaReserva" className="fecha-label">Selecciona una fecha:</label>
                            <DatePicker
                                selected={fechaReserva}
                                onChange={(date) => setFechaReserva(date)}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Selecciona una fecha"
                                className="input-fecha-cita"
                            />
                        </div>
                        {fechaReserva && (
                            <div className="horas-disponibles-container">
                                {[
                                    "12:00 p.m. - 1:00 p.m.",
                                    "12:15 p.m. - 1:15 p.m.",
                                    "12:30 p.m. - 1:30 p.m.",
                                    "12:45 p.m. - 1:45 p.m.",
                                    "1:15 p.m. - 2:15 p.m.",
                                    "1:30 p.m. - 2:30 p.m.",
                                    "1:45 p.m. - 2:45 p.m.",
                                    "2:45 p.m. - 3:45 p.m.",
                                    "3:00 p.m. - 4:00 p.m.",
                                    "3:15 p.m. - 4:15 p.m.",
                                    "3:30 p.m. - 4:30 p.m.",
                                    "3:45 p.m. - 4:45 p.m."
                                ].map((hora, idx) => (
                                    <button
                                        key={idx}
                                        className={`hora-btn ${horaSeleccionada === hora ? 'seleccionada' : ''}`}
                                        onClick={() => setHoraSeleccionada(hora)}
                                    >
                                        {hora}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {paso === 4 && (
                    <div
                        style={{
                            backgroundColor: "#fff0f6",
                            padding: "25px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            maxWidth: "500px",
                            margin: "0 auto",
                            textAlign: "left",
                            fontFamily: "Arial, sans-serif",
                            color: "#333"
                        }}
                    >
                        <h4
                            style={{
                                fontSize: "22px",
                                marginBottom: "20px",
                                textAlign: "center",
                                color: "#7e2952"
                            }}
                        >
                            ✨ Revisa y confirma tu cita
                        </h4>

                        <p><strong>📋 Servicios:</strong> {serviciosSeleccionados.map(s => s.nombre).join(', ')}</p>
                        <p><strong>👩‍🎨 Manicurista:</strong> {manicuristaSeleccionada}</p>
                        <p><strong>📅 Fecha:</strong> {fechaReserva?.toLocaleDateString()}</p>
                        <p><strong>🕒 Hora:</strong> {horaSeleccionada}</p>
                        <p style={{ fontWeight: "bold", fontSize: "16px", marginTop: "20px" }}>
                            💰 Total: <span style={{ color: "#7e2952" }}>${total.toLocaleString()}</span>
                        </p>

                        <div style={{ textAlign: "center", marginTop: "30px" }}>
                            <button
                                className="btn-confirmar-cita"
                                style={{
                                    backgroundColor: "#7e2952",
                                    border: "none",
                                    borderRadius: "20px",
                                    padding: "12px 30px",
                                    color: "#fff",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    transition: "background 0.3s ease"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#571e39'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#7e2952'}
                                onClick={() => {
                                    Swal.fire({
                                        title: '¡Cita reservada!',
                                        text: 'Tu cita ha sido confirmada exitosamente 🎉',
                                        icon: 'success',
                                        confirmButtonText: 'Ver mis citas',
                                        confirmButtonColor: '#7e2952'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            window.location.href = '/cliente/citas/ver';
                                        }
                                    });
                                }}
                            >
                                Confirmar Cita
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CrearCita;
