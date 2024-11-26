// CartModal.js
import React, { useState, useMemo } from 'react';
import './CartModal.css';
import { useCart } from '../../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Images from '../../../utils/Images/Images';

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems = [], updateCartItemQuantity, removeFromCart, clearCart } = useCart() ?? {};
    const navigate = useNavigate();
    const [loading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            onClose();
        }, 200);
    };

    const handleQuantityChange = (id_producto, quantity) => {
        const item = cartItems.find(item => item.id_producto === id_producto);
        if (item) {
            if (quantity <= item.stock) {
                updateCartItemQuantity(id_producto, Math.max(1, quantity)); // Asegura que la cantidad no sea menor a 1
            } else {
                toast.warn(`No puedes establecer más de ${item.stock} unidades de ${item.nombre}.`, { autoClose: 1500 });
            }
        }
    };

    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0), [cartItems]);
    const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

    const handleGoToCart = () => {
        navigate('/Carrito');
        handleClose();
    };

    const handleModalClick = (e) => e.stopPropagation();

    return (
        <div className={`modal ${isOpen ? 'show' : ''} ${isAnimating ? 'close-animation' : ''}`} onClick={handleClose}>
            <div className={`modal__content ${isAnimating ? 'close' : ''}`} onClick={handleModalClick}>
                <div className="cart__header">
                    <h3 className='cart__articles'>Productos: {totalItems}</h3>
                    <img className="cart__clear" 
                         onClick={clearCart} 
                         src={Images.icons.activedelete} 
                         alt='Vaciar el Carrito'
                         title='Vaciar el Carrito'
                         ></img>
                </div>
                {cartItems.length > 0 ? (
                    <div className='cart__list-container'>
                        <ul className="cart__list">
                            {cartItems.map((item) => (
                                <li key={item.id_producto} className="cart__item">
                                    <img src={item.imagen} alt={item.nombre} className="cart__image" />
                                    <div className="cart__details">
                                        <h3 className="cart__name">{item.nombre}</h3>
                                        <p className="cart-price">${item.precio.toLocaleString('es-CO')}</p>
                                        <div className="cart__quantity" data-quantity={item.quantity}>
                                            {/* Botón para reducir cantidad */}
                                            {item.quantity > 1 ? (
                                                <button 
                                                    className="cart__decrease" 
                                                    onClick={() => handleQuantityChange(item.id_producto, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                            ) : (
                                                <button
                                                    className="cart__delete-product" 
                                                    onClick={() => removeFromCart(item.id_producto)}
                                                >
                                                    <img src={Images.icons.unactiveDelete} alt="Eliminar" className='delete-product-icon'/>
                                                </button>
                                            )}

                                            {/* Input para la cantidad */}
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id_producto, Number(e.target.value))}
                                                className='cart__input-quantity'
                                            />

                                            {/* Botón para incrementar cantidad */}
                                            <button 
                                                className="cart__increase" 
                                                onClick={() => handleQuantityChange(item.id_producto, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button className="cart__remove" onClick={() => removeFromCart(item.id_producto)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart__subtotal">
                            <h3>Subtotal: ${subtotal.toLocaleString('es-CO')}</h3>
                        </div>
                        <button
                            className="cart__checkout"
                            onClick={handleGoToCart}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Ir a carrito'}
                        </button>
                    </div>
                ) : (
                    <div className='empty-cart-container'>
                        <p className='empty-cart-modal'>El carrito está vacío.</p>
                        <Link to={'/Productos/Todos'}><img alt=''
                                                           src={Images.icons.greenaddcart}
                                                           title='Ir a productos'
                                                           className='add-products-cart-img'></img></Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;