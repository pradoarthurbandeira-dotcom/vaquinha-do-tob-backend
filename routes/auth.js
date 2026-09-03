const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, cpf, senha, senhaConfirm } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    if (senha !== senhaConfirm) {
      return res.status(400).json({ error: 'Senhas não conferem' });
    }

    // Verificar se usuário já existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    usuario = new Usuario({
      nome,
      email,
      cpf,
      senha
    });

    await usuario.save();

    // Gerar token
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter perfil
router.get('/me', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId)
      .populate('campanhasriadas')
      .populate('contribuicoes');
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;