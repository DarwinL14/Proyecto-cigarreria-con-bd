// backend/routes/productos.js
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Ruta para registrar producto
router.post('/', async (req, res) => {
    try {
        const { nombre, precio, descripcion, imagen, categoria, cantidad, marca, estado } = req.body;


        const nuevoProducto = new Producto({
            nombre,
            precio, 
            descripcion, 
            imagen, 
            categoria, 
            cantidad, 
            marca,
            estado
        });

        await nuevoProducto.save();
        res.status(201).json({ message: "Producto registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el Producto", error });
    }
});

// Obtener todos los productos
router.get('/consulta', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// Actualizar estado del producto
router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        producto.estado = req.body.estado;
        await producto.save();
        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el producto' });
    }
});

module.exports = router;