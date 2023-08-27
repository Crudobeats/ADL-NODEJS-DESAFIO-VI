const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { generateToken } = require('./auth');
const { verifyCredentials, validateToken, logQueries } = require("./middlewares");

const router = express.Router();

router.post("/usuarios", verifyCredentials, async (req, res) => {
  const { email, password, rol, lenguaje } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",[email]);
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguaje) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hashedPassword, rol, lenguaje]
    );
    const  token = generateToken(email);
    res.status(201).json({user: newUser.rows[0], token});
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("./login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1", [email]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordMatch) {
      return res.status(401).json({error: "Credemcoañes inválidas"});
    }

    const token = generateToken(email);
    res.json({error});
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({error: "Error en el servidor"})
  }
});

router.get("/usuarios", validateToken, logQueries, async (req, res) => {
  try {
    const email = req.user.email;

    const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error al obtener los datos del usuario", error);
    res.status(500).json({ error: "Error en el Servidor" });
  }
});

module.exports = router;
