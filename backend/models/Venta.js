const mongoose = require('mongoose');

// Definir el esquema de Producto como un subdocumento
const ProductoSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Aquí mantienes el 'id' que es un identificador de producto
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
  // El campo _id es creado automáticamente por mongoose, pero puedes seguir usando tu id de venta
  productos: [ProductoSchema],  // Es un array de productos, como en tu base de datos
  numeroDocumento: { type: String, required: true },  // Número de documento
  total: { type: Number, required: true },  // Total de la venta
  fechaVenta: { type: Date, required: true },  // La fecha debe ser de tipo Date
  metodoPago: { type: String, required: true },  // Método de pago
  estado: { type: String, required: true, enum: ['activo', 'inactivo'], default: 'activo' },  // Estado de la venta
});

// Crear y exportar el modelo de Ventas
module.exports = mongoose.model('Ventas', VentaSchema);
