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

// Obtener un producto por ID
router.get('/consulta/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto', error });
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
router.put('/estado/:id', async (req, res) => {
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

// Actualizar los datos de un producto
router.put('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, precio, descripcion, imagen, categoria, cantidad, marca, estado } = req.body;

        // Validar que todos los campos requeridos sean proporcionados
        if (!nombre || !precio || !descripcion || !categoria || !cantidad || !marca || !estado) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Buscar el producto por ID
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar los campos del producto
        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;
        producto.descripcion = descripcion || producto.descripcion;
        producto.imagen = imagen || producto.imagen;
        producto.categoria = categoria || producto.categoria;
        producto.cantidad = cantidad || producto.cantidad;
        producto.marca = marca || producto.marca;
        producto.estado = estado || producto.estado;

        // Guardar los cambios en la base de datos
        await producto.save();

        res.json({ message: 'Producto actualizado con éxito', producto });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

module.exports = router;