const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

const syncVehicleStatus = async (vehicleId) => {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle || vehicle.estado === 'inactivo') {
        return;
    }

    const activeMaintenance = await Maintenance.findOne({
        where: {
            vehicle_id: vehicleId,
            estado: 'en_progreso',
        },
    });

    await vehicle.update({ estado: activeMaintenance ? 'mantenimiento' : 'activo' });
};

const maintenanceController = {
    // Crear mantenimiento
    create: async (req, res) => {
        try {
            const {
                tipo,
                descripcion,
                fecha_programada,
                fecha_realizacion,
                costo,
                estado,
                km_en_mantenimiento,
                vehicle_id
            } = req.body;

            // Verificar que el vehículo existe
            const vehicle = await Vehicle.findByPk(vehicle_id);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            const maintenance = await Maintenance.create({
                tipo,
                descripcion,
                fecha_programada,
                fecha_realizacion: fecha_realizacion || null,
                costo: costo || null,
                estado: estado || 'pendiente',
                km_en_mantenimiento: km_en_mantenimiento || null,
                vehicle_id,
                realizado_por: req.user.id,
            });

            await syncVehicleStatus(vehicle_id);

            res.status(201).json({
                message: 'Mantenimiento creado exitosamente',
                maintenance,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener todos los mantenimientos
    getAll: async (req, res) => {
        try {
            const maintenances = await Maintenance.findAll({
                include: [
                    {
                        model: Vehicle,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'nombre', 'email'],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
                order: [['fecha_programada', 'DESC']],
            });

            res.json(maintenances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener mantenimientos de un vehículo específico
    getByVehicle: async (req, res) => {
        try {
            const { vehicleId } = req.params;

            const vehicle = await Vehicle.findByPk(vehicleId);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            const maintenances = await Maintenance.findAll({
                where: { vehicle_id: vehicleId },
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
                order: [['fecha_programada', 'DESC']],
            });

            res.json(maintenances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener mantenimiento por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const maintenance = await Maintenance.findByPk(id, {
                include: [
                    {
                        model: Vehicle,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'nombre', 'email'],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });

            if (!maintenance) {
                return res.status(404).json({ error: 'Mantenimiento no encontrado' });
            }

            res.json(maintenance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar mantenimiento
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                tipo,
                descripcion,
                fecha_programada,
                fecha_realizacion,
                costo,
                estado,
                km_en_mantenimiento
            } = req.body;

            const maintenance = await Maintenance.findByPk(id, {
                include: [
                    {
                        model: Vehicle,
                    },
                ],
            });

            if (!maintenance) {
                return res.status(404).json({ error: 'Mantenimiento no encontrado' });
            }

            await maintenance.update({
                tipo,
                descripcion,
                fecha_programada,
                fecha_realizacion: fecha_realizacion || null,
                costo: costo || null,
                estado,
                km_en_mantenimiento: km_en_mantenimiento || null,
                realizado_por: req.user.id,
            });

            await syncVehicleStatus(maintenance.vehicle_id);

            res.json({
                message: 'Mantenimiento actualizado exitosamente',
                maintenance,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar mantenimiento
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const maintenance = await Maintenance.findByPk(id, {
                include: [
                    {
                        model: Vehicle,
                    },
                ],
            });

            if (!maintenance) {
                return res.status(404).json({ error: 'Mantenimiento no encontrado' });
            }

            // Solo admin puede eliminar
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Solo los administradores pueden eliminar mantenimientos' });
            }

            const vehicleId = maintenance.vehicle_id;

            await maintenance.destroy();
            await syncVehicleStatus(vehicleId);
            res.json({ message: 'Mantenimiento eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = maintenanceController;
