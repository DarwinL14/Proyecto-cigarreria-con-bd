const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  productos: [{
    id: String,
    nombre: String,
    precio: String,
    descripcion: String,
    imagen: String,
    categoria: String,
    cantidad: Number,
    marca: String,
    estado: String
  }],
  estadoPedido: {
    type: String,
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    default: 'activo'
  }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
