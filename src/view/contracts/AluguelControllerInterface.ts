import { CommonControllerInterface } from "./CommonControllerInterface";
import { Response, Request } from "express";

export interface AluguelControllerInterface extends CommonControllerInterface {
    estenderAluguel(req: Request, resp: Response): void;
    findByUsuario(req: Request, resp: Response): void;
    findByConta(req: Request, resp: Response): void;
    findByDataAluguelRange(req: Request, resp: Response): void;    
}
   
