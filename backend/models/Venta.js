const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: String, required: true }, // Almacenar como string
    cantidad: { type: Number, required: true },
    descripcion: { type: String },
    imagen: { type: String },
    categoria: { type: String },
    marca: { type: String },
});

const VentaSchema = new mongoose.Schema({
    productos: { type: [ProductoSchema], required: true },
    numeroDocumento: { type: String, required: true },
    total: { type: String, required: true }, // Total también como string
    fechaVenta: { type: String, required: true }, // Asegurar que se guarde en formato 'DD/MM/YYYY'
    metodoPago: { type: String, required: true },
    estado: { type: String, default: 'activo' },
});

module.exports = mongoose.model('Venta', VentaSchema);
