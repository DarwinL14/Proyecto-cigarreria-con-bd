// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión a MongoDB", err));

// Rutas
const userRoutes = require('./routes/usuarios');
app.use('/usuarios', userRoutes);

const proveedorRoutes = require('./routes/proveedores');
app.use('/proveedores', proveedorRoutes);

const productoRoutes = require('./routes/productos');
app.use('/productos', productoRoutes);

const pedidoRoutes = require('./routes/pedidos');
app.use('/pedidos', pedidoRoutes);

const direccionRoutes = require('./routes/direcciones');
app.use('/direcciones', direccionRoutes);


const ventaRoutes = require('./routes/ventas');
app.use('/ventas', ventaRoutes);

// Servir archivos estáticos de la carpeta build de React
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todas las solicitudes al archivo index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
