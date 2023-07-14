import { CommonControllerInterface } from "./CommonControllerInterface";
import { Request, Response } from "express";

export interface JogoControllerInterface extends CommonControllerInterface {
    findByPlataforma(req: Request, resp: Response): void;
    findByRangeValor(req: Request, resp: Response): void;
}
