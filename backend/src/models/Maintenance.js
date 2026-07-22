const { DataTypes } = require('sequelize');
const database = require('../config/database');
const Vehicle = require('./Vehicle');
const User = require('./User');

const sequelize = database.default || database;

const Maintenance = sequelize.define('Maintenance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.ENUM('preventivo', 'correctivo', 'inspeccion', 'general'),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha_programada: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_realizacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_progreso', 'completado', 'cancelado'),
        defaultValue: 'pendiente',
    },
    km_en_mantenimiento: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehicle,
            key: 'id',
        },
    },
    realizado_por: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
});

// Relaciones
Vehicle.hasMany(Maintenance, { foreignKey: 'vehicle_id' });
Maintenance.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

User.hasMany(Maintenance, { foreignKey: 'realizado_por' });
Maintenance.belongsTo(User, { foreignKey: 'realizado_por' });

module.exports = Maintenance;
