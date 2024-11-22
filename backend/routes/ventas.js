// backend/routes/ventas.js
const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

// Ruta para registrar una venta
router.post('/registrar', async (req, res) => {
    try {
        // Transformar precios y total a string
        const productosTransformados = req.body.productos.map(producto => ({
            ...producto,
            precio: producto.precio.toString(), // Convertir precio a string
        }));

        const totalTransformado = req.body.total.toString(); // Convertir total a string

        // Crear nueva venta
        const nuevaVenta = new Venta({
            productos: productosTransformados,
            numeroDocumento: req.body.numeroDocumento,
            total: totalTransformado,
            fechaVenta: req.body.fechaVenta, // Asegúrate de enviar una fecha válida desde el frontend
            metodoPago: req.body.metodoPago,
            estado: req.body.estado || 'activo',
        });

        // Guardar en la base de datos
        const ventaGuardada = await nuevaVenta.save();
        res.status(201).json({
            mensaje: 'Venta registrada exitosamente',
            venta: ventaGuardada,
        });
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(500).json({ mensaje: 'Error al registrar la venta', error });
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
