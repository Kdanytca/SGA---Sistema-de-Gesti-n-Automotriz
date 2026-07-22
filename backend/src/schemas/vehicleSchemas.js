const { z } = require('zod');

const createVehicleSchema = z.object({
    placa: z.string()
        .min(3, 'La placa debe tener al menos 3 caracteres')
        .max(10, 'La placa no puede tener más de 10 caracteres')
        .toUpperCase(),

    marca: z.string()
        .min(2, 'La marca debe tener al menos 2 caracteres')
        .max(50, 'La marca no puede tener más de 50 caracteres'),

    modelo: z.string()
        .min(1, 'El modelo es requerido')
        .max(50, 'El modelo no puede tener más de 50 caracteres'),

    año: z.number()
        .int('El año debe ser un número entero')
        .min(1900, 'El año debe ser mayor o igual a 1900')
        .max(new Date().getFullYear() + 1, `El año no puede ser mayor a ${new Date().getFullYear() + 1}`),

    color: z.string()
        .min(3, 'El color debe tener al menos 3 caracteres')
        .max(30, 'El color no puede tener más de 30 caracteres'),

    km_actual: z.number()
        .int('Los kilómetros deben ser un número entero')
        .min(0, 'Los kilómetros no pueden ser negativos')
        .default(0),

    estado: z.enum(['activo', 'mantenimiento', 'inactivo'])
        .default('activo')
        .optional(),
});

const updateVehicleSchema = z.object({
    placa: z.string()
        .min(3, 'La placa debe tener al menos 3 caracteres')
        .max(10, 'La placa no puede tener más de 10 caracteres')
        .toUpperCase()
        .optional(),

    marca: z.string()
        .min(2, 'La marca debe tener al menos 2 caracteres')
        .max(50, 'La marca no puede tener más de 50 caracteres')
        .optional(),

    modelo: z.string()
        .min(1, 'El modelo es requerido')
        .max(50, 'El modelo no puede tener más de 50 caracteres')
        .optional(),

    año: z.number()
        .int('El año debe ser un número entero')
        .min(1900, 'El año debe ser mayor o igual a 1900')
        .max(new Date().getFullYear() + 1, `El año no puede ser mayor a ${new Date().getFullYear() + 1}`)
        .optional(),

    color: z.string()
        .min(3, 'El color debe tener al menos 3 caracteres')
        .max(30, 'El color no puede tener más de 30 caracteres')
        .optional(),

    km_actual: z.number()
        .int('Los kilómetros deben ser un número entero')
        .min(0, 'Los kilómetros no pueden ser negativos')
        .optional(),

    estado: z.enum(['activo', 'mantenimiento', 'inactivo'])
        .optional(),
});

module.exports = {
    createVehicleSchema,
    updateVehicleSchema,
};