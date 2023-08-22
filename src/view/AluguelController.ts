import { Response, Request } from "express";
import { AluguelControllerInterface } from "./contracts/AluguelControllerInterface";
import { AluguelServiceInterface } from "../service/contracts/AluguelServiceInterface";
import { Aluguel } from "../model/Aluguel";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";
import { ContaRepository } from "../repositories/InMemoryRepository/ContaRepository";
import { Conta } from "../model/Conta";

export class AluguelController implements AluguelControllerInterface{
    private service: AluguelServiceInterface<Aluguel>;
    private usuarioRepository = UsuarioRepository.getInstance();
    private contaRepository = ContaRepository.getInstance();

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
            const usuario = this.usuarioRepository.findById(req.body.usuarioId);            
            const contas: Conta[] = [];
            req.body.contas.forEach((idConta: number) => {
                contas.push(this.contaRepository.findById(idConta) as Conta);
            });            
            const desconto = req.body.desconto ? req.body.desconto : 0;
            const aluguel = new Aluguel(usuario, contas, req.body.periodoEmSemanas, desconto);
            const resultado = this.service.save(aluguel);
            this.returnResponse(resp, resultado, true);
        }
        catch(error){
            this.trataErro(error, resp);
        }
    }
    findById(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    update(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    delete(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    estenderAluguel(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    findByUsuario(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    findByConta(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    findByDataAluguelRange(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    isContaAvailable(req: Request, resp: Response): void {
        throw new Error("Method not implemented.");
    }
    findAll(resp: Response<any, Record<string, any>>): void {
        throw new Error("Method not implemented.");
    }
   
    
}