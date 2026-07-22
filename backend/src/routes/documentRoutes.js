const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { auth } = require('../middleware/auth');
const upload = require('../config/multer');

router.post(
    '/upload',
    auth,
    upload.single('archivo'),
    documentController.upload
);

router.get('/maintenance/:maintenanceId', auth, documentController.getByMaintenance);
router.get('/view/:id', auth, documentController.view);
router.get('/download/:id', auth, documentController.download);
router.delete('/:id', auth, documentController.delete);

module.exports = router;
