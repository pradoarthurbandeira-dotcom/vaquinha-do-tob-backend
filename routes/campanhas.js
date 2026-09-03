const express = require('express');
const Campanha = require('../models/Campanha');
const auth = require('../middleware/auth');

const router = express.Router();

// Criar campanha
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, descricao, categoria, metaMoney, dataFim, imagem } = req.body;

    if (!titulo || !descricao || !metaMoney || !dataFim) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    const campanha = new Campanha({
      titulo,
      descricao,
      categoria,
      metaMoney,
      dataFim,
      imagem,
      criador: req.usuarioId
    });

    await campanha.save();
    await campanha.populate('criador', 'nome email');

    res.status(201).json({
      message: 'Campanha criada com sucesso!',
      campanha
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as campanhas
router.get('/', async (req, res) => {
  try {
    const campanhas = await Campanha.find({ status: 'ativa' })
      .populate('criador', 'nome email avatar')
      .sort({ dataCriacao: -1 });
    res.json(campanhas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma campanha
router.get('/:id', async (req, res) => {
  try {
    const campanha = await Campanha.findById(req.params.id)
      .populate('criador', 'nome email avatar bio')
      .populate('pagamentos');
    
    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    res.json(campanha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar campanha
router.put('/:id', auth, async (req, res) => {
  try {
    let campanha = await Campanha.findById(req.params.id);

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (campanha.criador.toString() !== req.usuarioId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    campanha = await Campanha.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: 'Campanha atualizada', campanha });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar campanha
router.delete('/:id', auth, async (req, res) => {
  try {
    const campanha = await Campanha.findById(req.params.id);

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (campanha.criador.toString() !== req.usuarioId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await Campanha.findByIdAndRemove(req.params.id);

    res.json({ message: 'Campanha deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;