import 'dotenv/config';
import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { sequelize } from './src/config/sequelize.js';
import { initModels } from './src/models/index.js';
import { bootstrapDb } from './src/db/bootstrap.js';

initModels();
await bootstrapDb();
await sequelize.query('PRAGMA foreign_keys = ON;');

const app = express();
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
// Middleware para parse de JSON
app.use(express.json());
// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
// Rota inicial
app.get('/', (req, res) => {
    res.send('API com Express funcionando!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});