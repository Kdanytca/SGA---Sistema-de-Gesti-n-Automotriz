const { DataTypes } = require('sequelize');
const database = require('../config/database');
const User = require('./User');
const Owner = require('./Owner');

const sequelize = database.default || database;

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    placa: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1900,
            max: new Date().getFullYear() + 1,
        },
    },
    color: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    km_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    estado: {
        type: DataTypes.ENUM('activo', 'mantenimiento', 'inactivo'),
        defaultValue: 'activo',
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Owners',
            key: 'id',
        },
    },
});

// Relaciones
User.hasMany(Vehicle, { foreignKey: 'created_by' });
Vehicle.belongsTo(User, { foreignKey: 'created_by' });

Owner.hasMany(Vehicle, { foreignKey: 'owner_id' });
Vehicle.belongsTo(Owner, { foreignKey: 'owner_id' });

module.exports = Vehicle;
