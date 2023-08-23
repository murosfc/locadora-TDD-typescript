import express, { Express } from 'express';
import PlataformaRouter from './routes/PlataformaRouter';
import JogoRouter from './routes/JogoRouter';
import ContaRouter from './routes/ContaRouter';
import AluguelRouter from './routes/AluguelRouter';
import UsuarioRouter from './routes/UsuarioRouter';

const app: Express = express();
const port = 3000; // You can change this to the desired port number

// Middleware to parse incoming JSON data
app.use(express.json());

// Mount the event routes
app.use('/plataformas/', PlataformaRouter);
app.use('/jogos/', JogoRouter);
app.use('/contas/', ContaRouter);
app.use('/alugueis/', AluguelRouter);
app.use('/usuarios/', UsuarioRouter);

var server: any;
// Start the server
if (process.env.NODE_ENV !== 'test') {
   server = app.listen(port, () => console.log(`Listening on port ${port}`))
}
else{
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default server;

