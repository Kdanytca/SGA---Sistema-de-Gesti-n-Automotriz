const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);

router.get('/', ownerController.getAll);
router.get('/:id', ownerController.getById);
router.post('/', ownerController.create);
router.put('/:id', ownerController.update);
router.delete('/:id', isAdmin, ownerController.delete);

module.exports = router;
