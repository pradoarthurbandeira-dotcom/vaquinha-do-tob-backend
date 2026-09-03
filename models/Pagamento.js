const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
  campanha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campanha',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  metodo: {
    type: String,
    enum: ['pix', 'cartao', 'boleto'],
    default: 'pix'
  },
  statusPix: {
    type: String,
    enum: ['pendente', 'confirmado', 'falhou'],
    default: 'pendente'
  },
  qrCode: String,
  transactionId: String,
  pixBrCode: String,
  dataTransacao: {
    type: Date,
    default: Date.now
  },
  dataConfirmacao: Date,
  comprovante: String,
  mensagem: String
});

module.exports = mongoose.model('Pagamento', pagamentoSchema);