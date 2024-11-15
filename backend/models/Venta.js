// models/Venta.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nombre: { type: String, required: true },
  precio: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  marca: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },
});

const VentaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  productos: [ProductoSchema],
  tipoDocumento: { type: String },
  numeroDocumento: { type: String, required: true },
  total: { type: Number, required: true },
  fechaVenta: { type: String, required: true },
  metodoPago: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },
});

module.exports = mongoose.model('Ventas', VentaSchema);
