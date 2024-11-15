// backend/routes/users.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');


// Ruta para registrar usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, contrasena, nombreUsuario, correo, telefono, direccion, tipoDocumento, numeroDocumento, estado, rol } = req.body;


        const nuevoUsuario = new Usuario({
            nombre,
            contrasena, 
            nombreUsuario,
            correo,
            telefono,
            direccion,
            tipoDocumento,
            numeroDocumento,
            estado,
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: "Cliente registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el cliente", error });
    }
});


// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar al usuario por correo
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Aquí no es necesario encriptar la contraseña, solo compararla directamente
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Si las contraseñas coinciden, devolver los datos del usuario
        res.json({ message: "Inicio de sesión exitoso", usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
});

module.exports = router;
