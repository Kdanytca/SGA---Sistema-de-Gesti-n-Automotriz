const { z } = require('zod');

const registerSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),

    email: z.string()
        .email('Email inválido')
        .max(100, 'El email no puede tener más de 100 caracteres'),

    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),

    rol: z.enum(['admin', 'mecanico']).optional()
});

const loginSchema = z.object({
    email: z.string()
        .email('Email inválido'),

    password: z.string()
        .min(1, 'La contraseña es requerida')
});

module.exports = {
    registerSchema,
    loginSchema,
};