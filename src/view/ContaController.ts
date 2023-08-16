import { ContaServiceInterface } from "../service/contracts/ContaServiceInterface";
import { ContaDTO } from "../service/ContaService";
import { ContaControllerInterface } from "./contracts/ContaContollerInterface";
import { Request, Response } from "express";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";

export class ContaController implements ContaControllerInterface{
    service: ContaServiceInterface<ContaDTO>

    constructor(service: ContaServiceInterface<ContaDTO>) {
        this.service = service;        
    }
    private returnResponse(resp: Response, result: any, save: boolean){  
        if(result instanceof NotFoundException){
            resp.status(404).json(result.message);
        }
        if(result instanceof DomainError){
            resp.status(400).json(result.message);
        }
        if(result instanceof ContaDTO || result instanceof Array){
            if(save){            
                resp.status(201).json(result);
            }else{
                resp.status(200).json(result);
            }
        }        
    }

    save(req: Request, resp: Response){
        try{
            const conta = new ContaDTO(req.body.email, req.body.senha, req.body.jogo);
            const contaSaved = this.service.save(conta);
            this.returnResponse(resp, contaSaved, true);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");
        }
    }
    update(req: Request, resp: Response){
        try{
            const conta = new ContaDTO(req.body.email, req.body.senha, req.body.jogo);
            conta.id = Number(req.params.id);
            const contaUpdated = this.service.update(conta);
            this.returnResponse(resp, contaUpdated, false);
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
            this.returnResponse(resp, conta, false)
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }
    findByJogo(req: Request, resp: Response){        
        try{  
            const idJogo = Number(req.params.idJogo);           
            const contas = this.service.findByJogo(idJogo) as ContaDTO[];           
            this.returnResponse(resp, contas, false);
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
            this.returnResponse(resp, conta, false);
        }catch(e){
            resp.status(500).json("Erro interno de servidor");            
        }
    }    
}