const mongoose = require('mongoose');

const campanhaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    enum: ['educacao', 'saude', 'tecnologia', 'arte', 'social', 'outro'],
    default: 'outro'
  },
  criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  metaMoney: {
    type: Number,
    required: true
  },
  valorArrecadado: {
    type: Number,
    default: 0
  },
  dataInicio: {
    type: Date,
    default: Date.now
  },
  dataFim: {
    type: Date,
    required: true
  },
  imagem: String,
  video: String,
  status: {
    type: String,
    enum: ['ativa', 'finalizada', 'cancelada'],
    default: 'ativa'
  },
  pagamentos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pagamento'
  }],
  seguidores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  atualizacoes: [{
    titulo: String,
    conteudo: String,
    data: {
      type: Date,
      default: Date.now
    }
  }],
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campanha', campanhaSchema);