const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Todas las rutas de usuarios requieren autenticación y ser admin
router.use(auth, isAdmin);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;