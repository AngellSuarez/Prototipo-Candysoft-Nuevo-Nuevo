import React, { useState, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import servicios from '../../data/servicio';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../../../css/crearcita.css";

const VerCita = () => {
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [menuMobile, setMenuMobile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showMenuServicio, setShowMenuServicio] = useState(false);
    const [subMenuServicio, setSubMenuServicio] = useState(null);
    const itemRefs = useRef({});
    const [submenuPosition, setSubmenuPosition] = useState(0);

    const subServicios = {
        Manicure: [
            { nombre: 'Semipermanente', id: '1' },
            { nombre: 'Tradicional', id: '2' },
            { nombre: 'Spa', id: '3' },
        ],
        Pedicure: [
            { nombre: 'Semipermanente', id: '4' },
            { nombre: 'Tradicional', id: '5' },
            { nombre: 'Spa', id: '6' },
        ],
        'Uñas en acrílico': [
            { nombre: 'Esculpidas', id: '7' },
            { nombre: 'Decoradas', id: '8' },
            { nombre: 'Francesas', id: '9' },
            { nombre: 'Uñas Baby Boomer', id: '10' },
        ],
    };

    const citas = [
        {
            fecha: '12/04/2025',
            hora: '3:00 PM',
            estado: 'Completada',
            sede: 'FLORESTA',
            direccion: 'Cra. 81 #27-50, Floresta',
            servicio: 'Manicure Semipermanente',
            duracion: '60 min',
            manicurista: 'Sofía Andrea Pérez Arroyave',
            total: 59900
        },
        {
            fecha: '15/04/2025',
            hora: '10:00 AM',
            estado: 'Pendiente',
            sede: 'FLORESTA',
            direccion: 'Cra. 81 #27-50, Floresta',
            servicio: 'Pedicure Tradicional',
            duracion: '45 min',
            manicurista: 'Laura Gómez',
            total: 49900
        },
        {
            fecha: '20/04/2025',
            hora: '2:30 PM',
            estado: 'Cancelada',
            sede: 'FLORESTA',
            direccion: 'Cra. 81 #27-50, Floresta',
            servicio: 'Francesas',
            duracion: '90 min',
            manicurista: 'Elizabeth Andrea Cardona Puerta',
            total: 69900
        },
    ];

    return (
        <>

            <nav className="nav-container">
                <div className="perfil-header">
                    <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="Logo" />
                    <button className="menu-toggle2" onClick={() => setMenuMobile(!menuMobile)}>
                        {menuMobile ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                <div className={`nav-menu ${menuMobile ? 'active' : ''}`}>
                    <Link to="/cliente" onClick={() => { setMenuMobile(false); }}>Inicio</Link>
                    <span>|</span>
                    <Link to="/cliente/Nosotros"  onClick={() => setMenuMobile(false)}>
                        Nosotros
                    </Link>
                    <span>|</span>

                    <div
                        className="acceso-wrapper"
                        onMouseEnter={() => !menuMobile && setShowMenuServicio(true)}
                        onMouseLeave={() => !menuMobile && setShowMenuServicio(false)}
                    >
                        <div className={`acceso-link ${showMenuServicio ? 'active' : ''}`}>
                            <Link
                                to="/cliente/servicios"
                                onClick={() => {
                                    setMenuMobile(false);
                                    setShowMenuServicio(!showMenuServicio);
                                }}
                            >
                                Servicios
                            </Link>
                            <span className={`flecha-acceso ${showMenuServicio ? 'rotate' : ''}`}>&#9660;</span>
                        </div>

                        <div className={`submenu-acceso ${showMenuServicio ? 'show' : ''}`}>
                            {Object.keys(subServicios).map((servicio) => (
                                <div
                                    key={servicio}
                                    className={`submenu-item-acceso ${subMenuServicio === servicio ? 'active' : ''}`}
                                    ref={(el) => (itemRefs.current[servicio] = el)}
                                    onClick={() =>
                                        subMenuServicio === servicio
                                            ? setSubMenuServicio(null)
                                            : setSubMenuServicio(servicio)
                                    }
                                >
                                    {servicio}
                                    {subMenuServicio === servicio && (
                                        <div className="sub-submenu-acceso" style={{ top: submenuPosition }}>
                                            {subServicios[servicio].map((sub) => (
                                                <div
                                                    key={sub.nombre}
                                                    className="submenu-item-acceso"
                                                    onClick={() => {
                                                        navigate(`/cliente/servicios/${sub.id}`);
                                                        setShowMenuServicio(false);
                                                        setSubMenuServicio(null);
                                                    }}
                                                >
                                                    {sub.nombre}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    <span>|</span>
                    <Link to="/cliente/calificanos" onClick={() => setMenuMobile(false)}>
                        Califícanos
                    </Link>
                    <span>|</span>

                    <div
                        className="acceso-wrapper"
                        onMouseEnter={() => !menuMobile && setShowMenu(true)}
                        onMouseLeave={() => !menuMobile && setShowMenu(false)}
                        onClick={() => menuMobile && setShowMenu(!showMenu)}
                    >
                        <div className={`acceso-link ${showMenu ? 'active' : ''}`}>
                            <a onClick={() => { setMenuMobile(false); }}>Miguel</a>
                            <span className={`flecha-acceso ${showMenu ? 'rotate' : ''}`}>&#9660;</span>
                        </div>

                        <div className={`submenu-acceso ${showMenu ? 'show' : ''}`}>
                            <div className="submenu-item-acceso" onClick={() => { setMenuMobile(false); navigate('/cliente/perfil'); }}>
                                Perfil
                            </div>
                            <div className="submenu-item-acceso" onClick={() => { setMenuMobile(false); navigate('/cliente/citas/ver'); }}>
                                Ver mis citas
                            </div>
                            <div
                                className="submenu-item-acceso"
                                onClick={() => {
                                    Swal.fire({
                                        title: '¿Estás seguro?',
                                        text: "¿Quieres cerrar sesión?",
                                        icon: 'warning',
                                        showCancelButton: true,
                                        reverseButtons: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Sí, cerrar sesión',
                                        cancelButtonText: 'Cancelar'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            navigate('/');
                                        }
                                    });
                                }}
                            >
                                Cerrar sesión
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='ver-cita-layout'>
                <div className='ver-cita-lista'>
                    <h2 className='ver-cita-title'>Mis Citas</h2>

                    {citas.map((cita, index) => (
                        <div
                            key={index}
                            className='ver-cita-card'
                            onClick={() => setCitaSeleccionada(cita)}
                            style={{ cursor: "pointer" }}
                            title='Dale click para ver mas detalles de la cita'
                        >
                            <p><strong>Fecha:</strong> {cita.fecha}</p>
                            <p><strong>Hora:</strong> {cita.hora}</p>
                            <p><strong>Estado:</strong> <span className={`estado ${cita.estado.toLowerCase()}`}>{cita.estado}</span></p>
                        </div>
                    ))}
                </div>

                <div className='ver-cita-imagen-fixed'>
                    <img src="https://hips.hearstapps.com/hmg-prod/images/granate-66a8d5b63adf4.jpg?resize=980:*" alt="Imagen cita" />
                </div>
            </div>

            {citaSeleccionada && (
                <div className="modal-overlay-cita" onClick={() => setCitaSeleccionada(null)}>
                    <div className="modal-content-cita" onClick={(e) => e.stopPropagation()}>
                        <h2>{citaSeleccionada.sede}</h2>
                        <p>{citaSeleccionada.direccion}</p>

                        <span className="badge-cita">Información principal:</span>

                        <div className='fila-formulario'>
                            <p><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                            <p><strong>Hora:</strong> {citaSeleccionada.hora}</p>
                        </div>

                        <div className="servicio-info-cita">
                            <span className="badge-cita">Servicios seleccionados:</span>
                            <p><strong>{citaSeleccionada.servicio}</strong></p>
                            <p>{citaSeleccionada.duracion}</p>
                        </div>

                        <hr />

                        <div className="responsable-cita">
                            <span className="responsable-label-cita">Reserva a cargo de:</span>
                            <p>💅 {citaSeleccionada.manicurista}</p>
                        </div>

                        <div className="total-cita">
                            <span>Total</span>
                            <span>${citaSeleccionada.total.toLocaleString()}</span>
                        </div>

                        <button className="cerrar-modal-cita" onClick={() => setCitaSeleccionada(null)}>Cerrar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VerCita;
