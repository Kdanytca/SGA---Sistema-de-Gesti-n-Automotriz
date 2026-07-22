const User = require('../models/User');

const userController = {
    // Obtener todos los usuarios
    getAll: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso denegado' });
            }

            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['id', 'ASC']],
            });

            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener usuario por ID
    getById: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso denegado' });
            }

            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] },
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear usuario
    create: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso denegado' });
            }

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
                activo: true,
            });

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    activo: user.activo,
                },
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar usuario
    update: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso denegado' });
            }

            const { id } = req.params;
            const { nombre, email, password, rol, activo } = req.body;

            // No permitir deshabilitar al propio usuario
            if (parseInt(id) === req.user.id && activo === false) {
                return res.status(400).json({
                    error: 'No puedes deshabilitar tu propia cuenta'
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
            }

            const updateData = {};
            if (nombre) updateData.nombre = nombre;
            if (email) updateData.email = email;
            if (password) updateData.password = password;
            if (rol) updateData.rol = rol;
            if (activo !== undefined) updateData.activo = activo;

            await user.update(updateData);

            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ['password'] },
            });

            res.json({
                message: 'Usuario actualizado exitosamente',
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Deshabilitar usuario
    delete: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso denegado' });
            }

            const { id } = req.params;

            // No permitir deshabilitar al propio usuario
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    error: 'No puedes deshabilitar tu propia cuenta'
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            await user.update({ activo: false });

            res.json({ message: 'Usuario deshabilitado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = userController;