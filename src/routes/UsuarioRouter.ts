import express from "express";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioService } from "../service/UsuarioService";
import { UsuarioController } from "../view/UsuarioController";

const router = express.Router();
const repo = UsuarioRepository.getInstance();
const service = new UsuarioService(repo);
const controller = new UsuarioController(service);

//save
router.post('/add', controller.save);

//update
router.put('/update/:id', controller.update);

//delete
router.delete('/delete/:id', controller.delete);

//findAll
router.get('/', controller.findAll);

//findByEmail
router.get('/email/:email', controller.findByEmail);

//findByCpf
router.get('/cpf/:cpf', controller.findByCpf);

//findById
router.get('/:id', controller.findById);

export default router;
