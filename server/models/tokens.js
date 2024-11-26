// tokenModel.js
const db = require('../config/conexion'); // Asegúrate de que tu conexión a la base de datos esté configurada aquí.

const insertToken = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tokens_usuarios (id_usuarios, token, expires_at) VALUES (?, ?, ?)';
        db.query(query, [userId, token, expiresAt], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tokens_usuarios WHERE token = ?';
        db.query(query, [token], (error, results) => {
            if (error) return reject(error);
            if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null); // Token no encontrado
            }
        });
    });
};

// Nueva función para eliminar un token
const deleteToken = (token) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tokens_usuarios WHERE token = ?';
        db.query(query, [token], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const deleteTokenById = (tokenId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tokens_usuarios WHERE id_token = ?'; // Asegúrate de que el nombre de la columna sea correcto
        db.query(query, [tokenId], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};


module.exports = { insertToken, verifyToken, deleteToken, deleteTokenById }; // Asegúrate de exportar la nueva función
