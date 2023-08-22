import express from "express";
import { AluguelRepository } from "../repositories/InMemoryRepository/AluguelRepository";
import { AluguelService } from "../service/AluguelService";
import { AluguelController } from "../view/AluguelController";

const router = express.Router();
const repo = AluguelRepository.getInstance();
const service = new AluguelService(repo);
const controller = new AluguelController(service);

//save
router.post('/add', controller.save);

//update
router.put('/update/:id', controller.update);

//findById 
router.get('/:id', controller.findById);

//delete
router.delete('/delete/:id', controller.delete);

//estenderAluguel
router.put('/estender/:id', controller.estenderAluguel);

//findByUsuario
router.get('/usuario/:idUsuario', controller.findByUsuario);

//findByConta
router.get('/conta/:idConta', controller.findByConta);

//findByDataAluguelRange
router.get('/dataAluguel/:dataInicial/:dataFinal', controller.findByDataAluguelRange);

//findAll
router.get('/', controller.findAll);

export default router;

