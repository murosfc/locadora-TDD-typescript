import express, { Request, Response } from 'express';
import { JogoRepository } from '../repositories/InMemoryRepository/JogoRepository';
import { JogoService } from '../service/JogoService';
import { JogoController } from '../view/JogoController';

const router = express.Router();
const repo = JogoRepository.getInstance();
const service = new JogoService(repo);
const controller = new JogoController(service);

//save
router.post('/add', controller.save);

//findAll
router.get('/', controller.findAll);

//findById
router.get('/:id', controller.findById);

//update
router.put('/update/:id', controller.update);

//findByPlataforma
router.get('/plataforma/:id', controller.findByPlataforma);

//findByRangeValor
router.get('/range/:min/:max', controller.findByRangeValor);

//delete
router.delete('/delete/:id', controller.delete);

export default router;

