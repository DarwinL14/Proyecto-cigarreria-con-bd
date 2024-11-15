// backend/routes/proveedores.js
const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// Ruta para registrar proveedor
router.post('/', async (req, res) => {
    try {
        const { nombre, telefono, correo, estado } = req.body;


        const nuevoProveedor = new Proveedor({
            nombre,
            telefono,
            correo,
            estado
        });

        await nuevoProveedor.save();
        res.status(201).json({ message: "Proveedor registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el Proveedor", error });
    }
});

module.exports = router;