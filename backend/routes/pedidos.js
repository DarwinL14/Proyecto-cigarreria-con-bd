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
router.get('/pedidos/confirmar', async (req, res) => {
    const { _id } = req.params;

    console.log(' ID recibido:', _id);  // Verificar si el usuarioId se está recibiendo correctamente


    try {
        const pedido = await Pedido.findById(_id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});


//ruta para obtener los pedidos por usuarioId
router.get('/pedidos', async (req, res) => {
    const { usuarioId } = req.query; // Obtienes el usuarioId de los query parameters

    console.log('Usuario ID recibido:', usuarioId);  // Verificar si el usuarioId se está recibiendo correctamente

    try {
        // Buscar los pedidos usando el usuarioId tal cual como un string
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

// Actualizar estado de pedido
// app.put('/pedidos/:id/estado', async (req, res) => {
//     const { id } = req.params;
//     const { estadoPedido } = req.body;

//     try {
//         const pedidoActualizado = await Pedido.findByIdAndUpdate(
//             id,
//             { estadoPedido },
//             { new: true }
//         );
//         res.json(pedidoActualizado);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
//     }
// });



module.exports = router;
