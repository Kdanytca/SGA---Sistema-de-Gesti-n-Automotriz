const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            const issues = error.issues || error.errors || [];

            return res.status(400).json({
                error: 'Error de validación',
                detalles: issues.map(e => ({
                    campo: e.path[0],
                    mensaje: e.message
                }))
            });
        }
    };
};

module.exports = validate;
