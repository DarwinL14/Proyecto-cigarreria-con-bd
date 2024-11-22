const express = require('express');
const Pedido = require('../models/Pedido'); // Aquí se importa el modelo de Pedido
const router = express.Router();

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
        // Destructuración de los datos recibidos desde el cuerpo de la solicitud
        const { usuarioId, direccion, nombre, correo, telefono, productos, metodoPago, asignado, estadoPedido = 'pendiente', estado = 'activo' } = req.body;

        // Crear el objeto de pedido
        const nuevoPedido = new Pedido({
            usuarioId,
            direccion,
            nombre,
            correo,
            telefono,
            productos,  // Esto es un arreglo de productos que tiene subdocumentos
            metodoPago,
            asignado,
            estadoPedido,
            estado
        });

        // Guardar el pedido en la base de datos
        const pedidoGuardado = await nuevoPedido.save();

        // Enviar la respuesta con el pedido guardado
        res.status(201).json(pedidoGuardado);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Hubo un problema al procesar tu pedido.' });
    }
});

// Ruta para obtener los detalles de un pedido por su _id
router.get('/pedidos/confirmar/:_id', async (req, res) => {
    const { _id } = req.params;  // Usamos _id para que coincida con el formato del cliente

    try {
        // Buscar el pedido por _id
        const pedido = await Pedido.findById(_id);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Devolver el pedido encontrado
        return res.status(200).json(pedido);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al obtener el pedido' });
    }
});

router.get('/pedidos', async (req, res) => {
    const { usuarioId } = req.query;

    try {
        // Buscar todos los pedidos del usuario
        const pedidos = await Pedido.find({ usuarioId });

        // Si no se encuentran pedidos
        if (pedidos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario.' });
        }

        // Devolver los pedidos encontrados
        return res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return res.status(500).json({ message: 'Hubo un error al obtener los pedidos.' });
    }
});


module.exports = router;
