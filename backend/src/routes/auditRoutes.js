const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', auth, isAdmin, auditController.getAll);

module.exports = router;
