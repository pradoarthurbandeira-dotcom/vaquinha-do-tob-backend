# 🐄 Vaquinha do Tob - Backend

Backend da plataforma de financiamento coletivo com integração Pix.

## 🚀 Recursos

- ✅ Autenticação com JWT
- ✅ Gerenciamento de campanhas
- ✅ Integração Pix (Nubank)
- ✅ Processamento de pagamentos
- ✅ Banco de dados MongoDB
- ✅ CORS configurado

## 📦 Instalação

### 1. Clonar repositório
```bash
git clone https://github.com/pradoarthurbandeira-dotcom/vaquinha-do-tob-backend.git
cd vaquinha-do-tob-backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
MONGODB_URI=sua_url_mongodb
JWT_SECRET=sua_chave_secreta
PORT=5000
PIX_KEY=aa8609ba-23cb-46e5-910f-dbc2164d05d2
```

### 4. Iniciar servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:5000`

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/registro` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter perfil (requer autenticação)

### Campanhas
- `GET /api/campanhas` - Listar todas as campanhas
- `GET /api/campanhas/:id` - Obter detalhes da campanha
- `POST /api/campanhas` - Criar campanha (requer autenticação)
- `PUT /api/campanhas/:id` - Atualizar campanha (requer autenticação)
- `DELETE /api/campanhas/:id` - Deletar campanha (requer autenticação)

### Pagamentos Pix
- `POST /api/pagamentos/pix` - Criar pagamento Pix (requer autenticação)
- `POST /api/pagamentos/confirmar/:id` - Confirmar pagamento (requer autenticação)
- `GET /api/pagamentos/historico` - Obter histórico de pagamentos (requer autenticação)

### Usuários
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/perfil/:id` - Obter perfil do usuário
- `PUT /api/usuarios/atualizar` - Atualizar perfil (requer autenticação)

## 🔑 Autenticação

Todas as rotas que requerem autenticação esperam um header:
```
Authorization: Bearer seu_token_jwt
```

## 💰 Integração Pix

A plataforma está configurada para receber Pix na chave:
```
aa8609ba-23cb-46e5-910f-dbc2164d05d2 (Nubank)
```

## 🗄️ Banco de Dados

### Modelos
- **Usuario** - Dados do usuário e autenticação
- **Campanha** - Informações da campanha de crowdfunding
- **Pagamento** - Registro de transações Pix

## 📝 Variáveis de Ambiente

```env
MONGODB_URI - String de conexão MongoDB
JWT_SECRET - Chave secreta para JWT
PORT - Porta do servidor (padrão: 5000)
NODE_ENV - Ambiente (development/production)
PIX_KEY - Chave Pix (CPF, Email ou Telefone)
PIX_BANK - Banco (ex: Nubank)
CORS_ORIGIN - URLs permitidas para CORS
```

## 🚀 Deploy

Para fazer deploy, você pode usar:
- Heroku
- Railway
- Render
- AWS
- Google Cloud

## 📄 Licença

MIT

## 👨‍💻 Autor

Criado com ❤️ por Prado Arthur Bandeira