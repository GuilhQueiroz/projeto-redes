const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

// Importe os models e as associações
require('./models'); // <-- Adicione esta linha!

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const errorHandler = require('./middlewares/errorHandler');

// Importe as rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const interactionRoutes = require('./routes/interaction.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Testa conexão
sequelize.authenticate()
    .then(() => console.log('Conectado ao MySQL!'))
    .catch(err => console.error('Erro ao conectar ao MySQL:', err));

sequelize.sync({ alter: true }) // ou { force: true } para resetar
    .then(() => console.log('Modelos sincronizados!'))
    .catch(err => console.error('Erro ao sincronizar modelos:', err));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/interactions', interactionRoutes);

// Rota de teste
app.get('/', (req, res) => res.json({ msg: 'API Blog Online!' }));

app.use(errorHandler);

module.exports = app;