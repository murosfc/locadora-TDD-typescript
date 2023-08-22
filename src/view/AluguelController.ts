import { Response, Request } from "express";
import { AluguelControllerInterface } from "./contracts/AluguelControllerInterface";
import { AluguelServiceInterface } from "../service/contracts/AluguelServiceInterface";
import { Aluguel } from "../model/Aluguel";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";

export class AluguelController implements AluguelControllerInterface{
    private service: AluguelServiceInterface<Aluguel>;

    constructor(service: AluguelServiceInterface<Aluguel>){
        this.service = service;
    }

    private returnResponse(resp: Response, result: any, save: boolean){  
        if(result instanceof NotFoundException){
            resp.status(404).json(result.message);
        }
        if(result instanceof DomainError){
            resp.status(400).json(result.message);
        }
        if(result instanceof Aluguel|| result instanceof Array){
            if(save){            
                resp.status(201).json(result);
            }else{
                resp.status(200).json(result);
            }
        }
        resp.status(500).json("Erro interno de servidor");         
    }

    private trataErro(error: any, resp: Response){
        if(error instanceof DomainError){
            resp.status(400).json(error.message);
        }
        resp.status(500).json("Erro interno no servidor");
    }
        

    save(req: Request, resp: Response): void {
        try{
            const aluguel = new Aluguel(req.body.usuario, req.body.contas, req.body.periodoEmSemanas, req.body.desconto);
            const resultado = this.service.save(aluguel);
            this.returnResponse(resp, resultado, true);
        }
        catch(error){            
            this.trataErro(error, resp);
        }
    }
    update(req: Request, resp: Response): void {
        try{
            var aluguel = new Aluguel(req.body.usuario, req.body.contas, req.body.periodoEmSemanas, req.body.desconto);
            aluguel.id = Number(req.params.id);
            const resultado = this.service.update(aluguel);
            this.returnResponse(resp, resultado, false);
        }catch(error){            
            this.trataErro(error, resp);
        }
    }

    findById(req: Request, resp: Response): void {
        try{
            const resultado = this.service.findById(Number(req.params.id));
            this.returnResponse(resp, resultado, false);
        } catch(error){            
            this.trataErro(error, resp);
        }
    }
   
    delete(req: Request, resp: Response): void {
        try{
            const resultado = this.service.delete(Number(req.params.id));
            if(resultado){
                resp.status(204).json("Aluguel excluído com sucesso");
            }else{
                resp.status(404).json("Aluguel não encontrado");
            }
        }catch (error){
            resp.status(500).json("Erro interno no servidor ao tentar excluir aluguel");
        }
    }
    estenderAluguel(req: Request, resp: Response): void {
        try{
            const resultado = this.service.estenderAluguel(Number(req.params.id), Number(req.body.periodoEmSemanas));
            this.returnResponse(resp, resultado, false);
        }catch(error){            
            this.trataErro(error, resp);
        }
    }
    
    findByUsuario(req: Request, resp: Response): void {
        try{
            const resultado = this.service.findByUsuario(Number(req.params.idUsuario));
            this.returnResponse(resp, resultado, false);
        }catch(error){            
            this.trataErro(error, resp);
        }
    }
    findByConta(req: Request, resp: Response): void {
        try{
            const resultado = this.service.findByConta(Number(req.params.idConta));
            this.returnResponse(resp, resultado, false);
        }catch(error){
            this.trataErro(error, resp);
        }
    }
    findByDataAluguelRange(req: Request, resp: Response): void {
        try{
            const resultado = this.service.findByDataAluguelRange(new Date(req.params.dataInicial), new Date(req.params.dataFinal));
            this.returnResponse(resp, resultado, false);
        }catch(error){
            this.trataErro(error, resp);
        }
    }
   
    findAll(resp: Response<any, Record<string, any>>): void {
        try{
            const resultado = this.service.findAll();
            this.returnResponse(resp, resultado, false);
        }catch(error){
            this.trataErro(error, resp);
        }
    }
   
    
}