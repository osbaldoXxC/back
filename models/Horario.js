const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  entrada: {
    type: String,
    required: true,
  },
  salida: {
    type: String,
    required: true,
  },
  bono_minutos: {
    type: String,
    required: true,
  },
  bono_monto: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Horario', HorarioSchema, 'horarios');