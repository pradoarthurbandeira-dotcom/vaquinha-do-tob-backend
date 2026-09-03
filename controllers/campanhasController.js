const Campanha = require('../models/Campanha');

exports.criar = async (req, res) => {
  try {
    const { titulo, descricao, categoria, metaMoney, dataFim, imagem } = req.body;

    if (!titulo || !descricao || !metaMoney || !dataFim) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    if (metaMoney <= 0) {
      return res.status(400).json({ error: 'Meta deve ser maior que zero' });
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
    await campanha.populate('criador', 'nome email avatar');

    res.status(201).json({
      message: 'Campanha criada com sucesso!',
      campanha
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const campanhas = await Campanha.find({ status: 'ativa' })
      .populate('criador', 'nome email avatar')
      .sort({ dataCriacao: -1 })
      .limit(50);
    res.json(campanhas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obter = async (req, res) => {
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
};

exports.atualizar = async (req, res) => {
  try {
    let campanha = await Campanha.findById(req.params.id);

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (campanha.criador.toString() !== req.usuarioId) {
      return res.status(403).json({ error: 'Não autorizado para atualizar esta campanha' });
    }

    campanha = await Campanha.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('criador', 'nome email avatar');

    res.json({ message: 'Campanha atualizada com sucesso', campanha });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const campanha = await Campanha.findById(req.params.id);

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (campanha.criador.toString() !== req.usuarioId) {
      return res.status(403).json({ error: 'Não autorizado para deletar esta campanha' });
    }

    await Campanha.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campanha deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};