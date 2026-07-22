const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createVehicleSchema, updateVehicleSchema } = require('../schemas/vehicleSchemas');

router.post('/', auth, validate(createVehicleSchema), vehicleController.create);
router.get('/', auth, vehicleController.getAll);
router.get('/:id', auth, vehicleController.getById);
router.put('/:id', auth, validate(updateVehicleSchema), vehicleController.update);
router.delete('/:id', auth, isAdmin, vehicleController.delete);

module.exports = router;