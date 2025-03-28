const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const trabajadores = await User.find({}, 'nombre apellido');
    res.json(trabajadores);
  } catch (error) {
    console.error('Error al obtener los trabajadores:', error);
    res.status(500).json({ error: 'Error al obtener los trabajadores' });
  }
});

module.exports = router;