const Vehicle = require('../models/Vehicle');
const Maintenance = require('../models/Maintenance');
const Document = require('../models/Document');
const User = require('../models/User');
const Owner = require('../models/Owner');

const wasUpdated = (record) => {
    return new Date(record.updatedAt).getTime() - new Date(record.createdAt).getTime() > 1000;
};

const auditController = {
    getAll: async (req, res) => {
        try {
            const [vehicles, maintenances, documents] = await Promise.all([
                Vehicle.findAll({
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'nombre', 'email'],
                        },
                        {
                            model: Owner,
                            attributes: ['id', 'nombre', 'apellido'],
                        },
                    ],
                    order: [['updatedAt', 'DESC']],
                    limit: 50,
                }),
                Maintenance.findAll({
                    include: [
                        {
                            model: User,
                            as: 'User',
                            attributes: ['id', 'nombre', 'email'],
                        },
                        {
                            model: Vehicle,
                            attributes: ['id', 'placa', 'marca', 'modelo'],
                        },
                    ],
                    order: [['updatedAt', 'DESC']],
                    limit: 50,
                }),
                Document.findAll({
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'nombre', 'email'],
                        },
                        {
                            model: Maintenance,
                            as: 'maintenance',
                            attributes: ['id', 'tipo'],
                            include: [
                                {
                                    model: Vehicle,
                                    attributes: ['id', 'placa', 'marca', 'modelo'],
                                },
                            ],
                        },
                    ],
                    order: [['updatedAt', 'DESC']],
                    limit: 50,
                }),
            ]);

            const events = [];

            vehicles.forEach((vehicle) => {
                const vehicleLabel = `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}`;
                const ownerLabel = vehicle.Owner ? `${vehicle.Owner.nombre} ${vehicle.Owner.apellido}` : 'Sin propietario';

                events.push({
                    id: `vehicle-created-${vehicle.id}`,
                    fecha: vehicle.createdAt,
                    tipo: 'vehiculo',
                    accion: 'Registró vehículo',
                    usuario: vehicle.User?.nombre || 'Usuario no disponible',
                    detalle: `${vehicleLabel} (${ownerLabel})`,
                });

                if (wasUpdated(vehicle)) {
                    events.push({
                        id: `vehicle-updated-${vehicle.id}`,
                        fecha: vehicle.updatedAt,
                        tipo: 'vehiculo',
                        accion: 'Actualizó vehículo',
                        usuario: vehicle.User?.nombre || 'Usuario no disponible',
                        detalle: vehicleLabel,
                    });
                }
            });

            maintenances.forEach((maintenance) => {
                const vehicleLabel = maintenance.Vehicle
                    ? `${maintenance.Vehicle.placa} - ${maintenance.Vehicle.marca} ${maintenance.Vehicle.modelo}`
                    : 'Vehículo no disponible';

                events.push({
                    id: `maintenance-created-${maintenance.id}`,
                    fecha: maintenance.createdAt,
                    tipo: 'mantenimiento',
                    accion: 'Registró mantenimiento',
                    usuario: maintenance.User?.nombre || 'Usuario no disponible',
                    detalle: `#${maintenance.id} - ${maintenance.tipo} - ${vehicleLabel}`,
                });

                if (wasUpdated(maintenance)) {
                    events.push({
                        id: `maintenance-updated-${maintenance.id}`,
                        fecha: maintenance.updatedAt,
                        tipo: 'mantenimiento',
                        accion: 'Actualizó mantenimiento',
                        usuario: maintenance.User?.nombre || 'Usuario no disponible',
                        detalle: `#${maintenance.id} - ${maintenance.estado} - ${vehicleLabel}`,
                    });
                }
            });

            documents.forEach((document) => {
                const vehicle = document.maintenance?.Vehicle;
                const vehicleLabel = vehicle ? `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}` : 'Vehículo no disponible';

                events.push({
                    id: `document-created-${document.id}`,
                    fecha: document.createdAt,
                    tipo: 'documento',
                    accion: 'Subió documento',
                    usuario: document.user?.nombre || 'Usuario no disponible',
                    detalle: `${document.nombre_original} - ${vehicleLabel}`,
                });

                if (wasUpdated(document)) {
                    events.push({
                        id: `document-updated-${document.id}`,
                        fecha: document.updatedAt,
                        tipo: 'documento',
                        accion: 'Actualizó documento',
                        usuario: document.user?.nombre || 'Usuario no disponible',
                        detalle: `${document.nombre_original} - ${vehicleLabel}`,
                    });
                }
            });

            events.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            res.json(events.slice(0, 100));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = auditController;
