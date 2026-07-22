const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Maintenance = require('./Maintenance');
const User = require('./User');

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_original: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_guardado: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ruta: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    tipo_archivo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    tamaño: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pieza_descripcion: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    fecha_compra: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    garantia_hasta: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    maintenance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Maintenances',
            key: 'id',
        },
    },
    subido_por: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
});

// Relaciones
Maintenance.hasMany(Document, { foreignKey: 'maintenance_id', as: 'documents' });
Document.belongsTo(Maintenance, { foreignKey: 'maintenance_id', as: 'maintenance' });

User.hasMany(Document, { foreignKey: 'subido_por', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'subido_por', as: 'user' });

module.exports = Document;
