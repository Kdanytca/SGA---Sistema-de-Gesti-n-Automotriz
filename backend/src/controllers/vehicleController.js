const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Owner = require('../models/Owner');
const Maintenance = require('../models/Maintenance');
const Document = require('../models/Document');

const vehicleController = {
    // Crear vehículo
    create: async (req, res) => {
        try {
            const { placa, marca, modelo, año, color, km_actual, estado, owner_id } = req.body;

            // Verificar que el propietario existe
            if (owner_id) {
                const owner = await Owner.findByPk(owner_id);
                if (!owner) {
                    return res.status(400).json({ error: 'El propietario no existe' });
                }
            }

            const existingVehicle = await Vehicle.findOne({ where: { placa } });
            if (existingVehicle) {
                return res.status(400).json({ error: 'La placa ya está registrada' });
            }

            const vehicle = await Vehicle.create({
                placa,
                marca,
                modelo,
                año,
                color,
                km_actual: km_actual || 0,
                estado: estado || 'activo',
                created_by: req.user.id,
                owner_id: owner_id, // 👈 Agregar owner_id
            });

            res.status(201).json({
                message: 'Vehículo creado exitosamente',
                vehicle,
            });
        } catch (error) {
            console.error('Error al crear vehículo:', error); // 👈 Para debug
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener todos los vehículos
    getAll: async (req, res) => {
        try {
            const vehicles = await Vehicle.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'nombre', 'email'],
                    },
                    {
                        model: Owner, // 👈 Incluir propietario
                        attributes: ['id', 'nombre', 'apellido', 'documento', 'telefono', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(vehicles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener vehículo por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'nombre', 'email'],
                    },
                    {
                        model: Owner, // 👈 Incluir propietario
                        attributes: ['id', 'nombre', 'apellido', 'documento', 'telefono', 'email'],
                    },
                    {
                        model: Maintenance,
                        required: false,
                        include: [
                            {
                                model: User,
                                as: 'User',
                                attributes: ['id', 'nombre', 'email'],
                            },
                            {
                                model: Document,
                                as: 'documents',
                                required: false,
                                include: [
                                    {
                                        model: User,
                                        as: 'user',
                                        attributes: ['id', 'nombre', 'email'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            res.json(vehicle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar vehículo
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { placa, marca, modelo, año, color, km_actual, estado, owner_id } = req.body;

            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            // Verificar que el propietario existe si se envía
            if (owner_id) {
                const owner = await Owner.findByPk(owner_id);
                if (!owner) {
                    return res.status(400).json({ error: 'El propietario no existe' });
                }
            }

            const updateData = {
                placa,
                marca,
                modelo,
                año,
                color,
                km_actual,
                estado,
            };

            if (owner_id !== undefined) {
                updateData.owner_id = owner_id;
            }

            await vehicle.update(updateData);

            res.json({
                message: 'Vehículo actualizado exitosamente',
                vehicle,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar vehículo
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Solo los administradores pueden eliminar vehículos' });
            }

            await vehicle.destroy();
            res.json({ message: 'Vehículo eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = vehicleController;
