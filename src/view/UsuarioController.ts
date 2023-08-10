import { Response, Request } from "express";
import { UsuarioControllerInterface } from "./contracts/UsuarioControllerInterface";
import { UsuarioServiceInterface } from "../service/contracts/UsuarioServiceInterface";
import { UsuarioDTO } from "../service/UsuarioService";
import { DomainError } from "../error/DomainError";

export class UsuarioController implements UsuarioControllerInterface{
    service: UsuarioServiceInterface<UsuarioDTO>;

    constructor(service: UsuarioServiceInterface<UsuarioDTO>){
        this.service = service;
    }

    private errorHandler(error: any, resp: Response){
        if (error instanceof DomainError)
            resp.status(400).json({mensagem: error.message}).end();
        else    
            resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
    }

    save(req: Request, resp: Response){
        try{
            const user = new UsuarioDTO(req.body.nome, req.body.email, req.body.senha, req.body.cpf);
            resp.status(201).json(this.service.save(user)).end();
        }catch(error){
            this.errorHandler(error, resp);     
        }
    }
    
    update(req: Request, resp: Response) {
        try{    
            const userFromDB = this.service.findById(Number(req.params.id));
            userFromDB.nome = req.body.nome;
            userFromDB.email = req.body.email;
            userFromDB.senha = req.body.senha;         
            const updatedUser = this.service.update(userFromDB);
            resp.status(200).json(updatedUser).end();
        }catch(error){
            this.errorHandler(error, resp);      
        }
    }

    delete(req: Request, resp: Response) {
        const id = Number(req.params.id);
        if (this.service.delete(id))
            resp.status(200).json({mensagem: "Usuário removido com sucesso"}).end();
        else
            resp.status(400).json({mensagem: "Erro ao tentar excluir o usuário, verifique se ele está cadastrado"}).end();
    }
    
    findByEmail(req: Request, resp: Response): void {
        try{
            const email = req.body.email;
            const user = this.service.findByEmail(email);
            resp.status(200).json(user).end();
        }catch(error){
            this.errorHandler(error, resp);  
        }
    }
    findByCpf(req: Request, resp: Response): void {
        try{
            const cpf = req.body.cpf;
            const user = this.service.findByCpf(cpf);
            resp.status(200).json(user).end();
        }
        catch(error){
            this.errorHandler(error, resp);  
        }
    }
    findAll(resp: Response<any, Record<string, any>>): void {
        resp.status(200).json(this.service.findAll()).end();        
    }

    findById(req: Request, resp: Response) {
        try{
            const id = Number(req.params.id);
            const user = this.service.findById(id);
            resp.status(200).json(user).end();
        }catch(error){
            this.errorHandler(error, resp);  
        }
    }

    

}