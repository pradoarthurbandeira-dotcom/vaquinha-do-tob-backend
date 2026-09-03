const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Pagamento = require('../models/Pagamento');
const Campanha = require('../models/Campanha');
const auth = require('../middleware/auth');

const router = express.Router();

// Criar pagamento Pix
router.post('/pix', auth, async (req, res) => {
  try {
    const { campanhaId, valor } = req.body;

    if (!campanhaId || !valor) {
      return res.status(400).json({ error: 'campanhaId e valor são obrigatórios' });
    }

    const campanha = await Campanha.findById(campanhaId);
    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    // Gerar dados Pix simulados
    const transactionId = uuidv4();
    const brCode = `00020126580014br.gov.bcb.pix0136${process.env.PIX_KEY}52040000530398654061${valor.toFixed(2).replace('.', '')}5303986580280163041001`;

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

    // Adicionar pagamento à campanha
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
});

// Simular confirmação de pagamento
router.post('/confirmar/:id', auth, async (req, res) => {
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

    // Atualizar campanha
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
});

// Obter histórico de pagamentos
router.get('/historico', auth, async (req, res) => {
  try {
    const pagamentos = await Pagamento.find({ usuario: req.usuarioId })
      .populate('campanha', 'titulo')
      .sort({ dataTransacao: -1 });

    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;