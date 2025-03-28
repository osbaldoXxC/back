const express = require('express');
const router = express.Router();
const Horario = require('../models/Horario');
// Usar PUT para actualizar o crear horarios

// Obtener horarios por usuario y fecha
router.get('/', async (req, res) => {
  try {
    const { usuario_id, fecha } = req.query;
    
    console.log('Solicitud recibida con parámetros:', { usuario_id, fecha });

    if (!usuario_id || !fecha) {
      return res.status(400).json({ error: 'Usuario y fecha son requeridos' });
    }

    // Solución: Usar fecha directamente como string en formato YYYY-MM-DD
    const dateStr = fecha; // Usamos el string directamente
    
    console.log('Buscando horario para:', { usuario_id, fecha: dateStr });

    const horario = await Horario.findOne({
      usuario_id,
      fecha: {
        $gte: new Date(`${dateStr}T00:00:00.000Z`),
        $lt: new Date(`${dateStr}T23:59:59.999Z`)
      }
    });

    if (!horario) {
      console.log('No se encontró horario para esta fecha');
      return res.json({
        entrada: '--:--',
        salida: '--:--',
        mensaje: 'No se encontró registro de horario'
      });
    }

    console.log('Horario encontrado:', {
      entrada: horario.entrada,
      salida: horario.salida,
      fecha: horario.fecha
    });

    res.json({
      entrada: horario.entrada,
      salida: horario.salida,
      fecha: horario.fecha
    });

  } catch (error) {
    console.error('Error en GET /api/horarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener horarios',
      detalle: error.message 
    });
  }
});
router.put('/guardar-horarios', async (req, res) => {
  try {
    const { usuarios, horarios } = req.body;
    console.log('Datos recibidos:', { usuarios, horarios });

    if (!usuarios || !Array.isArray(usuarios) || !horarios || !Array.isArray(horarios)) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const horariosActualizados = [];
    for (const usuario_id of usuarios) {
      for (const horario of horarios) {
        const horarioExistente = await Horario.findOneAndUpdate(
          {
            usuario_id,
            fecha: new Date(horario.date),
          },
          {
            entrada: horario.entrada,
            salida: horario.salida,
            bono_minutos: horario.bonoMinutes,
            bono_monto: horario.bonoAmount,
          },
          { new: true, upsert: true } 
        );
        horariosActualizados.push(horarioExistente);
      }
    }

    res.status(200).json(horariosActualizados);
  } catch (error) {
    console.error('Error al actualizar los horarios:', error);
    res.status(500).json({ error: 'Error al actualizar los horarios' });
  }
});



module.exports = router;