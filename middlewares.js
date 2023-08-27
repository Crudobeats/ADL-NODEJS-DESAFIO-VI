const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split('')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json ({ error: 'Token inválido' });
    }
}

const verifyCredentials = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Credenciales incompletas' });
    }
    next();
};

const logQueries = (req, res, next) => {
    console.log(`Consulta recibida: ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = { validateToken, verifyCredentials, logQueries };