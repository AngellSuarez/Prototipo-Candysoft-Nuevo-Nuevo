import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";

    if (!formData.email) newErrors.email = "El correo es obligatorio";
    else if (!validateEmail(formData.email)) newErrors.email = "Correo no válido";

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Debes confirmar la contraseña";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Tu cuenta ha sido creada correctamente.",
      showConfirmButton: false,
      timer: 2500,
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="container">
      <div className="left">
        <div className="header">
          <h2 className="animation a1">Candy Nails</h2>
          <h4 className="animation a2">Crea tu cuenta</h4>
        </div>

        <form className="form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre *"
            className="form-field animation a3"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}

          <input
            type="text"
            placeholder="Apellido *"
            className="form-field animation a4"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.apellido && <span className="error">{errors.apellido}</span>}

          <input
            type="email"
            placeholder="Correo electrónico *"
            className="form-field animation a5"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <div className="password-field-container animation a6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña *"
              className="form-field"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={validateFields}
            />
            {formData.password && (
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            )}
          </div>
          {errors.password && <span className="error">{errors.password}</span>}

          <div className="password-field-container animation a6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña *"
              className="form-field"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={validateFields}
            />
            {formData.confirmPassword && (
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            )}
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

          <p className="animation a6">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Inicia sesión
            </span>
          </p>

          <button type="submit" className="animation a6">
            Registrarse
          </button>
        </form>
      </div>

      <div className="right"></div>
    </div>
  );
};

export default Registro;
