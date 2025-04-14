import React, { useState } from 'react';
import '../../../css/calificacion.css';
import { FaCamera, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Calificacion = () => {
    const [selectedIcon, setSelectedIcon] = useState(null);
    const navigate = useNavigate();

    const icons = [
        { id: 1, emoji: '😀', label: 'Muy Bien' },
        { id: 2, emoji: '🙂', label: 'Bien' },
        { id: 3, emoji: '🙁', label: 'Mal' },
        { id: 4, emoji: '☹️', label: 'Muy Mal' },
    ];

    return (
        <div className="container-califi">
            <div className="header-califi">
                <img src="https://i.pinimg.com/736x/ab/dd/f1/abddf13749e496af6b9bfc5f5bec55e4.jpg" alt="Logo" />
            </div>


            <div className="content-califi">
                <h2 className='texto-califi'>Califícanos y escribe tus comentarios en el siguiente recuadro</h2>

                <hr className='califi' />

                <h3 className='califi-h3'>Amabilidad y profesionalismo del personal</h3>

                <div className="icons">
                    {icons.map((icon) => (
                        <span
                            key={icon.id}
                            className={`icon-item ${selectedIcon === icon.id ? 'active' : ''}`}
                            onClick={() => setSelectedIcon(icon.id)}
                            title={icon.label}
                        >
                            {icon.emoji}
                        </span>
                    ))}
                </div>

                <input
                    type="text"
                    className='input-califi'
                    placeholder="Escribe aquí tu comentario..."
                />

                <div className="buttons-califi">
                    <button><FaCamera /></button>
                    <button><FaImage /></button>
                </div>

                <div className='button-container'>
                    <button onClick={() => navigate('/cliente')} className='btn-cancelar'>Cancelar</button>
                    <button onClick={() => navigate('/cliente')} className='btn-crear'>Enviar</button>
                </div>


            </div>
        </div>
    );
};

export default Calificacion;
