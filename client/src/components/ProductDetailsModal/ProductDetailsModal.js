import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Para notificaciones
import 'react-toastify/dist/ReactToastify.css';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ producto, onClose }) => {
    const [isPlagasOpen, setIsPlagasOpen] = useState(false);
    const [isDosisOpen, setIsDosisOpen] = useState(false);

    if (!producto) return null; // Si no hay producto seleccionado, no renderizamos nada

    // Función para manejar la eliminación del producto
    const handleDeleteProduct = async () => {
        try {
            const response = await axios.delete(`http://localhost:3002/api/productos/${producto.id_producto}`);
            if (response.status === 200 || response.status === 204) {
                toast.success('Producto eliminado con éxito');
                onClose(); // Cerrar el modal
                setTimeout(() => window.location.reload(), 1000); // Recargar después de mostrar la notificación
            } else {
                throw new Error('No se recibió una respuesta adecuada del servidor.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            toast.error('No se pudo eliminar el producto. Intenta de nuevo.');
        }
    };

    return (
        <div className="product-details-modal-overlay">
            <div className="product-details-modal">
                <div className="product-details-footer">
                    <div className="dropdown">
                        <button className="dropdown-button">Opciones</button>
                        <div className="dropdown-content">
                            {/* Opción de eliminar */}
                            <a onClick={(e) => {
                                e.preventDefault();
                                handleDeleteProduct();
                            }}>
                                Eliminar
                            </a>
                        </div>
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>✖</button>

                <div className="product-details-header">
                    <img src={producto.imagen} alt={producto.nombre} className="product-details-modal-image" />
                    <div className="product-info">
                        <h2 className='product-modal-title'>{producto.id_producto}: {producto.nombre}</h2>

                        <div className='product-details-modal-info__container'>
                            <span className="product-details-modal-category">
                                Categoría: {['Insectos', 'Roedores', 'Murciélagos', 'Larvas'][producto.id_categoria - 1]}
                            </span>
                            <span className="product-details-modal-stock">Stock: {producto.stock}</span>
                            <span className="product-details-modal-price">${producto.precio.toLocaleString('es-CO')}</span>
                        </div>

                        <h3>Descripción</h3>
                        <p>{producto.descripcion}</p>
                    </div>
                </div>
                <div className="product-details-body">
                    {/* Plagas Desplegable */}
                    <div className="accordion-section">
                        <button
                            className="accordion-toggle"
                            onClick={() => setIsPlagasOpen(!isPlagasOpen)}
                        >
                            Plagas {isPlagasOpen ? '▲' : '▼'}
                        </button>
                        {isPlagasOpen && <p className="accordion-content">{producto.plagas}</p>}
                    </div>

                    {/* Dosis Desplegable */}
                    <div className="accordion-section">
                        <button
                            className="accordion-toggle"
                            onClick={() => setIsDosisOpen(!isDosisOpen)}
                        >
                            Dosis {isDosisOpen ? '▲' : '▼'}
                        </button>
                        {isDosisOpen && <p className="accordion-content">{producto.dosis}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
