import express from "express";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioService } from "../service/UsuarioService";
import { UsuarioController } from "../view/UsuarioController";

const router = express.Router();
const repo = UsuarioRepository.getInstance();
const service = new UsuarioService(repo);
const controller = new UsuarioController(service);

//save
router.post('/add', async(req, res) => {
    controller.save(req, res);
});

//findAll
router.get('/', async(req, res) => {
    controller.findAll(res);
});

//findByEmail
router.get('/email/:email', async(req, res) => {
    controller.findByEmail(req, res);
});

//findByCpf
router.get('/cpf/:cpf', async(req, res) => {
    controller.findByCpf(req, res);
});

//findById
router.get('/:id', async(req, res) => {
    controller.findById(req, res);
});

//update
router.put('/update/:id', async(req, res) => {
    controller.update(req, res);
});

//delete
router.delete('/delete/:id', async(req, res) => {
    controller.delete(req, res);
});

export default router;
