const express = require('express');
const router = express.Router();
const Corte = require('../models/Corte.js');
const TipoCorte = require('../models/TipoCorte.js'); // 👈 Agrega esta línea
const TotalCorte = require('../models/TotalCorte.js')

// Endpoint para agregar un corte
router.post('/', async (req, res) => {
  try {
    const { usuario_id, tipo_corte_id, cantidad } = req.body;

    if (!usuario_id || !tipo_corte_id || !cantidad) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Obtener el costo del tipo de corte
    const tipoCorte = await TipoCorte.findById(tipo_corte_id);
    if (!tipoCorte) {
      return res.status(404).json({ error: 'Tipo de corte no encontrado' });
    }

    // Crear el nuevo corte
    const newCorte = new Corte({
      usuario_id,
      tipo_corte_id,
      cantidad,
    });

    await newCorte.save();

    // Actualizar o crear el total diario
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await TotalCorte.findOneAndUpdate(
      {
        usuario_id,
        fecha: today
      },
      {
        $inc: {
          cantidad_total: cantidad,
          costo_total: cantidad * tipoCorte.costo
        }
      },
      { upsert: true, new: true }
    );

    res.status(201).json(newCorte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el corte' });
  }
});

// Nuevo endpoint para obtener totales por usuario y fecha
router.get('/totales/:usuario_id/:fecha', async (req, res) => {
  try {
    const { usuario_id, fecha } = req.params;
    const date = new Date(fecha);
    date.setHours(0, 0, 0, 0);

    const total = await TotalCorte.findOne({
      usuario_id,
      fecha: date
    });

    if (!total) {
      return res.json({
        cantidad_total: 0,
        costo_total: 0
      });
    }

    res.json(total);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los totales' });
  }
});

// Nuevo endpoint para obtener totales por rango de fechas
router.get('/totales/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;

    const query = { usuario_id };
    
    if (fecha_inicio && fecha_fin) {
      const startDate = new Date(fecha_inicio);
      const endDate = new Date(fecha_fin);
      endDate.setHours(23, 59, 59, 999);
      
      query.fecha = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const totales = await TotalCorte.find(query).sort({ fecha: 1 });

    res.json(totales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los totales' });
  }
});

// Endpoint para obtener los cortes de un usuario
router.get('/usuario/:usuario_id', async (req, res) => {
    try {
      const { usuario_id } = req.params;
  
      const cortes = await Corte.find({ usuario_id }).populate('tipo_corte_id'); // 👈 Usa populate
      res.json(cortes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los cortes' });
    }
  });

// Endpoint para eliminar un corte
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCorte = await Corte.findByIdAndDelete(id);

    if (!deletedCorte) {
      return res.status(404).json({ error: 'Corte no encontrado' });
    }

    res.json(deletedCorte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el corte' });
  }
});

module.exports = router;