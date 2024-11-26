import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importamos axios
import './DashBoardProducts.css';
import Images from '../../../utils/Images/Images';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';

const ManagementP = () => {
    const [productos, setProductos] = useState([]);  // Estado para almacenar todos los productos
    const [productosFiltrados, setProductosFiltrados] = useState([]);  // Productos filtrados
    const [loading, setLoading] = useState(true);  // Estado de carga
    const [error, setError] = useState(null);  // Estado de error
    const [paginaActual, setPaginaActual] = useState(1);  // Estado para la página actual
    const [productosPorPagina, setProductosPorPagina] = useState(10);  // Número de productos por página
    const [columnaOrden, setColumnaOrden] = useState(''); // Columna por la que se ordenará
    const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para controlar el orden (ascendente/descendente)
    const [filtroStock, setFiltroStock] = useState('');  // Estado para el filtro de stock
    const [filtroCategoria, setFiltroCategoria] = useState(''); // Estado para el filtro de categoría
    const paths = [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Productos', link: '/productos' }
    ];

    // Llamada a la API para obtener los productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/productos'); // Ajusta la URL según tu configuración
                setProductos(response.data);
                setProductosFiltrados(response.data); // Inicializamos con todos los productos
            } catch (err) {
                setError('Error al obtener los productos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Función para acortar la descripción si es demasiado larga
    const acortarDescripcion = (descripcion) => {
        return descripcion.length > 50 ? descripcion.slice(0, 50) + '...' : descripcion;
    };

    // Función para ordenar los productos
    const ordenarProductos = (columna) => {
        const nuevaOrdenAscendente = columnaOrden === columna ? !ordenAscendente : true; // Alternar entre asc y desc si es la misma columna
        setColumnaOrden(columna);
        setOrdenAscendente(nuevaOrdenAscendente);
    };

    // Obtener productos ordenados
    const obtenerProductosOrdenados = () => {
        if (!columnaOrden) return productosFiltrados;

        return [...productosFiltrados].sort((a, b) => {
            const valorA = a[columnaOrden];
            const valorB = b[columnaOrden];
            if (typeof valorA === 'string') {
                return ordenAscendente
                    ? valorA.localeCompare(valorB)
                    : valorB.localeCompare(valorA);
            } else {
                return ordenAscendente ? valorA - valorB : valorB - valorA;
            }
        });
    };

    // Obtener estado del stock
    const obtenerEstadoStock = (stock) => {
        if (stock > 10) return 'Disponible';
        if (stock > 0 && stock <= 10) return 'Bajo';
        return 'No disponible';
    };

    // Filtrar y ordenar productos según el filtro de stock
    useEffect(() => {
        const aplicarFiltros = () => {
            let result = productos;
    
            // Filtrar por estado de stock
            if (filtroStock) {
                result = result.filter((producto) => obtenerEstadoStock(producto.stock) === filtroStock);
            }
    
            // Filtrar por categoría
            if (filtroCategoria) {
                result = result.filter((producto) => producto.id_categoria === parseInt(filtroCategoria));
            }
    
            setProductosFiltrados(result);
        };
    
        aplicarFiltros();
    }, [filtroStock, filtroCategoria, productos]);
    

    // Paginación dinámica
    const indexOfLastItem = paginaActual * productosPorPagina;
    const indexOfFirstItem = indexOfLastItem - productosPorPagina;
    const productosActuales = obtenerProductosOrdenados().slice(indexOfFirstItem, indexOfLastItem);
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    // Manejar cambio de página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    return (
        <div className='management-products'>  
            <div className='main-management-home'>
                <Breadcrumbs paths={paths}></Breadcrumbs>
                <h2 className='main-management-home-title'>Productos</h2>

                <div className='management-products-container'>
                    {/* Filter section */}
                    <div className="filter-section">
                        <button className='register-user-button'>Añadir un nuevo producto</button>
                        <div className='filter-container'>
                            <img src={Images.icons.blackfilter} alt='' className='filter-icon'></img>
                            <h4 className='filter-title'>Filtrar</h4>
                        </div>

                        <div className="filter-options">
                            <h5 className='filter-status-title'>Stock</h5>
                            <div className="filter-status">
                                <ul>
                                    <li><input type="radio" name="stock" onChange={() => setFiltroStock('Disponible')} /> Disponible</li>
                                    <li><input type="radio" name="stock" onChange={() => setFiltroStock('Bajo')} /> Bajo</li>
                                    <li><input type="radio" name="stock" onChange={() => setFiltroStock('No disponible')} /> No disponible</li>
                                </ul>
                            </div>
                        </div>

                        <div className="filter-options">
                            <h5 className='filter-status-title'>Categoría</h5>
                            <div className="filter-status">
                                <ul>
                                    <li>
                                        <input
                                            type="radio"
                                            name="categoria"
                                            onChange={() => setFiltroCategoria('1')} // ID de Insectos
                                        /> Insectos
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="categoria"
                                            onChange={() => setFiltroCategoria('2')} // ID de Roedores
                                        /> Roedores
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="categoria"
                                            onChange={() => setFiltroCategoria('3')} // ID de Murciélagos
                                        /> Murciélagos
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="categoria"
                                            onChange={() => setFiltroCategoria('4')} // ID de Larvas
                                        /> Larvas
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product table */}
                    <div className="sales-history products">
                        <table className="sales-history-table">
                            <thead>
                                <tr>
                                    <th onClick={() => ordenarProductos('id_producto')}>
                                        Id {columnaOrden === 'id_producto' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('nombre')}>
                                        Nombre {columnaOrden === 'nombre' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('descripcion')}>
                                        Descripción {columnaOrden === 'descripcion' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('precio')}>
                                        Precio {columnaOrden === 'precio' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('stock')}>
                                        Stock {columnaOrden === 'stock' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mostrar productos actuales */}
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">Cargando...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="6">{error}</td>
                                    </tr>
                                ) : productosActuales.length > 0 ? (
                                    productosActuales.map((producto) => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.id_producto}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{acortarDescripcion(producto.descripcion)}</td>
                                            <td>${producto.precio.toLocaleString('es-CO')}</td>
                                            <td>{obtenerEstadoStock(producto.stock)}</td>
                                            <td><a href="#">Más detalles</a></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No se encontraron productos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="pagination">
                            <div className='pagination-input'>
                                <span>Mostrar los productos</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={productosPorPagina}
                                    onChange={(e) => setProductosPorPagina(parseInt(e.target.value) || 1)}
                                    placeholder="10"
                                />
                            </div>
                            <span>Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, productosFiltrados.length)} de {productosFiltrados.length} productos</span>
                            <div className='pagination-button__container'>
                                <button
                                    onClick={() => cambiarPagina(Math.max(paginaActual - 1, 1))}
                                    disabled={paginaActual === 1}
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: totalPaginas }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={paginaActual === i + 1 ? 'active' : ''}
                                        onClick={() => cambiarPagina(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => cambiarPagina(Math.min(paginaActual + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory control and stock section */}
                <div className="inventory-control">
                    <div className="inventory-history">
                        <h3 className='main-management-home-title'>Control de inventario</h3>

                        <div className="history-box">
                            <div className="date-selector__container">
                                <span className='history-box-title'>Historial de inventario</span>
                                <div>
                                    <input type='' placeholder='Hoy' className='date-selector'></input>
                                    <span className='history-box-date'>9/02/24</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="low-stock">
                        <h3 className='main-management-home-title'>Por agotarse</h3>
                        <div className="low-stock-box">
                            <div className="low-stock-header">
                                <span className='history-box-title'>Nombre</span>
                                <span className='history-box-title'>Unidades actuales</span>
                            </div>
                            <div className="total-stock">
                                <span className='history-box-title'>Stock total actual:</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementP;