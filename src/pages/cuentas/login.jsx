import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadingMessage, setLoadingMessage] = useState("");

    const usuariosFake = [
        { email: "leylygallego@gmail.com", password: "admin123", rol: "admin" },
        { email: "miguel.suarez@gmail.com", password: "cliente123", rol: "cliente" },
        { email: "paula@candy.com", password: "mani123", rol: "manicurista" },
        { email: "elizabeth23@gmail.com", password: "recep123", rol: "recepcionista" }
    ];

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

    const handleLogin = (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        const userFound = usuariosFake.find(
            (user) => user.email === email && user.password === password
        );

        if (!userFound) {
            setErrors({ general: "Correo o contraseña incorrectos" });
            return;
        }

        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Espera un momento por favor',
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            switch (userFound.rol) {
                case "admin":
                    navigate("/administrador/dashboard");
                    break;
                case "cliente":
                    navigate("/cliente");
                    break;
                case "manicurista":
                    navigate("/manicurista/dashboard");
                    break;
                case "recepcionista":
                    navigate("/recepcionista/dashboard");
                    break;
                default:
                    navigate("/");
            }
        });
    };

    return (
        <div className="container">
            <div className="left">
                <div className="header">
                    <h2 className="animation a1">Candy Nails</h2>
                    <h4 className="animation a2">Ingresa a tu cuenta para continuar</h4>
                </div>

                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Correo electrónico *"
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
                        <span onClick={() => navigate("/recuperacion-contraseña")} className="link">
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
