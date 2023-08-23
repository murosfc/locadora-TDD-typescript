import express from "express";
import { ContaRepository } from "../repositories/InMemoryRepository/ContaRepository";
import { ContaService } from "../service/ContaService";
import { ContaController } from "../view/ContaController";

const router = express.Router();
const repo = ContaRepository.getInstance();
const service = new ContaService(repo);
const controller = new ContaController(service);

//save
router.post('/add', async (req, res) => {
    controller.save(req, res);
});

//findByEmail
router.get('/email/:email', async (req, res) => {
    controller.findByEmail(req, res);
});

//findByJogo
router.get('/jogo/:id', async (req, res) => {
    controller.findByJogo(req, res);
});

//findAll
router.get('/', async (req, res) => {
    controller.findAll(res);
});

//findById
router.get('/:id', async (req, res) => {
    controller.findById(req, res);
});

//update
router.put('/update/:id', async (req, res) => {
    controller.update(req, res);
});

//delete
router.delete('/delete/:id', async (req, res) => {
    controller.delete(req, res);
});

export default router;
