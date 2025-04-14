import React from "react";
import {
  FaStar,
  FaFileInvoiceDollar,
  FaExclamationTriangle,
  FaBoxOpen,
  FaRegCalendarCheck
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../../css/medicion.css";

const novedades = [
  { tipo: "Retraso", detalle: "Llegaré 30 minutos tarde", fecha: "08 Abril 2025" },
  { tipo: "Ausencia", detalle: "No asistiré por cita médica", fecha: "06 Abril 2025" },
];

const serviciosSemana = [
  { servicio: "Semipermanente", cantidad: 12 },
  { servicio: "Acrílicas", cantidad: 7 },
  { servicio: "Tradicional", cantidad: 4 },
];

const liquidaciones = [
  { fecha: "01 Abril 2025", valor: 400000 },
  { fecha: "25 Marzo 2025", valor: 350000 },
];

const consumos = [
  { insumo: "Esmalte Rojo", cantidad: 2, estadoInsumo: "Disponible", fecha: "03 Abril 2025" },
  { insumo: "Lima Nueva", cantidad: 1, estadoInsumo: "Agotado", fecha: "05 Abril 2025" },
];

const citasSemana = [
  { name: "Lunes", citas: 8 },
  { name: "Martes", citas: 12 },
  { name: "Miércoles", citas: 10 },
  { name: "Jueves", citas: 7 },
  { name: "Viernes", citas: 15 },
  { name: "Sábado", citas: 20 },
  { name: "Domingo", citas: 5 },
];

const MedicionManicurista = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* NOVEDADES */}
        <div className="card chart-card">
          <div className="card-title">
            <h3>Mis Novedades</h3>
            <FaExclamationTriangle className="icon" />
          </div>
          <div className="timeline">
            {novedades.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-icon">
                  {item.tipo === "Retraso" ? <FaRegCalendarCheck /> : <FaExclamationTriangle />}
                </div>
                <div className="timeline-content">
                  <strong>{item.tipo}</strong>
                  <p>{item.detalle}</p>
                  <span className="date">{item.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICIOS MÁS REALIZADOS SEMANA */}
        <div className="card chart-card">
          <div className="card-title">
            <h3>Servicios que más realice (Semana)</h3>
            <FaStar className="icon" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviciosSemana} barSize={30}>
              <XAxis dataKey="servicio" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#ab47bc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LIQUIDACIONES */}
        <div className="card detail-card">
          <div className="card-title">
            <h3>Mis liquidaciones</h3>
            <FaFileInvoiceDollar className="icon" />
          </div>
          <ul className="detail-list">
            {liquidaciones.map((liq, idx) => (
              <li key={idx} className="detail-item">
                <span>Liquidación</span>
                <span className="amount">${liq.valor.toLocaleString("es-CO")}</span>
                <span className="date">{liq.fecha}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CONSUMOS */}
        <div className="card detail-card">
          <div className="card-title">
            <h3>Consumos Reportados</h3>
            <FaBoxOpen className="icon" />
          </div>
          <table className="detail-table">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {consumos.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.insumo}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.estadoInsumo}</td>
                  <td>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card chart-card2">
          <div className="card-title">
            <h3>Citas de la Semana</h3>
            <FaRegCalendarCheck className="icon" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={citasSemana} barSize={30}>
              <XAxis dataKey="name" tick={{ fill: "#888" }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} citas`} />
              <Bar dataKey="citas" fill="#4db6ac" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default MedicionManicurista;
