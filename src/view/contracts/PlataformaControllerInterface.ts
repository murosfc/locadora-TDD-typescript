import { CommonControllerInterface } from "./CommonControllerInterface";
import { Request, Response } from "express";

export  interface PlataformaControllerInterface extends CommonControllerInterface{
    findByTitulo(req: Request, resp: Response): void;
}