import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/formCuentas.css";

const Recuperar2 = () => {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const codigosValidos = ["123456", "654321", "000000"]; // Códigos válidos

  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = value;
    setCodigo(nuevoCodigo);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const validarCodigo = (e) => {
    e.preventDefault();

    const codigoCompleto = codigo.join("");

    if (codigoCompleto.length < 6) {
      setError("Debes ingresar los 6 dígitos");
      return;
    }

    if (!codigosValidos.includes(codigoCompleto)) {
      setError("Código incorrecto");
      return;
    }

    setError("");
    navigate("/reset-password");
  };

  return (
    <div className="container">
      <div className="left">
        <div className="header">
          <h2 className="animation a1">Ingresar código</h2>
          <h4 className="animation a2">Escribe el código que enviamos a tu correo</h4>
        </div>

        <form className="form" onSubmit={validarCodigo}>
          <div className="otp-container">
            {codigo.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                className="otp-input animation a3"
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <span className="error">{error}</span>
          
          <p className="animation a6">
            ¿No te llego el código?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Haz click aqui
            </span>
          </p>

          <button className="animation a6" type="submit">
            Verificar
          </button>
        </form>
      </div>

      <div className="right"></div>
    </div>
  );
};

export default Recuperar2;
