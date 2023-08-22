import express from "express";
import { ContaRepository } from "../repositories/InMemoryRepository/ContaRepository";
import { ContaService } from "../service/ContaService";
import { ContaController } from "../view/ContaController";

const router = express.Router();
const repo = ContaRepository.getInstance();
const service = new ContaService(repo);
const controller = new ContaController(service);

//save
router.post('/add', controller.save);

//update
router.put('/update/:id', controller.update);

//delete
router.delete('/delete/:id', controller.delete);

//findByEmail
router.get('/email/:email', controller.findByEmail);

//findByJogo
router.get('/jogo/:id', controller.findByJogo);

//findAll
router.get('/', controller.findAll);

//findById
router.get('/:id', controller.findById);

export default router;
