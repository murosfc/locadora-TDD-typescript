import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaControllerInterface } from "./contracts/PlataformaControllerInterface";
import { PlataformaServiceInterface } from "../service/contracts/PlataformaServiceInterface";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { json } from "stream/consumers";

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
            const plataforma = new PlataformaDTO(JSON.parse(req.body).titulo);            
            const saved = this.service.save(plataforma);
            return resp.status(201).json(saved).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }

    update(req: Request, resp: Response){
        try{
            const plataforma = new PlataformaDTO(JSON.parse(req.body).titulo);
            plataforma.id = Number(req.params.id);            
            const updated = this.service.update(plataforma);
            return resp.status(200).json(updated).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    delete(req: Request, resp: Response){
        const id = Number(req.params.id);
        if (this.service.delete(id))
            return resp.status(200).json({mensagem: "Plataforma removida com sucesso"}).end();
        else
            return resp.status(400).json({mensagem: "Erro ao tentar excluir a plataforma, verifique se ela está cadastrada"}).end();
    }
    
   
    
}