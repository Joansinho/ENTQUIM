import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashBoardUsers.css';
// import StockChart from '../../../componentes/Management/Charts/StockChart';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs'; 
import Images from '../../../utils/Images/Images';
import { useAuth } from '../../../context/AuthContext'; // Importa el contexto de autenticación

const ManagementU = () => {
    const { user } = useAuth(); // Obtén el usuario logueado
    const [usuarios, setUsuarios] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState(''); // Estado para el filtro de estado
    const paths = [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Usuarios', link: '/usuarios' }
      ];

    // Obtener los usuarios desde la API
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/usuarios');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsuarios();
    }, []);

    // Filtrar usuarios basado en estado
    const filteredUsuarios = usuarios.filter(usuario => {
        const estadoMatch = filtroEstado ? usuario.estado === filtroEstado : true;
        return estadoMatch;
    });

    // Función para obtener el nombre del rol
    // const getRolNombre = (id_rol) => {
    //     switch (id_rol) {
    //         case 1:
    //             return 'Administrador';
    //         case 2:
    //             return 'Empleado';
    //         case 3:
    //             return 'Cliente';
    //         default:
    //             return 'Desconocido';
    //     }
    // };

    return (
        <div className='users-management'>
            <div className='main-management-home'>
                <Breadcrumbs paths={paths}></Breadcrumbs>
                <h2 className='main-management-home-title'>Usuarios</h2>

                <div className='management-products-container'>
                    {/* Mostrar solo el rol del usuario logueado */}
                    <div className='current-role'>
                        {/* <h4>Rol actual: {getRolNombre(user.id_rol)}</h4> */}
                    </div>

                    {/* Botón para añadir usuario solo para administradores */}
                    {/* {user.id_rol === 1 && (
                        <button className='register-user-button'>Añadir un nuevo usuario</button>
                    )} */}
                    
                    <div className='filter-container'>
                        <img src={Images.icons.blackfilter} alt='' className='filter-icon' />
                        <h4 className='filter-title'>Filtrar</h4>
                    </div>

                    <div className="filter-options">
                        <h5 className='filter-status-title'>Estado</h5>
                        <div className="filter-status">
                            <ul>
                                <li>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="" 
                                        checked={filtroEstado === ''} 
                                        onChange={(e) => setFiltroEstado(e.target.value)} 
                                    /> Todos
                                </li>
                                <li>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Activo" 
                                        checked={filtroEstado === 'Activo'} 
                                        onChange={(e) => setFiltroEstado(e.target.value)} 
                                    /> Activo
                                </li>
                                <li>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Inactivo" 
                                        checked={filtroEstado === 'Inactivo'} 
                                        onChange={(e) => setFiltroEstado(e.target.value)} 
                                    /> Inactivo
                                </li>
                                <li>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Bloqueado" 
                                        checked={filtroEstado === 'Bloqueado'} 
                                        onChange={(e) => setFiltroEstado(e.target.value)} 
                                    /> Bloqueado
                                </li>
                                <li>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Por Eliminar" 
                                        checked={filtroEstado === 'Por Eliminar'} 
                                        onChange={(e) => setFiltroEstado(e.target.value)} 
                                    /> Por Eliminar
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="sales-history products">
                    <table className="sales-history-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((usuario) => (
                                <tr key={usuario.id_usuarios}>
                                    <td>{usuario.id_usuarios}</td>
                                    <td>{usuario.nombre} {usuario.apellido}</td>
                                    <td>{usuario.correo}</td>
                                    {/* <td>{getRolNombre(usuario.id_rol)}</td> */}
                                    <td>{usuario.estado}</td>
                                    <td><a href="#">Más detalles</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Contenedores de estadísticas */}
            <div className="statistics-users-container">
                <div className="growth-users-rate">
                    <h3>Tasa de crecimiento</h3>
                    {/* <StockChart />  */}
                </div>

                <div className="stats-row statistics-users">
                    <div className="stat-card new-users">
                        <h4>Nuevos usuarios</h4>
                        <p className="stat-number">123</p>
                        <p className="stat-percentage">+25%</p>
                    </div>
                    <div className="stat-card page-time">
                        <h4>Tiempo en la página</h4>
                        <p className="stat-number">2m 39s</p>
                        <p className="stat-description">Promedio</p>
                    </div>
                </div>

                <div className="stats-row statistics-page">
                    <div className="stat-card active-users">
                        <h4>Usuarios más activos</h4>
                        <p className="stat-number">John Doe</p>
                        <p className="stat-description">15 visitas</p>
                    </div>
                    <div className="stat-card visited-products">
                        <h4>Productos más visitados</h4>
                        <p className="stat-number">1234</p>
                        <p className="stat-description">Visitas totales</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementU;
