const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        if (!user.activo) {
            return res.status(401).json({
                error: 'Usuario deshabilitado. Contacta al administrador.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
    next();
};

module.exports = { auth, isAdmin };