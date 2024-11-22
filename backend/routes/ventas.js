// backend/routes/ventas.js
const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

// Ruta para registrar una nueva venta
router.post('/registro', async (req, res) => {
    try {
        // Desestructuramos los datos de la venta desde el cuerpo de la solicitud
        const { productos, numeroDocumento, total, fechaVenta, metodoPago, estado } = req.body;

        // Crear una nueva instancia de Venta
        const nuevaVenta = new Venta({
            productos,
            numeroDocumento,
            total,
            fechaVenta,
            metodoPago,
            estado
        });

        // Guardar la venta en la base de datos
        await nuevaVenta.save();

        // Ahora, actualizamos el inventario de los productos
        for (const producto of productos) {
            // Buscar el producto en la base de datos
            const productoExistente = await Producto.findById(producto.id);

            // Verificar si el producto existe
            if (!productoExistente) {
                return res.status(404).json({ message: `Producto con ID ${producto.id} no encontrado` });
            }

            // Verificar si hay suficiente stock
            if (productoExistente.cantidad < producto.cantidad) {
                return res.status(400).json({ message: `No hay suficiente stock para el producto ${producto.nombre}` });
            }

            // Restar la cantidad del producto vendido
            productoExistente.cantidad -= producto.cantidad;

            // Guardar los cambios en el producto
            await productoExistente.save();
        }

        // Si todo fue exitoso, enviamos una respuesta positiva
        res.status(201).json({ message: "Venta registrada con éxito" });
    } catch (error) {
        // Si ocurre algún error, devolvemos un error genérico
        console.error(error);  // Mostrar error en la consola del servidor
        res.status(500).json({ message: "Error al registrar la venta", error: error.message });
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
