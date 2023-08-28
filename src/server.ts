import express, { Express } from 'express';
import PlataformaRouter from './routes/PlataformaRouter';
import JogoRouter from './routes/JogoRouter';
import ContaRouter from './routes/ContaRouter';
import AluguelRouter from './routes/AluguelRouter';
import UsuarioRouter from './routes/UsuarioRouter';
require('dotenv').config();

const app: Express = express();
const port = process.env.PORT || 3000; 

// Middleware to parse incoming JSON data
app.use(express.json());

// Mount the event routes
app.use('/plataformas/', PlataformaRouter);
app.use('/jogos/', JogoRouter);
app.use('/contas/', ContaRouter);
app.use('/alugueis/', AluguelRouter);
app.use('/usuarios/', UsuarioRouter);

var server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;

