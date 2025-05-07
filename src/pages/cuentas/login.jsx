import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { login } from "../../services/auth_service"; // Importa la función de login

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadingMessage, setLoadingMessage] = useState(""); //no tengo idea de pq esa mierda tira error

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateFields = () => {
        const newErrors = {};

        if (!email) newErrors.email = "El correo es obligatorio";
        else if (!validateEmail(email)) newErrors.email = "Correo no válido";

        if (!password) newErrors.password = "La contraseña es obligatoria";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos

        if (!validateFields()) return;

        setLoadingMessage("Iniciando sesión...");
        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Espera un momento por favor',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const responseData = await login(email, password);
            Swal.close();
            console.log('Login exitoso:', responseData);

            // Guardar el token de acceso (y posiblemente el refresh token)
            localStorage.setItem('access_token', responseData.access);
            localStorage.setItem('refresh_token', responseData.refresh);
            localStorage.setItem('user_id', responseData.user_id);
            localStorage.setItem('username', responseData.username);
            localStorage.setItem('nombre', responseData.nombre);
            localStorage.setItem('apellido', responseData.apellido);
            localStorage.setItem('rol', responseData.rol);

            // Redireccionar según el rol
            switch (responseData.rol) {
                case "administrador":
                    navigate("/administrador/dashboard");
                    break;
                case "cliente":
                    navigate("/cliente");
                    break;
                case "manicurista":
                    navigate("/manicurista/dashboard");
                    break;
                case "recepcionista":
                    navigate("dashboard/recepcionista");
                    break;
                default:
                    navigate("/");
            }

        } catch (error) {
            Swal.close();
            console.error('Error al iniciar sesión:', error);
            setErrors({ general: error.message });
        } finally {
            setLoadingMessage("");
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="header">
                    <h2 className="animation a1">Candy Nails</h2>
                    <h4 className="animation a2">Ingresa tus datos para continuar</h4>
                </div>

                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Correo electrónico o nombre de usuario *"
                        className="form-field animation a3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateFields}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <div className="password-field-container animation a4">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña *"
                            className="form-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validateFields}
                        />
                        {password && (
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        )}
                    </div>
                    {errors.password && <span className="error">{errors.password}</span>}

                    {errors.general && <span className="error">{errors.general}</span>}

                    <p className="animation a6">
                        ¿No tienes cuenta?{" "}
                        <span onClick={() => navigate("/register")} className="link">
                            Registrate
                        </span>
                    </p>

                    <p className="animation a6">
                        ¿Olvidaste tu contraseña?{" "}
                        <span onClick={() => navigate("/requerir-codigo")} className="link">
                            Recuperala
                        </span>
                    </p>

                    <button type="submit" className="animation a6">Ingresar</button>
                </form>
            </div>

            <div className="right"></div>
        </div>
    );
};

export default Login;