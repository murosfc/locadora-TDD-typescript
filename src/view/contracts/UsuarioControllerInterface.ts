import { CommonControllerInterface } from "./CommonControllerInterface";
import { Response, Request } from "express";

export interface UsuarioControllerInterface extends CommonControllerInterface {
    findByEmail(req: Request, resp: Response): void;
    findByCpf(req: Request, resp: Response): void;  
    login(req: Request, resp: Response): void;  
}

