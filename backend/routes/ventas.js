// backend/routes/ventas.js
const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');

// Ruta para registrar una nueva venta
router.post('/', async (req, res) => {
    try {
        const { id, productos, tipoDocumento, numeroDocumento, total, fechaVenta, metodoPago, estado } = req.body;

        const nuevaVenta = new Venta({
            id,
            productos,
            tipoDocumento,
            numeroDocumento,
            total,
            fechaVenta,
            metodoPago,
            estado
        });

        await nuevaVenta.save();
        res.status(201).json({ message: "Venta registrada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la venta", error });
    }
});

// Obtener todas las ventas
router.get('/consulta', async (req, res) => {
    try {
        const ventas = await Venta.find();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
});

// Actualizar el estado de una venta (por ejemplo, de activo a inactivo)
router.put('/:id', async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });

        venta.estado = req.body.estado;
        await venta.save();
        res.json({ message: 'Estado de la venta actualizado', venta });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la venta', error });
    }
});

module.exports = router;
