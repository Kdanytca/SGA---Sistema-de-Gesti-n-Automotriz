const Owner = require('../models/Owner');
const Vehicle = require('../models/Vehicle');

const ownerController = {
    // Obtener todos los propietarios
    getAll: async (req, res) => {
        try {
            const owners = await Owner.findAll({
                where: { activo: true },
                order: [['nombre', 'ASC']],
            });
            res.json(owners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener propietario por ID
    getById: async (req, res) => {
        try {
            const owner = await Owner.findByPk(req.params.id, {
                include: [
                    {
                        model: Vehicle,
                        required: false,
                        attributes: ['id', 'placa', 'marca', 'modelo', 'año', 'color', 'km_actual', 'estado', 'created_by'],
                    },
                ],
            });
            if (!owner) {
                return res.status(404).json({ error: 'Propietario no encontrado' });
            }

            res.json(owner);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear propietario
    create: async (req, res) => {
        try {
            const { nombre, apellido, telefono, email, direccion, documento } = req.body;

            const existingOwner = await Owner.findOne({ where: { documento } });
            if (existingOwner) {
                return res.status(400).json({ error: 'El documento ya está registrado' });
            }

            const owner = await Owner.create({
                nombre,
                apellido,
                telefono,
                email,
                direccion,
                documento,
                activo: true,
            });

            res.status(201).json({
                message: 'Propietario creado exitosamente',
                owner,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar propietario
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, apellido, telefono, email, direccion, documento, activo } = req.body;

            const owner = await Owner.findByPk(id);
            if (!owner) {
                return res.status(404).json({ error: 'Propietario no encontrado' });
            }

            if (documento && documento !== owner.documento) {
                const existingOwner = await Owner.findOne({ where: { documento } });
                if (existingOwner) {
                    return res.status(400).json({ error: 'El documento ya está registrado' });
                }
            }

            await owner.update({
                nombre,
                apellido,
                telefono,
                email,
                direccion,
                documento,
                activo,
            });

            res.json({
                message: 'Propietario actualizado exitosamente',
                owner,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Deshabilitar propietario
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const owner = await Owner.findByPk(id);

            if (!owner) {
                return res.status(404).json({ error: 'Propietario no encontrado' });
            }

            await owner.update({ activo: false });
            res.json({ message: 'Propietario deshabilitado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = ownerController;
