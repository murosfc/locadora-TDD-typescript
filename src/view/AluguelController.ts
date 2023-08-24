import { Response, Request } from "express";
import { AluguelControllerInterface } from "./contracts/AluguelControllerInterface";
import { AluguelServiceInterface } from "../service/contracts/AluguelServiceInterface";
import { Aluguel } from "../model/Aluguel";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";
import { ContaRepository } from "../repositories/InMemoryRepository/ContaRepository";
import { Conta } from "../model/Conta";
import { Usuario } from "../model/Usuario";

export class AluguelController implements AluguelControllerInterface {
    private service: AluguelServiceInterface<Aluguel>;
    private usuarioRepository = UsuarioRepository.getInstance();
    private contaRepository = ContaRepository.getInstance();

    constructor(service: AluguelServiceInterface<Aluguel>) {
        this.service = service;
    }

    private returnResponse(resp: Response, result: any, save: boolean) {
        if (result instanceof NotFoundException) {
            resp.status(404).json(result.message);
            return;
        }
        if (result instanceof DomainError) {
            resp.status(400).json(result.message);
        }
        if (result instanceof Aluguel || result instanceof Array) {
            if (save) {
                resp.status(201).json(result);
            } else {
                resp.status(200).json(result);
            }
        }
        if (result instanceof Error) {
            resp.status(500).json("Erro interno de servidor");
        }
    }

    save(req: Request, resp: Response): void {
        try {           
            const usuario = this.usuarioRepository.findById(req.body.idUsuario) as Usuario;            
            const contas: Conta[] = [];          
            req.body.contas.forEach((idConta: number) => {
                contas.push(this.contaRepository.findById(idConta) as Conta);
            });
            const desconto = req.body.desconto ? req.body.desconto : 0;
            const aluguel = new Aluguel(usuario, contas, req.body.periodoEmSemanas, desconto);
            const resultado = this.service.save(aluguel);
            this.returnResponse(resp, resultado, true);
        }
        catch (error) {
            this.returnResponse(resp, error, false);
        }
    }
    update(req: Request, resp: Response): void {
        try {
            console.log("ID USUARIO: " + req.body.idUsuario);
            const usuario = this.usuarioRepository.findById(req.body.idUsuario);
            console.log("Contas: " + req.body.contas);
            const contas: Conta[] = [];
            req.body.contas.forEach((idConta: number) => {
                contas.push(this.contaRepository.findById(idConta) as Conta);
            });
            console.log("Periodo em semanas: " + req.body.periodoEmSemanas);
            var aluguel = new Aluguel(usuario, contas, req.body.periodoEmSemanas, req.body.desconto);
            aluguel.id = Number(req.params.id);
            const resultado = this.service.update(aluguel);
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }

    findById(req: Request, resp: Response): void {
        try {
            const resultado = this.service.findById(Number(req.params.id));
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }

    delete(req: Request, resp: Response): void {
        try {
            const resultado = this.service.delete(Number(req.params.id));
            if (resultado) {
                resp.status(204).json("Aluguel excluído com sucesso");
            } else {
                resp.status(404).json("Aluguel não encontrado");
            }
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }
    estenderAluguel(req: Request, resp: Response): void {
        try {
            const resultado = this.service.estenderAluguel(Number(req.params.id), Number(req.body.periodoEmSemanas));
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }

    findByUsuario(req: Request, resp: Response): void {
        try {
            const resultado = this.service.findByUsuario(Number(req.params.idUsuario));
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }
    findByConta(req: Request, resp: Response): void {
        try {
            const resultado = this.service.findByConta(Number(req.params.idConta));
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }
    findByDataAluguelRange(req: Request, resp: Response): void {
        try {
            const resultado = this.service.findByDataAluguelRange(new Date(req.params.dataInicial), new Date(req.params.dataFinal));
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }

    findAll(resp: Response<any, Record<string, any>>): void {
        try {
            const resultado = this.service.findAll();
            this.returnResponse(resp, resultado, false);
        } catch (error) {
            this.returnResponse(resp, error, false);
        }
    }


}