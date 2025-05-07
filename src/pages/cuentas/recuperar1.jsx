import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../css/formCuentas.css";
import {solicitar_codigo_recuperacion} from '../../services/auth_service'

const Recuperar1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "El correo es obligatorio";
    else if (!validateEmail(formData.email)) newErrors.email = "Correo no válido";

    if (!formData.confirmEmail) newErrors.confirmEmail = "Confirma tu correo";
    else if (formData.email !== formData.confirmEmail)
      newErrors.confirmEmail = "Los correos no coinciden";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const irRestaurar = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    try{
      await solicitar_codigo_recuperacion(formData.email);

      Swal.fire({
        icon: "success",
        title: "Correo validado",
        text:"El codigo de recuperación se envio a su correo",
      }).then(()=>{
        navigate("/recuperar-password",{state: {correo: formData.email}});
      });
    }catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Error al solicitar el codigo',
        text: error.message || 'Occurrio un error inesperado',
      });
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="header">
          <h2 className="animation a1">Recuperar contraseña</h2>
          <h4 className="animation a2">Ingresa tu correo para restablecer tu contraseña</h4>
        </div>
        <form className="form" onSubmit={irRestaurar}>
          <input
            type="email"
            placeholder="Correo electrónico *"
            className="form-field animation a3"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={validateFields}
          />
          <span className="error">{errors.email || ""}</span>

          <input
            type="email"
            placeholder="Confirmar correo *"
            className="form-field animation a4"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            onBlur={validateFields}
          />
          <span className="error">{errors.confirmEmail || ""}</span>

          <p className="animation a6">
            ¿La recordaste?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Inicia sesión
            </span>
          </p>

          <button className="animation a6" type="submit">
            Recuperar
          </button>
        </form>
      </div>
      <div className="right"></div>
    </div>
  );
};

export default Recuperar1;
