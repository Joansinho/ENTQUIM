import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './DashBoardSolds.css';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import SalesChart from '../../../components/Charts/SalesChart/SalesChart'
import Images from '../../../utils/Images/Images';

const ManagementS = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { token } = useAuth();

  // Estados para los filtros
  const [estado, setEstado] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');

  const paths = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Ventas', link: '/ventas' },
  ];

  // Llamada a la API para traer las ventas
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/ventas/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVentas(response.data);
        setFilteredVentas(response.data); // Inicializar los datos filtrados
      } catch (err) {
        setError('Error al cargar las ventas.');
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [token]);

  // Aplicar filtros a las ventas
  useEffect(() => {
    const applyFilters = () => {
      let result = ventas;

      // Filtrar por estado
      if (estado) {
        result = result.filter((venta) => venta.estado.toLowerCase() === estado.toLowerCase());
      }

      // Filtrar por rango de total
      if (minTotal) {
        result = result.filter((venta) => venta.total >= parseFloat(minTotal));
      }
      if (maxTotal) {
        result = result.filter((venta) => venta.total <= parseFloat(maxTotal));
      }

      // Aplicar ordenamiento
      if (sortConfig.key) {
        result.sort((a, b) => {
          const aVal = a[sortConfig.key];
          const bVal = b[sortConfig.key];
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setFilteredVentas(result);
    };

    applyFilters();
  }, [estado, minTotal, maxTotal, ventas, sortConfig]);

  // Paginación dinámica
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

  // Manejo del ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className='management-home'>
      <div className='main-management-home'>
        <Breadcrumbs paths={paths} />
        <h2 className='main-management-home-title'>Historial de Ventas</h2>
        <div className='management-solds-container'>
          {/* Sección de filtros */}
          <div className="filter-section">
            <div className='filter-container'>
              <img src={Images.icons.blackfilter} alt='' className='filter-icon' />
              <h4 className='filter-title'>Filtrar</h4>
            </div>

            <div className="filter-options">
              <h5 className='filter-status-title'>Estado</h5>
              <div className="filter-status">
                <ul>
                  {['Confirmada', 'Cancelada', 'Pendiente', 'En Proceso'].map((item) => (
                    <li key={item}>
                      <input
                        type="radio"
                        name="status"
                        value={item}
                        checked={estado === item}
                        onChange={(e) => setEstado(e.target.value)}
                      />{' '}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="filter-options">
              <div className="input-range">
                <h5 className='filter-status-title'>Total</h5>
                <div>
                  <input
                    type="text"
                    placeholder="Min"
                    value={minTotal}
                    onChange={(e) => setMinTotal(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    placeholder="Max"
                    value={maxTotal}
                    onChange={(e) => setMaxTotal(e.target.value)}
                    className='input-max'
                  />
                </div>
              </div>
              <div className="filter-status">
                <p>
                  De ${minTotal || 0} a ${maxTotal || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de tabla */}
          <div className="sales-history solds">
            <table className="sales-history-table">
              <thead>
                <tr>
                  {['Id', 'Fecha', 'Cliente', 'Total', 'Estado'].map((col) => (
                    <th key={col} onClick={() => handleSort(col.toLowerCase())}>
                      {col}{' '}
                      {sortConfig.key === col.toLowerCase() &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Cargando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6">{error}</td>
                  </tr>
                ) : currentVentas.length > 0 ? (
                  currentVentas.map((venta) => (
                    <tr key={venta.id_venta}>
                      <td>{venta.id_venta}</td>
                      <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                      <td>{venta.correo}</td>
                      <td>${venta.total.toLocaleString('es-CO')}</td>
                      <td>
                        <span
                          className={`status ${
                            venta.estado.toLowerCase().replace(' ', '-')
                          }`}
                        >
                          {venta.estado.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <a href={`#detalles-${venta.id_venta}`}>Más detalles</a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No hay ventas que coincidan con los filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="pagination">
              <div className='pagination-input'>
                <span>Mostrar las ventas</span>
                <input
                  type="number"
                  min="1"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value) || 1)}
                  placeholder="10"
                />
              </div>
              <span>
                Mostrando {indexOfFirstItem + 1} a{' '}
                {Math.min(indexOfLastItem, filteredVentas.length)} de{' '}
                {filteredVentas.length} ventas
              </span>
              <div className='pagination-button__container'>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="statistics-section">
          <h3 className='main-management-home-title'>Estadísticas</h3>
          <div className="statistics-container">
            <div className="statistics-solds-card">
              <h4>Ventas</h4>
              <span className="statistics-value">{filteredVentas.length}</span>

            </div>
            <div className="statistics-comparison">
              <h3 className='main-management-home-title'>Comparar</h3>
              <div className='statistics-comparision__container'>
                <div className="statistics-box">
                  <h5>Septiembre 09/2024</h5>
                  <p>1239</p>
                  <span>Promedio por día</span>
                  <p>24</p>
                </div>
                <div className="statistics-box">
                  <h5>Octubre 10/2024</h5>
                  <p>1321</p>
                  <span>Promedio por día</span>
                  <p>24</p>
                </div>
              </div>
              <div className="growth-info">
                <p>
                  Crecimiento de{' '}
                  <span className="growth-positive">+2%</span> respecto a septiembre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementS;
