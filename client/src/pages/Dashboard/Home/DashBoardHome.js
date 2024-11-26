import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DashBoardHome.css';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import SalesChart from '../../../components/Charts/SalesChart/SalesChart';
import IncomeChart from '../../../components/Charts/IncomeChart/IncomeChart';
import UsersChart from '../../../components/Charts/UsersChart/UsersChart';
import StockChart from '../../../components/Charts/StockChart/StockChart';

const Management = () => {
  const { token } = useAuth(); // Obtiene el token desde AuthContext
  const [totalSales, setTotalSales] = useState(0); // Estado para almacenar el total de ventas
  const [totalIncome, setTotalIncome] = useState(0); // Estado para los ingresos
  const [totalUsers, setTotalUsers] = useState(0);
  const [stockData, setStockData] = useState({ totalStock: 0, stockStatus: 'Disponible' });
  const [bestSellers, setBestSellers] = useState([]); // Estado para productos más vendidos

  const paths = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Inicio', link: '/inicio' },
  ];

  const handleDataUpdate = (salesData) => {
    const total = salesData.reduce((acc, val) => acc + val, 0);
    setTotalSales(total);
  };

  const handleIncomeUpdate = (revenueData) => {
    const total = revenueData.reduce((acc, val) => acc + val, 0);
    setTotalIncome(total);
  };

  const handleUsersUpdate = ({ dailyUsers, totalUsers }) => {
    setTotalUsers(totalUsers);
  };

  const handleStockUpdate = ({ totalStock, stockStatus }) => {
    setStockData({ totalStock, stockStatus });
  };

  const fetchProductName = async (id_producto) => {
    try {
      const response = await fetch(`http://localhost:3002/api/productos/${id_producto}`);
      if (!response.ok) throw new Error('Error al obtener el producto');
      const producto = await response.json();
      return producto.nombre;
    } catch (error) {
      console.error('Error al cargar el nombre del producto:', error);
      return `Producto ${id_producto}`;
    }
  };

  const calculateDailyIncrease = (salesByDay) => {
    if (salesByDay.length < 2) return 0;
    const [previousDay, currentDay] = salesByDay.slice(-2);
    return previousDay === 0 ? 100 : ((currentDay - previousDay) / previousDay) * 100;
  };

  const fetchBestSellers = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3002/api/ventas/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las ventas');
      }

      const ventas = await response.json();

      // Procesar productos más vendidos
      const productCount = {};
      const dailySales = {}; // Almacena ventas diarias

      ventas.forEach((venta) => {
        const date = venta.fecha.split('T')[0]; // Extrae solo la fecha
        venta.detalles.forEach(({ id_producto, cantidad }) => {
          productCount[id_producto] = (productCount[id_producto] || 0) + cantidad;
          if (!dailySales[id_producto]) dailySales[id_producto] = {};
          dailySales[id_producto][date] = (dailySales[id_producto][date] || 0) + cantidad;
        });
      });

      const bestSellersArray = await Promise.all(
        Object.entries(productCount)
          .map(async ([id_producto, unidades]) => {
            const salesByDay = Object.values(dailySales[id_producto] || {}).slice(-30);
            return {
              id_producto: parseInt(id_producto, 10),
              unidades,
              nombre: await fetchProductName(id_producto),
              aumento: calculateDailyIncrease(salesByDay),
            };
          })
      );

      setBestSellers(bestSellersArray.sort((a, b) => b.unidades - a.unidades).slice(0, 6)); // Limitar a los 5 más vendidos
    } catch (error) {
      console.error('Error al cargar los productos más vendidos:', error);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, [token]);

  return (
    <div className="management-home">
      <div className="main-management">
        <Breadcrumbs paths={paths} />
        <h2 className="main-management-title">Estadísticas</h2>

        <div className="management-home-charts__container-first">
          <div className="management-home__solds-container">
            <h4 className="home-chart-title">Ventas</h4>
            <p className="home-chart-total">{totalSales}</p>
            <small className="home-chart-days">Últimos 30 días</small>
            <div className="management-home-chart__container">
              <SalesChart onDataUpdate={handleDataUpdate} />
            </div>
          </div>

          <div className="management-home__solds-container">
            <h4 className="home-chart-title">Ingresos</h4>
            <p className="home-chart-total">${totalIncome.toLocaleString('es-CO')}</p>
            <small className="home-chart-days">Últimos 30 días</small>
            <div className="management-home-chart__container">
              <IncomeChart onDataUpdate={handleIncomeUpdate} />
            </div>
          </div>

          <div className="management-home__solds-container">
            <h4 className="home-chart-title">Usuarios</h4>
            <p className="home-chart-total">{totalUsers}</p>
            <small className="home-chart-days">Últimos 30 días</small>
            <div className="management-home-chart__container">
              <UsersChart onDataUpdate={handleUsersUpdate} />
            </div>
          </div>
        </div>

        <div className="stock-home">
          <div className="best-sellers-stock-container">
            <div className="best-sellers">
              <h4 className="best-sellers-title">Productos más vendidos</h4>
              <table className="best-sellers-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Unidades</th>
                    <th>Aumento</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((product, index) => (
                    <tr key={product.id_producto}>
                      <td>{index + 1}</td>
                      <td>{product.nombre}</td>
                      <td>{product.unidades}</td>
                      <td>{`${product.aumento.toFixed(0)}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <small className="best-sellers-days">Últimos 30 días</small>
            </div>
          </div>
          <div className="stock-chart-container">
            <h4 className="stock-chart-title">Stock</h4>
            <p className="stock-chart-total">{stockData.totalStock}</p>
            <span className={`stock-status ${stockData.stockStatus.toLowerCase()}`}>
              {stockData.stockStatus}
            </span>
            <div className="stock-chart">
              <StockChart onStockUpdate={handleStockUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
