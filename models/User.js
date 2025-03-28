const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  fecha_registro: { type: Date, default: Date.now },
  password: { type: String, required: true },
  roles_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  puesto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puesto',
  },
});

module.exports = mongoose.model('User', UserSchema, 'usuarios');