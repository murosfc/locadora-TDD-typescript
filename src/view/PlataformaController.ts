import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaControllerInterface } from "./contracts/PlataformaControllerInterface";
import { PlataformaServiceInterface } from "../service/contracts/PlataformaServiceInterface";
import { NextFunction, Request, Response } from "express";
import { DomainError } from "../error/DomainError";

export class PlataformaController implements PlataformaControllerInterface{
    private service: PlataformaServiceInterface<PlataformaDTO>;

    constructor(service: PlataformaServiceInterface<PlataformaDTO>){
        this.service = service;
    }
    
    findByTitulo(req: Request, resp: Response) {
        try{
            const titulo = req.params.titulo;
            const resultado = this.service.findByTitulo(titulo);
            resp.status(200).json(resultado).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    
    async findAll(resp: Response){        
        resp.status(200).json(this.service.findAll()).end();
    } 

    findById(req: Request, resp: Response){
        try{
            const resultado = this.service.findById(Number(req.params.id));
            resp.status(200).json(resultado).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    save(req: Request, resp: Response){             
        try{            
            const plataforma = new PlataformaDTO(JSON.parse(req.body).titulo);            
            const saved = this.service.save(plataforma);
            resp.status(201).json(saved).end();
        }catch(error){
            if (error instanceof DomainError)
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
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    delete(req: Request, resp: Response){
        const id = Number(req.params.id);
        if (this.service.delete(id))
            resp.status(200).json({mensagem: "Plataforma removida com sucesso"}).end();
        else
            resp.status(400).json({mensagem: "Erro ao tentar excluir a plataforma, verifique se ela está cadastrada"}).end();
    }
    
}