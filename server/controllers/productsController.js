const connection = require('../config/conexion'); // Asegúrate de importar la conexión
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/products'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});
const upload = multer({ storage: storage });

const ProductoController = {
    // Obtener todos los productos
    getAll: async (req, res) => {
        try {
            const query = 'SELECT * FROM productos';
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error al ejecutar la consulta: ', error);
                    return res.status(500).json({ message: "Error al obtener productos", error });
                }
                return res.status(200).json(results);
            });
        } catch (err) {
            console.error('Error inesperado: ', err);
            return res.status(500).json({ message: "Error al obtener productos", error: err });
        }
    },

    // Obtener producto por ID
    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'SELECT * FROM productos WHERE id_producto = ?';
            connection.query(query, [id], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Error al obtener producto', error: error.message });
                }
                if (results.length > 0) {
                    return res.status(200).json(results[0]);
                } else {
                    return res.status(404).json({ message: 'Producto no encontrado' });
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error inesperado', error: error.message });
        }
    },

    // Crear un nuevo producto
    create: async (req, res) => {
        const { nombre, descripcion, precio, stock, plagas, dosis, id_categoria } = req.body;
        const imagen = req.file ? `http://localhost:3002/api/assets/products/${req.file.filename}` : null; // Ruta de la imagen

        try {
            const query = `
                INSERT INTO productos (nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria];

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al crear producto:', error);
                    return res.status(500).json({ message: 'Error al crear producto', error: error.message });
                }
                return res.status(201).json({ 
                    id_producto: results.insertId, 
                    nombre, 
                    descripcion, 
                    precio, 
                    stock, 
                    plagas, 
                    dosis, 
                    imagen, 
                    id_categoria 
                });
            });
        } catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({ message: 'Error al crear producto', error: error.message });
        }
    },

    // Actualizar un producto por ID
    update: async (req, res) => {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, plagas, dosis, id_categoria } = req.body;
        const imagen = req.file ? `/api/assets/products/${req.file.filename}` : null;

        try {
            const query = `
                UPDATE productos 
                SET nombre = ?, descripcion = ?, precio = ?, stock = ?, plagas = ?, dosis = ?, imagen = ?, id_categoria = ?
                WHERE id_producto = ?
            `;
            const values = [nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria, id];

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al actualizar producto:', error);
                    return res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
                }
                return res.status(200).json({ message: 'Producto actualizado correctamente' });
            });
        } catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
        }
    },

    // Eliminar un producto por ID
    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const query = 'DELETE FROM productos WHERE id_producto = ?';
            connection.query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error al eliminar producto:', error);
                    return res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
                }
                return res.status(200).json({ message: 'Producto eliminado correctamente' });
            });
        } catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
        }
    },

    // Obtener productos por categoría
    getByCategoria: async (req, res) => {
        const { id_categoria } = req.params;

        try {
            const query = 'SELECT * FROM productos WHERE id_categoria = ?';
            connection.query(query, [id_categoria], (error, results) => {
                if (error) {
                    console.error('Error al ejecutar la consulta:', error);
                    return res.status(500).json({ message: "Error al obtener productos por categoría", error });
                }
                return res.status(200).json(results);
            });
        } catch (err) {
            console.error('Error inesperado:', err);
            return res.status(500).json({ message: "Error al obtener productos por categoría", error: err });
        }
    },

    // Middleware para manejar la subida de imagen
    upload: upload
};

module.exports = ProductoController;
