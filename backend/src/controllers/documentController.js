const Document = require('../models/Document');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const canAccessMaintenance = (user, maintenance) => {
    return Boolean(user && maintenance);
};

const findDocumentWithMaintenance = (id) => {
    return Document.findByPk(id, {
        include: [
            {
                model: Maintenance,
                as: 'maintenance',
                include: [
                    {
                        model: Vehicle,
                    },
                ],
            },
        ],
    });
};

const documentController = {
    // Subir documento
    upload: async (req, res) => {
        try {
            const {
                maintenance_id,
                pieza_descripcion,
                garantia_hasta,
            } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: 'No se ha subido ningún archivo' });
            }

            const maintenance = await Maintenance.findByPk(maintenance_id, {
                include: [
                    {
                        model: Vehicle,
                    },
                ],
            });
            if (!maintenance) {
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Mantenimiento no encontrado' });
            }

            if (!canAccessMaintenance(req.user, maintenance)) {
                fs.unlinkSync(req.file.path);
                return res.status(403).json({ error: 'No tienes permiso para subir documentos a este mantenimiento' });
            }

            const document = await Document.create({
                nombre_original: req.file.originalname,
                nombre_guardado: req.file.filename,
                ruta: req.file.path,
                tipo_archivo: req.file.mimetype,
                tamaño: req.file.size,
                pieza_descripcion: pieza_descripcion || null,
                garantia_hasta: garantia_hasta || null,
                maintenance_id,
                subido_por: req.user.id,
            });

            res.status(201).json({
                message: 'Documento subido exitosamente',
                document: {
                    id: document.id,
                    nombre_original: document.nombre_original,
                    tamaño: document.tamaño,
                    tipo_archivo: document.tipo_archivo,
                    pieza_descripcion: document.pieza_descripcion,
                    garantia_hasta: document.garantia_hasta,
                    created_at: document.createdAt,
                },
            });
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener documentos de un mantenimiento
    getByMaintenance: async (req, res) => {
        try {
            const { maintenanceId } = req.params;

            const maintenance = await Maintenance.findByPk(maintenanceId, {
                include: [
                    {
                        model: Vehicle,
                    },
                ],
            });
            if (!maintenance) {
                return res.status(404).json({ error: 'Mantenimiento no encontrado' });
            }

            if (!canAccessMaintenance(req.user, maintenance)) {
                return res.status(403).json({ error: 'No tienes permiso para ver documentos de este mantenimiento' });
            }

            const documents = await Document.findAll({
                where: { maintenance_id: maintenanceId },
                include: [
                    {
                        model: User,
                        as: 'user', // 👈 Agregar el alias 'user'
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(documents);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener documentos',
                details: error.message
            });
        }
    },

    // Descargar documento
    download: async (req, res) => {
        try {
            const { id } = req.params;

            const document = await findDocumentWithMaintenance(id);
            if (!document) {
                return res.status(404).json({ error: 'Documento no encontrado' });
            }

            if (!canAccessMaintenance(req.user, document.maintenance)) {
                return res.status(403).json({ error: 'No tienes permiso para descargar este documento' });
            }

            if (!fs.existsSync(document.ruta)) {
                return res.status(404).json({ error: 'El archivo no existe en el servidor' });
            }

            res.download(document.ruta, document.nombre_original);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    view: async (req, res) => {
        try {
            const { id } = req.params;

            const document = await findDocumentWithMaintenance(id);
            if (!document) {
                return res.status(404).json({ error: 'Documento no encontrado' });
            }

            if (!canAccessMaintenance(req.user, document.maintenance)) {
                return res.status(403).json({ error: 'No tienes permiso para ver este documento' });
            }

            if (!fs.existsSync(document.ruta)) {
                return res.status(404).json({ error: 'El archivo no existe en el servidor' });
            }

            res.setHeader('Content-Type', document.tipo_archivo);
            res.setHeader('Content-Disposition', `inline; filename="${document.nombre_original}"`);
            res.sendFile(path.resolve(document.ruta));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar documento
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const document = await Document.findByPk(id);
            if (!document) {
                return res.status(404).json({ error: 'Documento no encontrado' });
            }

            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Solo administradores pueden eliminar documentos' });
            }

            if (fs.existsSync(document.ruta)) {
                fs.unlinkSync(document.ruta);
            }

            await document.destroy();
            res.json({ message: 'Documento eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = documentController;
