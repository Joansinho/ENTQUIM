const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/soldsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/con-detalles',authMiddleware, ventasController.createVentaConDetalles);
router.get('/', authMiddleware, ventasController.getVentasByUsuario);
router.get('/all', authMiddleware, ventasController.getAllVentas);

module.exports = router;
