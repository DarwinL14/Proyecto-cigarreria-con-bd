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

// Obtener todos los proveedores
router.get('/consulta', async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
});

// Actualizar estado del proveedor
router.put('/:id', async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.estado = req.body.estado;
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el proveedor' });
    }
});

module.exports = router;