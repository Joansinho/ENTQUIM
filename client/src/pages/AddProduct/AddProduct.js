import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
    const token = useAuth();
    const navigate = useNavigate();

    const paths = [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Productos', link: '/dashboard/productos' },
        { name: 'Nuevo Producto', link: '/nuevo-producto' }
    ];

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        plagas: '',
        dosis: '',
        id_categoria: ''
    });
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [inputKey, setInputKey] = useState(Date.now()); // Para resetear el input de archivo

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImagen(null);
        setImagenPreview(null);
        setInputKey(Date.now()); // Fuerza un reset del input de archivo
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('descripcion', formData.descripcion);
        data.append('precio', formData.precio);
        data.append('stock', formData.stock);
        data.append('plagas', formData.plagas);
        data.append('dosis', formData.dosis);
        data.append('id_categoria', formData.id_categoria);
        if (imagen) {
            data.append('imagen', imagen);
        }

        try {
            await axios.post('http://localhost:3002/api/productos', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Producto creado con éxito');
            navigate('/dashboard/productos'); // Redirigir al listado de productos
        } catch (error) {
            console.error('Error al crear el producto:', error);
            toast.error('Error al crear el producto');
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/productos');
    };

    return (
        <div className='dashboard'>
            <div className='add-product-dashboard'>
                <Breadcrumbs paths={paths}></Breadcrumbs>
                <h2 className='title-add-product-dashboard'>Crear Nuevo Producto</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className='input-add-product-imagen-dashboard'>
                        {imagenPreview && (
                            <div className="product-image-preview">
                                <img src={imagenPreview} alt="Vista previa" />
                            </div>
                        )}

                        <div className='add-product-image-dashboard__action-buttons'>
                            <label htmlFor="upload-button" className="image-upload-label">
                                {imagen ? 'Cambiar Imagen' : 'Subir Imagen'}
                            </label>
                            <input
                                id="upload-button"
                                type="file"
                                name="imagen"
                                accept="image/*"
                                className='image-upload-input'
                                style={{ display: 'none' }}
                                key={inputKey} // Fuerza el reinicio del input
                                onChange={handleFileChange}
                            />

                            {imagen && (
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={handleRemoveImage}
                                >
                                    Eliminar Imagen
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Nombre del producto"
                            variant="standard"
                            type="text"
                            name="nombre"
                            margin='dense'
                            size='small'
                            value={formData.nombre}
                            onChange={handleChange}
                            sx={{ width: '75%' }}
                        />
                        <TextField
                            label="Precio"
                            variant="standard"
                            type="number"
                            name="precio"
                            size='small'
                            margin='dense'
                            value={formData.precio}
                            onChange={handleChange}
                            onInput={(e) => e.target.value < 0 && (e.target.value = 0)} // Prevenir negativos
                            sx={{ width: '25%' }}
                        />
                    </div>
                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Descripción"
                            variant="standard"
                            multiline
                            rows={1.5}
                            name="descripcion"
                            size='small'
                            margin='dense'
                            value={formData.descripcion}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>
                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Stock"
                            variant="standard"
                            type="number"
                            name="stock"
                            size='small'
                            margin='dense'
                            value={formData.stock}
                            onChange={handleChange}
                            onInput={(e) => e.target.value < 0 && (e.target.value = 0)} // Prevenir negativos
                            fullWidth
                        />
                    </div>
                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Plagas"
                            variant="standard"
                            type="text"
                            name="plagas"
                            size='small'
                            margin='dense'
                            value={formData.plagas}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>
                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Dosis"
                            variant="standard"
                            type="text"
                            name="dosis"
                            size='small'
                            margin='dense'
                            value={formData.dosis}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>
                    <div className='input-add-product-dashboard'>
                        <TextField
                            label="Categoría (ID)"
                            variant="standard"
                            type="number"
                            name="id_categoria"
                            size='small'
                            margin='dense'
                            value={formData.id_categoria}
                            onChange={handleChange}
                            onInput={(e) => e.target.value < 0 && (e.target.value = 0)} // Prevenir negativos
                            fullWidth
                        />
                    </div>

                    <div className='create-product-button-container'>
                        <button type="button" className="cancel-product-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className='create-product-button'>Crear Producto</button>
                    </div>
                </form>
                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    );
};

export default AddProduct;
