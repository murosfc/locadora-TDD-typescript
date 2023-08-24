import express from "express";
import { AluguelRepository } from "../repositories/InMemoryRepository/AluguelRepository";
import { AluguelService } from "../service/AluguelService";
import { AluguelController } from "../view/AluguelController";

const router = express.Router();
const repo = AluguelRepository.getInstance();
const service = new AluguelService(repo);
const controller = new AluguelController(service);

//save
router.post('/add', async(req,res) =>{
    controller.save(req, res);
});

//findById 
router.get('/:id', async(req,res) =>{
    controller.findById(req, res);
});

//estenderAluguel
router.put('/estender/:id', async(req,res) =>{
    controller.estenderAluguel(req, res);
});

//findByUsuario
router.get('/usuario/:idUsuario', async(req,res) =>{
    controller.findByUsuario(req, res);
});

//findByConta
router.get('/conta/:idConta', async(req,res) =>{
    controller.findByConta(req, res);
});

//findByDataAluguelRange
router.get('/dataAluguel/:dataInicial/:dataFinal', async(req,res) =>{
    controller.findByDataAluguelRange(req, res);
});

//findAll
router.get('/', async(req,res) =>{
    controller.findAll(res);
});

//update
router.put('/update/:id', async(req,res) =>{
    controller.update(req, res);
});

//delete
router.delete('/delete/:id', async(req,res) =>{
    controller.delete(req, res);
});

export default router;

