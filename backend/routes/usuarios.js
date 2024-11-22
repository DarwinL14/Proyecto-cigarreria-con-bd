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

//ruta para actualizar usuario loggeado
router.put('/loggeado/:userId', async (req, res) => {
    const { userId } = req.params;
    const { correo, telefono, direccion } = req.body; // Los datos que quieres permitir actualizar

    try {
        // Buscar el usuario por su ID
        const user = await Usuario.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos que se pasen en la solicitud
        user.correo = correo || user.correo;
        user.telefono = telefono || user.telefono;
        user.direccion = direccion || user.direccion;

        // Guardar los cambios en la base de datos
        await user.save();

        return res.status(200).json({ message: 'Usuario actualizado con éxito', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// Ruta para verificar la contraseña actual
router.post('/:id/verificar-contrasena', async (req, res) => {
    const { id } = req.params;
    const { contrasenaActual } = req.body; // Contraseña encriptada enviada desde el frontend

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (usuario.contrasena === contrasenaActual) {
            return res.status(200).json({ message: 'Contraseña correcta' });
        } else {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar la contraseña', error });
    }
});

// Ruta para cambiar la contraseña
router.put('/:id/cambiar-contrasena', async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body; // Contraseña encriptada enviada desde el frontend

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.contrasena = nuevaContrasena; // Actualiza la contraseña en la base de datos
        await usuario.save();

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
});

// 1. Ruta para generar y guardar el código de recuperación
router.post('/recuperar-contrasena', async (req, res) => {
    const { correo } = req.body; // El correo que nos llega del frontend

    try {
        // Buscar al usuario por correo
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        // Generar un código de recuperación
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // Guardar el código en la base de datos
        usuario.codigoRecuperacion = codigo;
        await usuario.save();

        // Aquí el frontend será el encargado de enviar el correo

        res.status(200).json({ message: 'Código de recuperación generado y guardado. Ahora el frontend debe enviarlo por correo.' });
    } catch (error) {
        console.error('Error al generar el código de recuperación:', error);
        res.status(500).json({ message: 'Error al generar el código de recuperación', error });
    }
});

// 2. Ruta para obtener el código de recuperación
router.post('/obtener-codigo-recuperacion', async (req, res) => {
    const { correo } = req.body; // El correo que nos llega del frontend

    try {
        // Buscar al usuario por correo
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        // Verificamos si el usuario tiene un código de recuperación
        if (!usuario.codigoRecuperacion) {
            return res.status(400).json({ message: 'No hay código de recuperación disponible' });
        }

        // Devolver el código al frontend
        res.status(200).json({ codigo: usuario.codigoRecuperacion });
    } catch (error) {
        console.error('Error al obtener el código de recuperación:', error);
        res.status(500).json({ message: 'Error al obtener el código de recuperación', error });
    }
});







module.exports = router;