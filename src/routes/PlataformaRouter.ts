import express, { Request, Response } from 'express';
import { PlataformaRepository } from '../repositories/InMemoryRepository/PlataformaRepository';
import { PlataformaService } from '../service/PlataformaService';
import { PlataformaController } from '../view/PlataformaController';

const router = express.Router();
const repo = PlataformaRepository.getInstance();
const service = new PlataformaService(repo);
const controller = new PlataformaController(service);

//findAll
router.get('/',async (req, res) => {
    await controller.findAll(res);
    res.send();
});

//findByTitulo
router.get('/titulo/', async (req, res) => {
    await controller.findByTitulo(req, res);
    res.send();
}); 

//findById
router.get('/:id', async (req, res) => {
    await controller.findById(req, res);
    res.send();
});

//save
router.post('/add', async (req, res) => {
    await controller.save(req, res);
    res.send();
});

//update
router.put('/update/:id', async (req, res) => {
    await controller.update(req, res);
    res.send();
});

//delete
router.delete('/delete/:id', async (req, res) => {
    await controller.delete(req, res);
    res.send();
});

export default router;