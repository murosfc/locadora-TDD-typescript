import { Response, Request } from "express";
import { CommonControllerInterface } from "./CommonControllerInterface";

export interface ContaControllerInterface extends CommonControllerInterface{
    findByEmail(req: Request, resp: Response): void;
    findByJogo(req: Request, resp: Response): void;
    getTop10(resp: Response): void;
}