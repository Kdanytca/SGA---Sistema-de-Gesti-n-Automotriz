const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Sequelize } = require('sequelize');
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
const seedDefaultUsers = require('./seeders/defaultUsers');

// Importar modelos
require('./models/User');
require('./models/Vehicle');
require('./models/Document');
require('./models/Owner');



// Importar rutas
const loadRoute = (route, seen = new Set()) => {
    if (!route || seen.has(route)) return route;
    if (typeof route === 'function') return route;

    seen.add(route);

    if (route.default) {
        const defaultRoute = loadRoute(route.default, seen);
        if (typeof defaultRoute === 'function') return defaultRoute;
    }

    for (const value of Object.values(route)) {
        const foundRoute = loadRoute(value, seen);
        if (typeof foundRoute === 'function') return foundRoute;
    }

    return route;
};
const authRoutes = loadRoute(require('./routes/authRoutes'));
const vehicleRoutes = loadRoute(require('./routes/vehicleRoutes'));
const maintenanceRoutes = loadRoute(require('./routes/maintenanceRoutes'));
const documentRoutes = loadRoute(require('./routes/documentRoutes'));
const userRoutes = loadRoute(require('./routes/userRoutes'));
const ownerRoutes = loadRoute(require('./routes/ownerRoutes'));
const auditRoutes = loadRoute(require('./routes/auditRoutes'));

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
const uploadsMiddleware = express.static(path.join(__dirname, '../uploads'));
if (typeof uploadsMiddleware === 'function') {
    app.use('/uploads', uploadsMiddleware);
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/audit', auditRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Sistema de Mantenimiento Vehicular' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

if (process.env.ENABLE_DB_SYNC === 'true') {
    sequelize.sync({ alter: true })
        .then(async () => {
            console.log('Base de datos sincronizada');
            await seedDefaultUsers();
            console.log('Usuarios demo verificados');
            startServer();
        })
        .catch((error) => {
            console.error('Error al sincronizar la base de datos:', error);
        });
} else {
    startServer();
}

module.exports = app;
