import { ContaServiceInterface } from "src/service/contracts/ContaServiceInterface";
import { ContaDTO } from "../service/ContaService";
import { ContaControllerInterface } from "./contracts/ContaContollerInterface";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { DomainError } from "src/error/DomainError";

export class ContaController implements ContaControllerInterface{
    service: ContaServiceInterface<ContaDTO>

    constructor(service: ContaServiceInterface<ContaDTO>) {
        this.service = service;        
    }
    returnResponse(resp: Response, result: any){
        if(result instanceof ContaDTO){
            resp.status(201).json(result);
        }
        if(result instanceof DomainError){
            resp.status(400).json(result.message);
        }
    }

    save(req: Request, resp: Response){
        try{
            const conta = new ContaDTO(req.body.email, req.body.senha, req.body.jogo);
            const contaSaved = this.service.save(conta);
            this.returnResponse(resp, contaSaved);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");
        }
    }
    update(req: Request, resp: Response){
        try{
            const conta = new ContaDTO(req.body.email, req.body.senha, req.body.jogo);
            conta.id = req.body.id;
            const contaUpdated = this.service.update(conta);
            this.returnResponse(resp, contaUpdated);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");
        }
    }
    delete(req: Request, resp: Response) {
        try{
            const resultado = this.service.delete(Number(req.params.id));
            if(resultado){
                resp.status(200).json("Conta deletada com sucesso");
            }else{
                resp.status(404).json("Conta não encontrada");
            }
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }
    findByEmail(req: Request, resp: Response){
        try{
            const conta = this.service.findByEmail(req.params.email);
            this.returnResponse(resp, conta);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }
    findByJogo(req: Request, resp: Response){
        try{
            const conta = this.service.findByJogo(req.params.jogo);
            this.returnResponse(resp, conta);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }
    findAll(resp: Response){
        try{
            resp.status(200).json(this.service.findAll());
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }
    findById(req: Request, resp: Response){
        try{
            const conta = this.service.findById(Number(req.params.id));
            this.returnResponse(resp, conta);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }    
}