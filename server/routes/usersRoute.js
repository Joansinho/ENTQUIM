const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para iniciar sesión
router.post('/login', userController.login);

// Ruta para registrar un nuevo usuario
router.post('/register', userController.register);

// Ruta para eliminar un usuario
router.delete('/:id', userController.deleteUserById);

// Ruta para cambiar el rol de un usuario
router.put('/changeRole/:id', userController.changeUserRole);

// Ruta para cerrar sesión
router.post('/logout', userController.logout); // Ruta para cerrar sesión

// Ruta para verificar el token
router.get('/verify-token', userController.verifyToken);

//invalida el token al cerrar la sesion
router.post('/invalidate-token', userController.invalidateToken);

// Ruta para eliminar el token por su id
router.delete('/tokens/:id', userController.deleteTokenById); 

// Ruta para verificar la contraseña del usuario
router.post('/verificar-contrasena', authMiddleware, userController.verifyPassword);

// ruta para actualizar informacion del usuario autenticado
router.put('/actualizar', authMiddleware, userController.updateUser);

module.exports = router;
