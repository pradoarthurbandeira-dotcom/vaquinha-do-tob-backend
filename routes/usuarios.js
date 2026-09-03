const express = require('express');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter perfil do usuário
router.get('/perfil/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .populate('campanhasriadas')
      .populate('contribuicoes');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar perfil
router.put('/atualizar', auth, async (req, res) => {
  try {
    const { nome, telefone, bio, avatar, chavePixCPF } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuarioId,
      { nome, telefone, bio, avatar, chavePixCPF },
      { new: true }
    );

    res.json({
      message: 'Perfil atualizado com sucesso!',
      usuario
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('nome email avatar bio dataCriacao')
      .sort({ dataCriacao: -1 });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;