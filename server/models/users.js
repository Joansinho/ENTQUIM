const db = require('../config/conexion');
const bcrypt = require('bcrypt');

class Usuario {
    // Obtener todos los usuarios
    static getAllUsers(callback) {
        const query = 'SELECT * FROM Usuarios';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }

    // Buscar usuario por correo
    static findByEmail(correo, callback) {
        const query = 'SELECT * FROM Usuarios WHERE correo = ?';
        db.query(query, [correo], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    }

    // Crear nuevo usuario
    static async createUser(userData) {
        const { correo, contrasena, nombre, apellido, rol, fecha_nacimiento, telefono, direccion } = userData;
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const query = `
            INSERT INTO Usuarios (correo, contrasena, nombre, apellido, id_rol, fecha_nacimiento, telefono, direccion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [correo, hashedPassword, nombre, apellido, rol, fecha_nacimiento, telefono, direccion], (err, results) => {
                    if (err) return reject(err);
                    resolve({ id_usuarios: results.insertId, ...userData });
                });
            });
            return results;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw new Error('No se pudo crear el usuario.');
        }
    }    

    // Eliminar usuario por ID
    static deleteUserById(id, callback) {
        const query = 'DELETE FROM Usuarios WHERE id_usuarios = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }

    // Obtener métodos de pago del usuario
    static getPaymentMethods(userId, callback) {
        const query = 'SELECT * FROM Metodos_Pago WHERE id_usuarios = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Usuario;
