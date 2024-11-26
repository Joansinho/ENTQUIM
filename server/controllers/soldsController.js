const db = require('../config/conexion'); // Conexión a la base de datos

const ventasController = {
    createVentaConDetalles: (req, res) => {
        const { fecha, total, estado, detalles, metodo_pago, id_metodo_pago } = req.body;

        // Verifica que los campos obligatorios estén presentes
        if (!fecha || !total || !estado || !Array.isArray(detalles) || detalles.length === 0 || !metodo_pago) {
            return res.status(400).json({
                error: 'Todos los campos de la venta, los detalles y el método de pago son obligatorios.'
            });
        }

        // Validar el método de pago
        if (metodo_pago === 'TARJETA' && !id_metodo_pago) {
            return res.status(400).json({
                error: 'Si el método de pago es TARJETA, el id_metodo_pago es obligatorio.'
            });
        }

        // Obtiene el id_usuarios y correo del usuario autenticado
        const { id } = req.user; // El id del usuario logueado
        const correo = req.body.correo || req.user.correo; // Si no se pasa el correo, se usa el del token

        // Inicia la transacción
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al iniciar la transacción', detalles: err });
            }

            // Inserta la venta
            const ventaQuery = `INSERT INTO ventas (fecha, total, estado, correo, id_usuarios) VALUES (?, ?, ?, ?, ?)`;
            db.query(ventaQuery, [fecha, total, estado, correo, id], (err, ventaResult) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Error al insertar la venta', detalles: err });
                    });
                }

                const id_venta = ventaResult.insertId;

                // Prepara los detalles de la venta con el método de pago
                const detalleQuery = `
                    INSERT INTO detalles_de_ventas (id_producto, id_venta, cantidad, precio_Unitario, metodo_pago, id_metodo_pago) 
                    VALUES ?
                `;
                const detalleData = detalles.map((detalle) => [
                    detalle.id_producto,
                    id_venta,
                    detalle.cantidad,
                    detalle.precio_Unitario,
                    metodo_pago,
                    metodo_pago === 'TARJETA' ? id_metodo_pago : null
                ]);

                // Inserta los detalles
                db.query(detalleQuery, [detalleData], (err, detalleResult) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error al insertar los detalles de la venta', detalles: err });
                        });
                    }

                    // Confirma la transacción
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Error al confirmar la transacción', detalles: err });
                            });
                        }

                        res.status(201).json({
                            message: 'Venta y detalles creados exitosamente',
                            id_venta,
                            detalles_insertados: detalleResult.affectedRows
                        });
                    });
                });
            });
        });
    },

    getVentasByUsuario: (req, res) => {
        const { id } = req.user; // Obtenemos el ID del usuario logueado desde el middleware
    
        // Consulta para obtener ventas con sus detalles
        const query = `
            SELECT 
                v.id_venta, v.fecha, v.total, v.estado, v.correo,
                dv.id_producto, dv.cantidad, dv.precio_Unitario, dv.metodo_pago, dv.id_metodo_pago
            FROM ventas v
            INNER JOIN detalles_de_ventas dv ON v.id_venta = dv.id_venta
            WHERE v.id_usuarios = ?
            ORDER BY v.fecha DESC
        `;
    
        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener las ventas del usuario', detalles: err });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron ventas para este usuario.' });
            }
    
            // Agrupar las ventas y sus detalles
            const ventasAgrupadas = results.reduce((acc, row) => {
                const ventaExistente = acc.find(v => v.id_venta === row.id_venta);
                const detalle = {
                    id_producto: row.id_producto,
                    cantidad: row.cantidad,
                    precio_Unitario: row.precio_Unitario,
                    metodo_pago: row.metodo_pago,
                    id_metodo_pago: row.id_metodo_pago
                };
    
                if (ventaExistente) {
                    ventaExistente.detalles.push(detalle);
                } else {
                    acc.push({
                        id_venta: row.id_venta,
                        fecha: row.fecha,
                        total: row.total,
                        estado: row.estado,
                        correo: row.correo,
                        detalles: [detalle]
                    });
                }
    
                return acc;
            }, []);
    
            res.status(200).json(ventasAgrupadas);
        });
    },
    
    getAllVentas: (req, res) => {
        const query = `
            SELECT 
                v.id_venta, v.fecha, v.total, v.estado, v.correo, v.id_usuarios,
                dv.id_producto, dv.cantidad, dv.precio_Unitario, dv.metodo_pago, dv.id_metodo_pago
            FROM ventas v
            INNER JOIN detalles_de_ventas dv ON v.id_venta = dv.id_venta
            ORDER BY v.fecha DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener todas las ventas', detalles: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron ventas en el sistema.' });
            }

            // Agrupar ventas y sus detalles
            const ventasAgrupadas = results.reduce((acc, row) => {
                const ventaExistente = acc.find(v => v.id_venta === row.id_venta);
                const detalle = {
                    id_producto: row.id_producto,
                    cantidad: row.cantidad,
                    precio_Unitario: row.precio_Unitario,
                    metodo_pago: row.metodo_pago,
                    id_metodo_pago: row.id_metodo_pago
                };

                if (ventaExistente) {
                    ventaExistente.detalles.push(detalle);
                } else {
                    acc.push({
                        id_venta: row.id_venta,
                        fecha: row.fecha,
                        total: row.total,
                        estado: row.estado,
                        correo: row.correo,
                        id_usuarios: row.id_usuarios,
                        detalles: [detalle]
                    });
                }

                return acc;
            }, []);

            res.status(200).json(ventasAgrupadas);
        });
    }

};

module.exports = ventasController;
