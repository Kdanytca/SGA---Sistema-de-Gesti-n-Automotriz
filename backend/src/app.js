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
const userRoutes = loadRoute(require('./routes/userRoutes'));
const ownerRoutes = loadRoute(require('./routes/ownerRoutes'));
const auditRoutes = loadRoute(require('./routes/auditRoutes'));
const authControllerModule = require('./controllers/authController');
const documentController = require('./controllers/documentController');
const validateModule = require('./middleware/validate');
const authMiddlewareModule = require('./middleware/auth');
const authSchemasModule = require('./schemas/authSchemas');
const upload = require('./config/multer');
const authController = authControllerModule.default || authControllerModule;
const validate = validateModule.default || validateModule;
const authMiddleware = authMiddlewareModule.default || authMiddlewareModule;
const authSchemas = authSchemasModule.default || authSchemasModule;

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
app.post('/api/auth/register', validate(authSchemas.registerSchema), authController.register);
app.post('/api/auth/login', validate(authSchemas.loginSchema), authController.login);
app.get('/api/auth/profile', authMiddleware.auth, authController.getProfile);

app.post('/api/documents/upload', authMiddleware.auth, upload.single('archivo'), documentController.upload);
app.get('/api/documents/maintenance/:maintenanceId', authMiddleware.auth, documentController.getByMaintenance);
app.get('/api/documents/view/:id', authMiddleware.auth, documentController.view);
app.get('/api/documents/download/:id', authMiddleware.auth, documentController.download);
app.delete('/api/documents/:id', authMiddleware.auth, documentController.delete);

const registerRoute = (prefix, route) => {
    if (typeof route === 'function') {
        app.use(prefix, route);
    } else {
        console.warn(`Ruta ${prefix} omitida: handler inválido`);
    }
};

registerRoute('/api/auth', authRoutes);
registerRoute('/api/vehicles', vehicleRoutes);
registerRoute('/api/maintenances', maintenanceRoutes);
registerRoute('/api/usuarios', userRoutes);
registerRoute('/api/owners', ownerRoutes);
registerRoute('/api/audit', auditRoutes);

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
