import { ContaServiceInterface } from "../service/contracts/ContaServiceInterface";
import { ContaDTO } from "../service/ContaService";
import { ContaControllerInterface } from "./contracts/ContaContollerInterface";
import { Request, Response } from "express";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";
import { JogoRepository } from "../repositories/InMemoryRepository/JogoRepository";
import { Jogo } from "../model/Jogo";



export class ContaController implements ContaControllerInterface {
    service: ContaServiceInterface<ContaDTO>
    repoJogos = JogoRepository.getInstance();

    constructor(service: ContaServiceInterface<ContaDTO>) {
        this.service = service;
    }

    private returnResponse(resp: Response, result: any, save: boolean) {
        if (result instanceof NotFoundException) {
            resp.status(404).json(result.message);           
        }
        else if (result instanceof DomainError) {
            resp.status(400).json(result.message);            
        }
        else if (result instanceof ContaDTO || result instanceof Array) {
            if (save) {
                resp.status(201).json(result);
            } else {
                resp.status(200).json(result);
            }            
        }
        else if (result instanceof Error) {
            resp.status(500).json("Erro interno de servidor");
        }
    }  

    save(req: Request, resp: Response) {
        try { 
            const jogo = this.repoJogos.findById(Number(req.body.jogo)) as Jogo;           
            const conta = new ContaDTO(req.body.email, req.body.senha, jogo);
            const contaSaved = this.service.save(conta);
            this.returnResponse(resp, contaSaved, true);
        } catch (e) {
            this.returnResponse(resp, e, true);
        }
    }
    update(req: Request, resp: Response) {
        try { 
            const jogo = this.repoJogos.findById(Number(req.body.jogo)) as Jogo;           
            const conta = new ContaDTO(req.body.email, req.body.senha, jogo);
            conta.id = Number(req.params.id);
            const contaUpdated = this.service.update(conta);            
            this.returnResponse(resp, contaUpdated, false);
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
    delete(req: Request, resp: Response) {
        try {
            const resultado = this.service.delete(Number(req.params.id));
            if (resultado) {
                resp.status(200).json("Conta deletada com sucesso");
            } else {
                resp.status(404).json("Conta não encontrada");
            }
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
    findByEmail(req: Request, resp: Response) {
        try {
            const conta = this.service.findByEmail(req.params.email);
            this.returnResponse(resp, conta, false)
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
    findByJogo(req: Request, resp: Response) {
        try {            
            const idJogo = Number(req.params.id);
            const contas = this.service.findByJogo(idJogo);            
            this.returnResponse(resp, contas, false);
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
    findAll(resp: Response) {
        try {
            resp.status(200).json(this.service.findAll());
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
    findById(req: Request, resp: Response) {
        try {
            const conta = this.service.findById(Number(req.params.id));
            this.returnResponse(resp, conta, false);
        } catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
     
    getTop10(resp: Response) {
        try{            
            const contas = this.service.getTop10();            
            this.returnResponse(resp, contas, false);
        }catch (e) {
            this.returnResponse(resp, e, false);
        }
    }
}