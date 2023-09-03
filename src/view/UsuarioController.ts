import { Response, Request } from "express";
import { UsuarioControllerInterface } from "./contracts/UsuarioControllerInterface";
import { UsuarioServiceInterface } from "../service/contracts/UsuarioServiceInterface";
import { UsuarioDTO } from "../service/UsuarioService";
import { DomainError } from "../error/DomainError";

export class UsuarioController implements UsuarioControllerInterface {
    service: UsuarioServiceInterface<UsuarioDTO>;

    constructor(service: UsuarioServiceInterface<UsuarioDTO>) {
        this.service = service;
    }   

    private errorHandler(error: any, resp: Response) {
        if (error instanceof DomainError)
            resp.status(400).json({ mensagem: error.message }).end();
        else
            resp.status(500).json({ mensagem: "Erro interno no servidor" }).end();
    }

    async getUserbyToken(req: Request, resp: Response) {
        try{
            const token = req.headers.authorization as string;            
            const user = await this.service.getUserByToken(token);
            resp.status(200).json(user).end();
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }

    async save(req: Request, resp: Response) {
        try {
            const user = new UsuarioDTO(req.body.nome, req.body.email, req.body.senha, req.body.cpf);
            const userSaved = await this.service.save(user);
            resp.status(201).json(userSaved).end();            
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }

    async update(req: Request, resp: Response) {
        try {
            const userFromDB = await this.service.findById(Number(req.params.id)) as UsuarioDTO;
            userFromDB.nome = req.body.nome;
            userFromDB.email = req.body.email;
            userFromDB.senha = req.body.senha;
            const updatedUser = await this.service.update(userFromDB);
            resp.status(200).json(updatedUser).end();
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }

    async delete(req: Request, resp: Response) {
        const id = Number(req.params.id);
        const excluido = await this.service.delete(id);
        if (excluido)
            resp.status(200).json({ mensagem: "Usuário removido com sucesso" }).end();
        else
            resp.status(400).json({ mensagem: "Erro ao tentar excluir o usuário, verifique se ele está cadastrado" }).end();
    }

    async findAll(resp: Response) {
        try {
            const allUsers = await this.service.findAll();
            resp.status(200).json(allUsers).end();
        } catch (error) {
            resp.status(500).json({ mensagem: "Erro interno no servidor" }).end();
        }
    }

    async findByEmail(req: Request, resp: Response) {
        try {
            const email = req.params.email;
            const user = await this.service.findByEmail(email);
            resp.status(200).json(user).end();
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }
    async findByCpf(req: Request, resp: Response) {
        try {
            const cpf = req.params.cpf;
            const user = await this.service.findByCpf(cpf);
            resp.status(200).json(user).end();
        }
        catch (error) {
            this.errorHandler(error, resp);
        }
    }

    async findById(req: Request, resp: Response) {
        try {
            const id = Number(req.params.id);
            const user = await this.service.findById(id);
            resp.status(200).json(user).end();
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }

    async login(req: Request, resp: Response) {
        try {
            const email = req.body.email;
            const senha = req.body.senha;
            const user = await this.service.login(email, senha);
            resp.status(200).json(user.token).end();
        } catch (error) {
            this.errorHandler(error, resp);
        }
    }

}