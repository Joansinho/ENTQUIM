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

const UsersChart = ({ onDataUpdate }) => {
  const [usersData, setUsersData] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/usuarios/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const usuarios = response.data;

        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        const usersPerDay = {};
        usuarios.forEach((usuario) => {
          const createdDate = new Date(usuario.creado_en).toISOString().split('T')[0];
          if (last30Days.includes(createdDate)) {
            usersPerDay[createdDate] = (usersPerDay[createdDate] || 0) + 1;
          }
        });

        const dailyUsers = last30Days.map((date) => usersPerDay[date] || 0);
        setUsersData(dailyUsers);

        const totalUsers = usuarios.length;
        if (onDataUpdate) onDataUpdate({ dailyUsers, totalUsers });
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsersData();
  }, [token, onDataUpdate]);

  const data = {
    labels: usersData.map((_, i) => `Día ${i + 1}`),
    datasets: [
      {
        label: 'Usuarios Registrados',
        data: usersData,
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
          label: (context) => `${context.raw} usuarios`,
        },
      },
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

export default UsersChart;
