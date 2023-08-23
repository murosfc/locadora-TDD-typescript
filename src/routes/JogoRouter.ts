import express, { Request, Response } from 'express';
import { JogoRepository } from '../repositories/InMemoryRepository/JogoRepository';
import { JogoService } from '../service/JogoService';
import { JogoController } from '../view/JogoController';

const router = express.Router();
const repo = JogoRepository.getInstance();
const service = new JogoService(repo);
const controller = new JogoController(service);

//save
router.post('/add', async(req, res) => {
    controller.save(req, res);
});

//findAll
router.get('/', async(req, res) => {
    controller.findAll(res);
});

//findById
router.get('/:id', async(req, res) =>{
    controller.findById(req, res);
});

//update
router.put('/update/:id', async(req, res) =>{
    controller.update(req, res);
});

//findByPlataforma
router.get('/plataforma/:id', async(req, res) =>{
    controller.findByPlataforma(req, res)
});

//findByRangeValor
router.get('/valores/:min/:max', async(req, res) =>{
    controller.findByRangeValor(req,res)
});

//delete
router.delete('/delete/:id', async(req, res) =>{
    controller.delete(req,res)
});

export default router;

