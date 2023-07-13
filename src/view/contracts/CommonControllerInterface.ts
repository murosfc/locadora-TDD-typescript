import { Request, Response } from 'express';

export interface CommonControllerInterface {
    findAll(resp: Response): void;
    findById(req: Request, resp: Response): void;   
    save(req: Request, resp: Response): void;
    update(req: Request, resp: Response): void;
    delete(req: Request, resp: Response): void;  
}
