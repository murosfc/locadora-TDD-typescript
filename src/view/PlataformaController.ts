import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaControllerInterface } from "./contracts/PlataformaControllerInterface";
import { PlataformaServiceInterface } from "../service/contracts/PlataformaServiceInterface";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export class PlataformaController implements PlataformaControllerInterface{
    private service: PlataformaServiceInterface<PlataformaDTO>;

    constructor(service: PlataformaServiceInterface<PlataformaDTO>){
        this.service = service;
    }

    findAll(resp: Response){        
        return resp.status(200).json(this.service.findAll()).end();
    } 

    findById(req: Request, resp: Response){
        try{
            const resultado = this.service.findById(Number(req.params.id));
            return resp.status(200).json(resultado).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    save(req: Request, resp: Response){        
        try{
            const saved = this.service.save(req.body as PlataformaDTO);
            return resp.status(201).json(saved).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }

    update(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, resp: Response<any, Record<string, any>>): void {
        throw new Error("Method not implemented.");
    }
    delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, resp: Response<any, Record<string, any>>): void {
        throw new Error("Method not implemented.");
    }
    
   
    
}