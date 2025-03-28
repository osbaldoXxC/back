const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose'); // 👈 Esta línea faltaba


// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('roles_id').populate('puesto_id'); // 👈 Poblar roles_id y puesto_id
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('roles_id').populate('puesto_id'); // 👈 Poblar roles_id y puesto_id
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Actualizar el puesto de un usuario
router.put('/:id/update-puesto', async (req, res) => {
  const { id } = req.params;
  const { puesto_id } = req.body;

  if (!id || !puesto_id) {
    return res.status(400).json({ error: 'ID del usuario y puesto_id son obligatorios' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { puesto_id },
      { new: true }
    ).populate('puesto_id'); // 👈 Poblar puesto_id

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el puesto del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el puesto del usuario' });
  }
});

  
// Corrige el endpoint update-role:
router.put('/:id/update-role', async (req, res) => {
  const { id } = req.params;
  const { roles_id } = req.body; // 👈 Asegúrate que coincide con el frontend

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles_id },
      { new: true }
    ).populate('roles_id');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
});

router.get('/:id/rol-puesto', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('roles_id', 'nombre_rol')  // Solo el campo nombre_rol
      .populate('puesto_id', 'nombre')     // Solo el campo nombre
      .select('roles_id puesto_id');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      rol: user.roles_id,
      puesto: user.puesto_id
    });
  } catch (error) {
    console.error('Error al obtener rol y puesto:', error);
    res.status(500).json({ error: 'Error al obtener rol y puesto' });
  }
});

module.exports = router;