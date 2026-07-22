const { z } = require('zod');

const createMaintenanceSchema = z.object({
    tipo: z.enum(['preventivo', 'correctivo', 'inspeccion', 'general']),

    descripcion: z.string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(500, 'La descripción no puede tener más de 500 caracteres'),

    fecha_programada: z.string()
        .datetime('Formato de fecha inválido'),

    fecha_realizacion: z.string()
        .datetime('Formato de fecha inválido')
        .optional()
        .nullable(),

    costo: z.number()
        .positive('El costo debe ser un número positivo')
        .optional()
        .nullable(),

    estado: z.enum(['pendiente', 'en_progreso', 'completado', 'cancelado'])
        .default('pendiente')
        .optional(),

    km_en_mantenimiento: z.number()
        .int('Los kilómetros deben ser un número entero')
        .min(0, 'Los kilómetros no pueden ser negativos')
        .optional()
        .nullable(),

    vehicle_id: z.number()
        .int('El ID del vehículo debe ser un número entero')
        .positive('El ID del vehículo debe ser un número positivo'),
});

const updateMaintenanceSchema = z.object({
    tipo: z.enum(['preventivo', 'correctivo', 'inspeccion', 'general']).optional(),

    descripcion: z.string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .max(500, 'La descripción no puede tener más de 500 caracteres')
        .optional(),

    fecha_programada: z.string()
        .datetime('Formato de fecha inválido')
        .optional(),

    fecha_realizacion: z.string()
        .datetime('Formato de fecha inválido')
        .optional()
        .nullable(),

    costo: z.number()
        .positive('El costo debe ser un número positivo')
        .optional()
        .nullable(),

    estado: z.enum(['pendiente', 'en_progreso', 'completado', 'cancelado']).optional(),

    km_en_mantenimiento: z.number()
        .int('Los kilómetros deben ser un número entero')
        .min(0, 'Los kilómetros no pueden ser negativos')
        .optional()
        .nullable(),
});

module.exports = {
    createMaintenanceSchema,
    updateMaintenanceSchema,
};