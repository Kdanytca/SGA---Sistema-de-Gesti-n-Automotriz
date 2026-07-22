const User = require('../models/User');

const seedDefaultUsers = async () => {
    const defaultUsers = [
        {
            nombre: 'Administrador',
            email: 'admin@admin.com',
            password: 'admin123',
            rol: 'admin',
            activo: true,
        },
        {
            nombre: 'Mecánico',
            email: 'mecanico@mecanico.com',
            password: 'admin123',
            rol: 'mecanico',
            activo: true,
        },
    ];

    for (const user of defaultUsers) {
        await User.findOrCreate({
            where: { email: user.email },
            defaults: user,
        });
    }
};

module.exports = seedDefaultUsers;
