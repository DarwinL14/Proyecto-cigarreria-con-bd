// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
  nombreUsuario: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: String, required: true },
  estado: { type: String, default: 'activo' },
  rol: { type: String, default: 'cliente' },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);