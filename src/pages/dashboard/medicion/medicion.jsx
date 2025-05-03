import React, { useState } from "react";
import { FaHandsHelping, FaStar, FaChartLine, FaRegCalendarCheck, FaUsers, FaUserCog, FaBoxOpen } from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import "../../../css/medicion.css";
import { useTheme } from "../../tema/ThemeContext";
import { Link } from "react-router-dom";
import { Bell, User } from 'lucide-react';

const serviciosDia = [
  { name: "Ana", servicios: 3 },
  { name: "Martha", servicios: 4 },
  { name: "Gloria", servicios: 5 },
];

const serviciosMes = [
  {
    name: "Semipermanente",
    ventas: 50,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9kpi0s0nz3Nfq-bY03z06IO0el_FnMqgicw&s",
  },
  {
    name: "Acrílicas",
    ventas: 30,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3IQB66iPilDuZOLxoyKLMg8M-3DySUAvOg&s",
  },
  {
    name: "Tradicional",
    ventas: 20,
    img: "https://i.pinimg.com/236x/64/30/17/6430174cfdd3f32ae4d1e7fbad0ab23c.jpg",
  },
];

const gananciasMes = [
  { name: "Efectivo", value: 2500000 },
  { name: "Tarjeta", value: 1500000 },
];

const COLORS = ["#f06292", "#ab47bc"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: "0.75rem",
        fontWeight: "500",
      }}
    >
      ${value.toLocaleString("es-CO")}
    </text>
  );
};

const citasSemana = [
  { name: "Lunes", citas: 8 },
  { name: "Martes", citas: 12 },
  { name: "Miércoles", citas: 10 },
  { name: "Jueves", citas: 7 },
  { name: "Viernes", citas: 15 },
  { name: "Sábado", citas: 20 },
  { name: "Domingo", citas: 5 },
];

const clientesTop = [
  { nombre: "María Pérez", citas: 15 },
  { nombre: "Carlos Ramírez", citas: 12 },
  { nombre: "Ana Gómez", citas: 10 },
  { nombre: "Luis Torres", citas: 8 },
];

const abastecimientosRecientes = [
  { nombre: "Martha", insumo: "Esmalte Rojo", fecha: "04 Abril 2025" },
  { nombre: "Ana", insumo: "Lima Nueva", fecha: "03 Abril 2025" },
  { nombre: "Gloria", insumo: "Gel UV", fecha: "02 Abril 2025" },
];

const topAbastecimientos = [
  { nombre: "Martha", pedidos: 10 },
  { nombre: "Ana", pedidos: 8 },
  { nombre: "Gloria", pedidos: 5 },
];


const Medicion = () => {
  const [isNotificacionesModalOpen, setIsNotificacionesModalOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: "Nueva novedad creada por Paula. Cambio en el horario de ingreso" },
    { id: 2, mensaje: "Se ha agendado una cita para el 03/05/2025." }
  ]);

  const openNotificacionesModal = () => setIsNotificacionesModalOpen(true);
  const closeNotificacionesModal = () => setIsNotificacionesModalOpen(false);
  const { darkMode } = useTheme();
  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <div className="fila-formulario">
        <h1 className="titulo">Gestión dashboard</h1>

        <div className="iconos-perfil">
          <div className="bell-container" onClick={openNotificacionesModal}>
            <span title="Ver tus notificaciones">
              <Bell className="icon" />
            </span>
            {notificaciones.length > 0 && (
              <span className="notification-badge" title="Ver tus notificaciones">
                {notificaciones.length > 99 ? "99+" : notificaciones.length}
              </span>
            )}
          </div>

          <Link to="/administrador/dashboard/perfil">
            <span title="Tú perfil">
              <User className="icon" />
            </span>
          </Link>

        </div>
      </div>
      <div className="dashboard-grid">
        <div className="card combined-card">
          <div className="combined-content ">
            <div className="left-section highlight-card">
              <h3>Ganancia Total De La Semana</h3>
              <p className="amount">$4.000.000</p>
              <span className="date-range">01 - 07 Marzo, 2025</span>
            </div>

            <div className="right-section">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gananciasMes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {gananciasMes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString("es-CO")}`} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>


        <div className="card chart-card">
          <div className="card-title">
            <h3>Servicios del Día por Manicurista</h3>
            <FaHandsHelping className="icon" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviciosDia} barSize={30}>
              <XAxis dataKey="name" tick={{ fill: "#888" }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="servicios" fill="#f06292" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-title">
            <h3>Servicios más Vendidos del Mes</h3>
            <FaStar className="icon" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviciosMes} barSize={30}>
              <XAxis dataKey="name" tick={{ fill: "#888" }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#ab47bc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card ">
          <div className="card-title ">
            <h3>Nuevos servicios</h3>
            <FaChartLine className="icon" />
          </div>
          <ul className="detail-list">
            {serviciosMes.map((servicio, idx) => (
              <li key={idx} className="detail-item">
                <div className="detail-info">
                  <img
                    src={servicio.img}
                    alt={servicio.name}
                    className="service-img"
                  />
                  <span className="service-name">{servicio.name}</span>
                </div>
                <span className="service-ventas">Nuevo</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card  detail-card">
          <div className="card-title">
            <h3>Clientes con Más Citas</h3>
            <FaUsers className="icon" />
          </div>

          <table className="detail-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Citas</th>
              </tr>
            </thead>
            <tbody>
              {clientesTop.map((cliente, index) => (
                <tr key={index}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.citas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card combined-card chart-card2">
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

        <div className="card detail-card">
          <div className="card-title">
            <h3>Últimos Abastecimientos</h3>
            <FaBoxOpen className="icon" />
          </div>
          <ul className="detail-list">
            {abastecimientosRecientes.map((item, idx) => (
              <li key={idx} className="detail-item">
                <span>{item.nombre} pidió {item.insumo}</span>
                <span className="date">{item.fecha}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card detail-card">
          <div className="card-title">
            <h3>Top Manicuristas por Abastecimientos</h3>
            <FaUserCog className="icon" />
          </div>

          <table className="detail-table">
            <thead>
              <tr>
                <th>Manicurista</th>
                <th>Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {topAbastecimientos.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.pedidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isNotificacionesModalOpen && (
          <div className="overlay-popup" onClick={closeNotificacionesModal}>
            <div className="ventana-popup max-h-[300vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="contenido-popup2">
                <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
                {notificaciones.length === 0 ? (
                  <div className="p-3 bg-gray-100 rounded-lg shadow">No tienes notificaciones nuevas.</div>
                ) : (
                  <ul className="space-y-2">
                    {notificaciones.map((n) => (
                      <li key={n.id} className="p-3 bg-white border rounded-lg shadow noti">
                        {n.mensaje}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="button-container">
                  <button className="btn-cancelar" onClick={closeNotificacionesModal}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicion;
