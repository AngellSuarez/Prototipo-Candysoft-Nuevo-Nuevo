import React, { useState, useRef } from 'react';
import '../../../css/perfil.css';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import servicios from '../../data/servicio';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientePerfil = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [cliente, setCliente] = useState({
        nombre: 'Miguel',
        apellido: 'Cardona',
        tipoDocumento: 'C.C',
        documento: '1013421345',
        correo: 'miguel@candy.com',
        celular: '3123456534'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => setIsEditing(prev => !prev);

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
                    <Link to="/cliente/Nosotros" onClick={() => setMenuMobile(false)}>
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

            <div className="perfil-cliente-container">
                <div className="perfil-cliente-imagen">
                    <img src="https://i.pinimg.com/originals/4a/0c/af/4a0caf8a8e5c9ac676d601b81a572063.png" alt="Cliente" />
                </div>
                <div className="perfil-cliente-info">
                    <h1>Mi Perfil</h1>
                    <p>Aquí podrás ver y editar tú información.</p>

                    <form className="perfil-cliente-form">
                        <div className="perfil-cliente-campo">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={cliente.nombre}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="perfil-cliente-campo">
                            <label>Apellido:</label>
                            <input
                                type="text"
                                name="apellido"
                                value={cliente.apellido}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="perfil-cliente-campo">
                            <label>Tipo de Documento:</label>
                            <input
                                type="text"
                                name="tipoDocumento"
                                value={cliente.tipoDocumento}
                                disabled
                            />
                        </div>
                        <div className="perfil-cliente-campo">
                            <label>Documento:</label>
                            <input
                                type="text"
                                name="documento"
                                value={cliente.documento}
                                disabled
                            />
                        </div>
                        <div className="perfil-cliente-campo">
                            <label>Correo:</label>
                            <input
                                type="email"
                                name="correo"
                                value={cliente.correo}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="perfil-cliente-campo">
                            <label>Celular:</label>
                            <input
                                type="text"
                                name="celular"
                                value={cliente.celular}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <button type="button" className="perfil-cliente-boton" onClick={toggleEdit}>
                            {isEditing ? 'Guardar' : 'Editar'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ClientePerfil;
