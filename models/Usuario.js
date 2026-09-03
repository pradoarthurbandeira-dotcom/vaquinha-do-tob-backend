const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  chavePixCPF: {
    type: String,
    default: null
  },
  telefone: String,
  avatar: String,
  bio: String,
  campanhascriadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campanha'
  }],
  contribuicoes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pagamento'
  }],
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  }
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.senha = await bcryptjs.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaFornecida) {
  return await bcryptjs.compare(senhaFornecida, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);