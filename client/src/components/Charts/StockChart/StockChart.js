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

const StockChart = ({ onStockUpdate }) => {
  const [stockData, setStockData] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/productos', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const productos = response.data;

        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        const stockPorDia = last30Days.map(() => {
          return productos.reduce((acc, producto) => acc + producto.stock, 0);
        });

        setStockData(stockPorDia);

        const totalStock = stockPorDia[stockPorDia.length - 1];
        const stockStatus =
          totalStock > 20 ? 'Disponible' : totalStock > 20 ? 'Bajo' : 'No disponible';

        if (onStockUpdate) onStockUpdate({ totalStock, stockStatus });
      } catch (error) {
        console.error('Error al obtener el stock:', error);
      }
    };

    fetchStockData();
  }, [token, onStockUpdate]);

  const data = {
    labels: stockData.map((_, i) => `Día ${i + 1}`),
    datasets: [
      {
        label: 'Stock',
        data: stockData,
        fill: false,
        borderColor: '#1A729A',
        segment: {
          borderColor: (ctx) => {
            const { p1, p2 } = ctx.segment || {};
            if (!p1 || !p2) return '#1A729A';
            return p2.raw > p1.raw ? '#4CAF50' : '#F44336'; // Verde si suben, rojo si bajan
          },
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
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
          label: (context) => `${context.raw} unidades`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
      <div style={{ height: '100%', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StockChart;
