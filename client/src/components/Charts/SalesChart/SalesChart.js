import React, { useEffect, useState, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SalesChart = ({ onDataUpdate }) => {
  const [salesData, setSalesData] = useState([]);
  const { token } = useContext(AuthContext); // Obtenemos el token del contexto de autenticación

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/ventas/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const ventas = response.data;

        // Crear rango de fechas y agrupar ventas
        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        const ventasPorDia = {};
        ventas.forEach((venta) => {
          const ventaFecha = new Date(venta.fecha).toISOString().split('T')[0];
          if (last30Days.includes(ventaFecha)) {
            ventasPorDia[ventaFecha] = (ventasPorDia[ventaFecha] || 0) + 1;
          }
        });

        const cantidadesPorDia = last30Days.map((fecha) => ventasPorDia[fecha] || 0);
        setSalesData(cantidadesPorDia);

        // Comunicar datos procesados al componente padre
        if (onDataUpdate) onDataUpdate(cantidadesPorDia);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchSalesData();
  }, [token, onDataUpdate]);

  // Datos y configuración del gráfico
  const data = {
    labels: salesData.map((_, i) => `Día ${i + 1}`), // Días dinámicos
    datasets: [
      {
        label: 'Ventas',
        data: salesData,
        fill: false,
        borderColor: '#1A729A', // Color por defecto
        segment: {
          borderColor: (ctx) => {
            // Validación previa a la desestructuración
            if (!ctx.segment || !ctx.segment.p1 || !ctx.segment.p2) {
              return '#1A729A'; // Color por defecto si no hay datos
            }
            const { p1, p2 } = ctx.segment;
            return p2.raw > p1.raw ? '#4CAF50' : '#F44336'; // Verde si sube, rojo si baja
          },
        },
        tension: 0.4,
        pointRadius: 0, // Sin puntos visibles
        pointHoverRadius: 6, // Muestra puntos al pasar el cursor
        pointHitRadius: 10, // Amplía el área de detección del tooltip
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite personalizar la altura sin afectar el ancho
    plugins: {
      legend: { display: false }, // Oculta la leyenda
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const today = new Date();
            const date = new Date(today);
            date.setDate(today.getDate() - (29 - index));
            return date.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
          },
          label: (context) => `${context.raw} ventas`,
        },
      },
    },
    interaction: {
      mode: 'nearest', // Detecta el punto más cercano
      intersect: false, // Permite detectar puntos aunque no haya intersección directa
    },
    scales: {
      x: {
        display: false, // Oculta las etiquetas del eje X
      },
      y: {
        display: false, // Oculta las etiquetas del eje Y
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '85px', overflow: 'hidden' }}>
      <div style={{ height: '100%', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
