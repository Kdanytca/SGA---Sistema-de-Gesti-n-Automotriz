const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { auth, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createMaintenanceSchema, updateMaintenanceSchema } = require('../schemas/maintenanceSchemas');

router.post('/', auth, validate(createMaintenanceSchema), maintenanceController.create);
router.get('/', auth, maintenanceController.getAll);
router.get('/vehicle/:vehicleId', auth, maintenanceController.getByVehicle);
router.get('/:id', auth, maintenanceController.getById);
router.put('/:id', auth, validate(updateMaintenanceSchema), maintenanceController.update);
router.delete('/:id', auth, isAdmin, maintenanceController.delete);

module.exports = router;