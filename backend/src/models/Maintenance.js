const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const Vehicle = require('./Vehicle');
const User = require('./User');

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
