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

const IncomeChart = ({ onDataUpdate }) => {
  const [IncomeData, setIncomeData] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/ventas/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const ventas = response.data;

        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        const ingresosPorDia = {};
        ventas.forEach((venta) => {
          const ventaFecha = new Date(venta.fecha).toISOString().split('T')[0];
          if (last30Days.includes(ventaFecha)) {
            ingresosPorDia[ventaFecha] = (ingresosPorDia[ventaFecha] || 0) + venta.total; // Sumar ingresos
          }
        });

        const cantidadesPorDia = last30Days.map((fecha) => ingresosPorDia[fecha] || 0);
        setIncomeData(cantidadesPorDia);

        if (onDataUpdate) onDataUpdate(cantidadesPorDia);
      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
      }
    };

    fetchIncomeData();
  }, [token, onDataUpdate]);

  const generateSegmentColors = (data) => {
    const colors = [];
    for (let i = 1; i < data.length; i++) {
      colors.push(data[i] > data[i - 1] ? '#4CAF50' : '#F44336');
    }
    return colors;
  };

  const segmentColors = generateSegmentColors(IncomeData);

  const data = {
    labels: IncomeData.map((_, i) => `Día ${i + 1}`),
    datasets: [
      {
        label: 'Ingresos',
        data: IncomeData,
        fill: false,
        borderColor: (context) => {
          const index = context.rawIndex || 0;
          return index > 0 ? segmentColors[index - 1] : '#1A729A';
        },
        segment: {
          borderColor: (ctx) => {
            if (!ctx.segment || !ctx.segment.p1 || !ctx.segment.p2) return '#1A729A';
            const { p1, p2 } = ctx.segment;
            return p2.raw > p1.raw ? '#1A729A' : '#F44336';
          },
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHitRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const today = new Date();
            const date = new Date(today);
            date.setDate(today.getDate() - (29 - index));
            return date.toISOString().split('T')[0];
          },
          label: (context) => `$${context.raw.toLocaleString('es-CO')} ingresos`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: { display: false },
      y: { display: false },
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

export default IncomeChart;
