const { DataTypes } = require('sequelize');
const sequelizeConfig = require('../config/sequelize');

const sequelize = sequelizeConfig.define ? sequelizeConfig : sequelizeConfig.default;

const Owner = sequelize.define('Owner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    documento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = Owner;
