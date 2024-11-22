const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Crear un producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto registrado con éxito', producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el producto', error });
    }
});

// Obtener todos los productos
router.get('/consulta', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Obtener producto por ID
router.get('/consulta/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

// Actualizar estado del producto
router.put('/estado/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

router.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body; // Esperamos que la cantidad que se va a restar venga en el body de la solicitud

    try {
        // Buscar el producto por su ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Asegúrate de que la cantidad no sea negativa
        if (producto.cantidad < cantidad) {
            return res.status(400).json({ message: 'No hay suficiente stock para este producto' });
        }

        // Actualizar la cantidad del producto
        producto.cantidad -= cantidad;

        // Guardar el producto actualizado
        await producto.save();

        return res.status(200).json(producto); // Respondemos con el producto actualizado
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar el producto' });
    }
});


module.exports = router;
