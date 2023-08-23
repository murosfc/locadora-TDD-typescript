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
});    

//findByTitulo
router.get('/titulo/:titulo', async (req, res) => {
   await controller.findByTitulo(req, res);    
}); 

//findById
router.get('/:id', async (req, res) => {
    await controller.findById(req, res);    
});

//save
router.post('/add', (req, res) => {
    controller.save(req, res);    
});

//update
router.put('/update/:id', async (req, res) => {
    await controller.update(req, res);
});

//delete
router.delete('/delete/:id', async (req, res) => {
    await controller.delete(req, res);    
});

export default router;