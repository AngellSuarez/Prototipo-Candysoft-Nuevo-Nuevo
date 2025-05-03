import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Recuperar3 = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validar = () => {
        const newErrors = {};

        if (!password) newErrors.password = "La contraseña es obligatoria";
        else if (password.length < 8) newErrors.password = "Debe tener al menos 8 caracteres";

        if (!confirmPassword) newErrors.confirmPassword = "Confirma tu contraseña";
        else if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validar()) {
            Swal.fire({
                icon: "success",
                title: "¡Contraseña actualizada correctamente!",
                text: "Redirigiendo a inicio de sesión",
                showConfirmButton: false,
                timer: 2500,
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="header">
                    <h2 className="animation a1">Restablecer contraseña</h2>
                    <h4 className="animation a2">Ingresa tu nueva contraseña</h4>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="password-field-container animation a3">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nueva contraseña *"
                            className="form-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validar}
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

                    <div className="password-field-container animation a4">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña *"
                            className="form-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={validar}
                        />
                        {confirmPassword && (
                            <span
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        )}
                    </div>
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                    <button className="animation a6" type="submit">
                        Guardar
                    </button>
                </form>
            </div>

            <div className="right"></div>
        </div>
    );
};

export default Recuperar3;
