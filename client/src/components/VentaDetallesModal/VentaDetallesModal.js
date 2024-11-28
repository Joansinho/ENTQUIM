import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VentaDetallesModal.css';
import { useAuth } from '../../context/AuthContext';

const VentaDetallesModal = ({ idVenta, onClose }) => {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useAuth();

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/ventas/${idVenta}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setVenta(response.data);
      } catch (err) {
        setError('No se pudo cargar la información de la venta.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [idVenta]);

  if (loading) {
    return (
      <div className="venta-detalles-modal-overlay">
        <div className="venta-detalles-modal-container">
          <p className="venta-detalles-loading">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venta-detalles-modal-overlay">
        <div className="venta-detalles-modal-container">
          <p className="venta-detalles-error">{error}</p>
          <button className="venta-detalles-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venta-detalles-modal-overlay">
      <div className="venta-detalles-modal-container">
        <div className="venta-detalles-header">
          <h2>Detalles de la Venta #{venta.id_venta}</h2>
          <button className="venta-detalles-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="venta-detalles-body">
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {venta.estado}</p>
          <p><strong>Cliente:</strong> {venta.correo}</p>
          <p><strong>Total:</strong> ${venta.total.toLocaleString('es-CO')}</p>
          <h3>Productos:</h3>
          <table className="venta-detalles-productos">
            <thead>
              <tr>
                <th>Producto ID</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Método de Pago</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.id_producto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>${detalle.precio_Unitario.toLocaleString('es-CO')}</td>
                  <td>{detalle.metodo_pago.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VentaDetallesModal;
