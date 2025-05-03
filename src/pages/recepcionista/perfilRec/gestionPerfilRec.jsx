import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../css/perfil.css";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaLock, FaEdit } from 'react-icons/fa';
import { useTheme } from "../../tema/ThemeContext";

const PerfilRec = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [perfil, setPerfil] = useState({
        nombre: 'Elizabeth Apaza',
        correo: 'elizabeth23@gmail.com',
        telefono: '3023456765',
        nacimiento: '2006-05-23',
        contraseña: 'Apaza123',
        imagen: 'https://img.freepik.com/vetores-premium/recepcionista-feminina-na-recepcao-ilustracao-vetorial-de-estilo-plano_1142-109276.jpg?semt=ais_hybrid'
    });

    useEffect(() => {
        const storedPerfil = JSON.parse(localStorage.getItem('perfil'));
        if (storedPerfil) setPerfil(storedPerfil);
    }, []);

    const handleEditarPerfil = () => {
        navigate('/recepcionista/dashboard/perfil/editarPerfil');
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const { darkMode } = useTheme();

    return (
        <div className={`perfil-container ${darkMode ? "dark" : ""}`}>
            <div className="perfil-card">
                <div className="perfil-header">
                    <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="Banner Perfil" />
                </div>

                <h1 className="titulo-perfil">Mi Perfil</h1>
                <p className="subtitulo-perfil">Información personal</p>
                <hr className="linea" />

                <div className="perfil-content">
                    <div className="datos-personal">
                        <p><FaUser /> <strong>Nombre:</strong> {perfil.nombre}</p>
                        <p><FaEnvelope /> <strong>Correo electrónico:</strong> {perfil.correo}</p>
                        <p><FaPhone /> <strong>Teléfono:</strong> {perfil.telefono}</p>
                        <p><FaBirthdayCake /> <strong>Fecha de nacimiento:</strong> {perfil.nacimiento}</p>
                        <p>
                            <FaLock /> <strong>Contraseña:</strong> {showPassword ? perfil.contraseña : '********'}
                            <button 
                                style={{
                                    marginLeft: '10px',
                                    padding: '4px 8px',
                                    backgroundColor: '#fce4ec',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#8b2752',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={togglePassword}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>

                        </p>
                    </div>

                    <div className="perfil-imagen">
                        <img src={perfil.imagen} className="img-perfil" alt="Perfil" />
                    </div>
                </div>
                <button className="btn-crear" onClick={handleEditarPerfil}>
                    <FaEdit /> Editar Perfil
                </button>
            </div>
        </div>
    );
};

export default PerfilRec;
