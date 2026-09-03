const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '7d' });
};

exports.registro = async (req, res) => {
  try {
    const { nome, email, cpf, senha, senhaConfirm } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    if (senha !== senhaConfirm) {
      return res.status(400).json({ error: 'As senhas não conferem' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    let usuario = await Usuario.findOne({ $or: [{ email }, { cpf }] });
    if (usuario) {
      return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
    }

    usuario = new Usuario({ nome, email, cpf, senha });
    await usuario.save();

    const token = gerarToken(usuario._id);

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
};

exports.login = async (req, res) => {
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

    const token = gerarToken(usuario._id);

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
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId)
      .populate('campanhasCriadas')
      .populate('contribuicoes')
      .select('-senha');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};