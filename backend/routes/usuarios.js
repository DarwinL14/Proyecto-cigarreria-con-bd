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

// Ruta de autenticación de usuario
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ message: "Correo o contraseña incorrectos." });
        }

        // Verificar que la contraseña coincida y que el usuario esté activo
        if (usuario.contrasena === contrasena && usuario.estado === 'activo') {
            return res.status(200).json(usuario); // Devuelve los datos del usuario
        } else if (usuario.estado !== 'activo') {
            return res.status(403).json({ message: "Tu cuenta no está activa. Contacta con soporte." });
        } else {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión', error);
        res.status(500).json({ message: "Error en el servidor. Intenta nuevamente." });
    }
});

router.post('/empleados', async (req, res) => {
    try {
        const { nombre, contrasena, nombreUsuario, correo, telefono, direccion, tipoDocumento, numeroDocumento, estado, rol } = req.body;



        const nuevoEmpleado = new Usuario({
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

        await nuevoEmpleado.save();
        res.status(201).json({ message: "Empleado registrado con éxito", empleado: nuevoEmpleado });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el empleado", error });
    }
});

// Obtener todos los usuarios
router.get('/consulta', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        usuario.estado = req.body.estado;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;