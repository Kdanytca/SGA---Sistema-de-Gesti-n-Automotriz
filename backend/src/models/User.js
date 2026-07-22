const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;
const sequelize = global.__sgaSequelize || (databaseUrl
    ? new Sequelize(databaseUrl, {
        dialect: 'postgres',
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
        logging: false,
    }));

global.__sgaSequelize = sequelize;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'mecanico'),
        defaultValue: 'mecanico',
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
    },
});

module.exports = User;
