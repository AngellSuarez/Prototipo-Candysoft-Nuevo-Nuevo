import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../css/perfil.css";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaLock, FaSave, FaArrowLeft, FaImage } from 'react-icons/fa';

const EditarPerfilMan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        nacimiento: '',
        contraseña: '',
        imagen: ''
    });

    useEffect(() => {
        const storedPerfil = JSON.parse(localStorage.getItem('perfil'));
        if (storedPerfil) setFormData(storedPerfil);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imagen: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        localStorage.setItem('perfil', JSON.stringify(formData));
        navigate('/manicurista/dashboard/perfil');
    };

    const handleCancelar = () => {
        navigate('/manicurista/dashboard/perfil');
    };

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <div className="perfil-header">
                    <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="Banner Perfil" />
                </div>

                <h1 className="titulo-perfil">Editar Perfil</h1>
                <p className="subtitulo-perfil">Modifica tu información personal</p>
                <hr className="linea" />

                <form className="perfil-formulario" onSubmit={handleGuardar}>
                    <div className="perfil-content">
                        <div className="datos-personal">
                            <div className="form-group">
                                <label><FaUser /> Nombre:</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label><FaEnvelope /> Correo electrónico:</label>
                                <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label><FaPhone /> Teléfono:</label>
                                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label><FaBirthdayCake /> Fecha de nacimiento:</label>
                                <input type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label><FaLock /> Contraseña:</label>
                                <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="perfil-imagen">
                            <img
                                src={formData.imagen || "https://cdn-icons-png.flaticon.com/512/2335/2335114.png"}
                                className="img-perfil"
                                alt="Perfil"
                            />
                            <label className="cambiar-imagen">
                                <FaImage /> Cambiar imagen
                                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                            </label>
                        </div>
                    </div>

                    <div className="botones-editar">
                        <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                            <FaArrowLeft /> Cancelar
                        </button>
                        <button type="submit" className="btn-crear">
                            <FaSave /> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarPerfilMan;
