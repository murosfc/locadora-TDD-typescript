import express, { Request, Response } from 'express';
import { PlataformaRepository } from '../repositories/InMemoryRepository/PlataformaRepository';
import { PlataformaService } from '../service/PlataformaService';
import { PlataformaController } from '../view/PlataformaController';

const router = express.Router();
const repo = PlataformaRepository.getInstance();
const service = new PlataformaService(repo);
const controller = new PlataformaController(service);

//findAll
router.get('/', controller.findAll);

//findByTitulo
router.get('/titulo/', controller.findByTitulo);   

//findById
router.get('/:id', controller.findById);

//save
router.post('/add', controller.save);

//update
router.put('/update/:id', controller.update);

//delete
router.delete('/delete/:id', controller.delete);

export default router;