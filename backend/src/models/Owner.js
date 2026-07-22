const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;
const sequelize = global.__sgaSequelize || (databaseUrl
    ? new Sequelize(databaseUrl, {
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        } : {},
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
    }));

global.__sgaSequelize = sequelize;

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
