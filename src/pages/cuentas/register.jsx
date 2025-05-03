import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { register } from "../../services/auth_service"; // Importa la función de registro

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipo_documento: "CC", // Valor por defecto
    numero_documento: "",
    celular: "",
    username: "", // Necesario para el registro
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tiposDocumento = ["CC", "CE", "TI", "RC", "PA"];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.username) newErrors.username = "El nombre de usuario es obligatorio";
    if (!formData.tipo_documento) newErrors.tipo_documento = "El tipo de documento es obligatorio";
    if (!formData.numero_documento) newErrors.numero_documento = "El número de documento es obligatorio";
    if (!formData.celular) newErrors.celular = "El número de celular es obligatorio";

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    Swal.fire({
      title: 'Registrando...',
      text: 'Espera un momento por favor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const responseData = await register(
        formData.username,
        formData.password,
        formData.nombre,
        formData.apellido,
        formData.tipo_documento,
        formData.numero_documento,
        formData.email,
        formData.celular
      );
      Swal.close();
      console.log('Registro exitoso:', responseData);
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
    } catch (error) {
      Swal.close();
      console.error('Error al registrarse:', error);
      setErrors({ general: error.message });
    }
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
            placeholder="Nombre de usuario *"
            className="form-field animation a3"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.username && <span className="error">{errors.username}</span>}

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

          <select
            className="form-field animation a4"
            name="tipo_documento"
            value={formData.tipo_documento}
            onChange={handleChange}
          >
            {tiposDocumento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipo_documento && <span className="error">{errors.tipo_documento}</span>}

          <input
            type="text"
            placeholder="Número de documento *"
            className="form-field animation a4"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.numero_documento && <span className="error">{errors.numero_documento}</span>}

          <input
            type="text"
            placeholder="Celular *"
            className="form-field animation a4"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            onBlur={validateFields}
          />
          {errors.celular && <span className="error">{errors.celular}</span>}

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