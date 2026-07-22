const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const user = await User.create({
                nombre,
                email,
                password,
                rol: rol || 'mecanico',
            });

            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                },
                token,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // ✅ Verificar si el usuario está activo antes de validar contraseña
            if (!user.activo) {
                return res.status(401).json({
                    error: 'Usuario inactivo. Contacta al administrador.'
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                },
                token,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
            });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = authController;
