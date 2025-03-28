const express = require('express');
const cors = require('cors');
const connectDB = require('./server/db.js');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

connectDB();

app.get('/', (req, res) => {
  res.send('API de Maquiladora funcionando!');
});

// Registrar rutas
const empleadoRoutes = require('./routes/empleadoRoutes');
app.use('/api/trabajadores', empleadoRoutes);

app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/tipo_cortes', require('./routes/tipoCorteRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/cortes', require('./routes/corteRoutes'));

// Registrar rutas de puestos
const puestoRoutes = require('./routes/puestoRoutes');
app.use('/api/puestos', puestoRoutes);
const horarioRoutes = require('./routes/horarioRoutes');
app.use('/api/horarios', horarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log("Rutas registradas:");
  console.log("- GET /api/users");
  console.log("- GET /api/tipo_cortes");
  console.log("- POST /api/tipo_cortes");
  console.log("- GET /api/trabajadores");
  console.log("- GET /api/roles");
  console.log("- POST /api/cortes");
  console.log("- POST /api/puestos");
});