const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;

const commonOptions = {
    dialect: 'postgres',
    logging: false,
};

const sslOptions = process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
    : {};

const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, {
        ...commonOptions,
        ...sslOptions,
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            ...commonOptions,
            host: process.env.DB_HOST,
            ...sslOptions,
        }
    );

module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.default = sequelize;
