import React from 'react';
import './UserDetailModal.css';

const UserDetailModal = ({ isOpen, onClose, usuario }) => {
    if (!isOpen) return null;

    return (
        <div className="user-detail-modal-overlay">
            <div className="user-detail-modal-content">
                <button className="user-detail-modal-close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="user-detail-modal-title">Detalles del Usuario</h2>
                {usuario ? (
                    <div className="user-detail-modal-info">
                        <p><strong>ID:</strong> {usuario.id_usuarios}</p>
                        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
                        <p><strong>Correo:</strong> {usuario.correo}</p>
                        <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                        <p><strong>Dirección:</strong> {usuario.direccion}</p>
                        <p><strong>Rol ID:</strong> {usuario.id_rol}</p>
                        <p><strong>Estado:</strong> {usuario.estado || 'Desconocido'}</p>
                        <p><strong>Fecha de nacimiento:</strong> {new Date(usuario.fecha_nacimiento).toLocaleDateString()}</p>
                        <p><strong>Creado en:</strong> {new Date(usuario.creado_en).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>Cargando información del usuario...</p>
                )}
            </div>
        </div>
    );
};

export default UserDetailModal;
