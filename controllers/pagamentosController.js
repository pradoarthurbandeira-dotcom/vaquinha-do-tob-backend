const Pagamento = require('../models/Pagamento');
const Campanha = require('../models/Campanha');
const { v4: uuidv4 } = require('uuid');

exports.criarPix = async (req, res) => {
  try {
    const { campanhaId, valor } = req.body;

    if (!campanhaId || !valor) {
      return res.status(400).json({ error: 'campanhaId e valor são obrigatórios' });
    }

    if (valor <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    const campanha = await Campanha.findById(campanhaId);
    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const transactionId = uuidv4();
    const brCode = `00020126580014br.gov.bcb.pix0136${process.env.PIX_KEY}52040000530398654061${Math.floor(valor * 100).toString().padStart(5, '0')}5303986580280163041001`;

    const pagamento = new Pagamento({
      campanha: campanhaId,
      usuario: req.usuarioId,
      valor,
      metodo: 'pix',
      statusPix: 'pendente',
      transactionId,
      pixBrCode: brCode
    });

    await pagamento.save();

    campanha.pagamentos.push(pagamento._id);
    await campanha.save();

    res.status(201).json({
      message: 'Pagamento Pix gerado com sucesso!',
      pagamento: {
        id: pagamento._id,
        valor,
        statusPix: pagamento.statusPix,
        transactionId,
        brCode,
        pixKey: process.env.PIX_KEY,
        banco: process.env.PIX_BANK
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmar = async (req, res) => {
  try {
    const pagamento = await Pagamento.findById(req.params.id);

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    if (pagamento.usuario.toString() !== req.usuarioId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    pagamento.statusPix = 'confirmado';
    pagamento.dataConfirmacao = new Date();
    await pagamento.save();

    const campanha = await Campanha.findById(pagamento.campanha);
    campanha.valorArrecadado += pagamento.valor;
    await campanha.save();

    res.json({
      message: 'Pagamento confirmado com sucesso!',
      pagamento
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.historico = async (req, res) => {
  try {
    const pagamentos = await Pagamento.find({ usuario: req.usuarioId })
      .populate('campanha', 'titulo')
      .sort({ dataTransacao: -1 });

    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};