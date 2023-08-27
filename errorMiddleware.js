const errorMiddleware = (error, req, res, next) => {
    console.error("Error no controlado:" , error);

    const erroMessage = `Error en la ruta ${req.method} ${req.originalUrl}: ${error.message}`;

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({error: erroMessage});
};

module.exports = errorMiddleware;