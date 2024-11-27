import React, { useEffect, useState } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductsService';
import { useCart } from '../../context/CartContext'; // Importa el contexto del carrito

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const { addToCart } = useCart(); // Usa el contexto del carrito

    const categorias = {
        1: 'Insectos',
        2: 'Roedores',
        3: 'Murcielagos',
        4: 'Larvas',
    };

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const productosData = await ProductService.fetchProductos();
                console.log(productosData);
                setProductos(productosData);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const productosFiltrados = productos.filter((producto) => {
        return (
            categoriaSeleccionada === '' || 
            producto.id_categoria === Number(categoriaSeleccionada)
        );
    });

    const productosMostrados = categoriaSeleccionada === '' ? productos.slice(0, 5) : productosFiltrados;
    const categoriaTitulo = categoriaSeleccionada ? categorias[categoriaSeleccionada] : 'Productos';

    const handleAddToCart = (producto) => {
        addToCart(producto, 1); // Agrega el producto al carrito con cantidad 1
    };

    return (
        <>
            <div className="product-image__container">
                <div className="product-image-titles__container">
                    <h2 className="product-image-title">PRODUCTOS</h2>
                    <h3 className="product-image-subtitle">Calidad y seguridad en cada producto.</h3>
                </div>
            </div>

            <div className='product-main__container'>
                <div className='products-main__container'>
                    <div className="category-selection">
                        <h2 className='products-main__title'>{categoriaTitulo}</h2>
                    <select 
                            id="categoria" 
                            value={categoriaSeleccionada} 
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            className='category-product-selection'
                        >
                            <option value="">Todas</option>
                            {Object.entries(categorias).map(([id, nombre]) => (
                                <option key={id} value={id}>{nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className='products-container'>
                        {isLoading ? (
                            <p>Cargando productos...</p>
                        ) : productosMostrados.length > 0 ? (
                            productosMostrados.map((producto) => (
                                <div className='products-container__container' key={producto.id_producto}>
                                    <Link to={`/ProductDetails/${producto.id_producto}`}>
                                        <img 
                                            src={producto.imagen}
                                            alt={producto.nombre} 
                                            className='product-container__image'
                                        />
                                    </Link>
                                    <h4 className='product-container__title'>{producto.nombre}</h4>
                                    <p className='product-container__price'>${producto.precio.toLocaleString('es-CO')} COP</p>
                                    <button className='product-container__add-product' onClick={() => handleAddToCart(producto)}>
                                        Añadir al carrito
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay productos disponibles en esta categoría.</p>
                        )}
                    </div>
                    <div className='product__all-products'>
                        <Link to="/Productos/Todos">Ver todos{" >"}</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;