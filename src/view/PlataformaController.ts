import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaControllerInterface } from "./contracts/PlataformaControllerInterface";
import { PlataformaServiceInterface } from "../service/contracts/PlataformaServiceInterface";
import { Request, Response } from "express";
import { DomainError } from "../error/DomainError";
import { UsuarioService } from "../service/UsuarioService";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";

export class PlataformaController implements PlataformaControllerInterface{
    private service: PlataformaServiceInterface<PlataformaDTO>;
    private usuarioService = new UsuarioService(UsuarioRepository.getInstance());

    constructor(service: PlataformaServiceInterface<PlataformaDTO>){
        this.service = service;
    }
    
    async findByTitulo(req: Request, resp: Response) {
        try{
            const titulo = await req.params.titulo;
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
        resp.status(200).json(await this.service.findAll()).end();
    } 

    async findById(req: Request, resp: Response){
        try{
            const resultado = await this.service.findById(Number(req.params.id));
            resp.status(200).json(resultado).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }

    private async checkPermission(resp: Response, token: string){
        if ( !(await this.usuarioService.usuarioAdministrador(token) || await this.usuarioService.usuarioFuncionario(token))){
            resp.status(401).json({mensagem: "Acesso Negado"}).end();
            return false;
        }
        return true;
    }

    async save(req: Request, resp: Response){                
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;       
        try{                                 
            const plataforma = new PlataformaDTO(req.body.titulo);            
            const saved = await this.service.save(plataforma);
            return resp.status(201).json(saved).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }

    async update(req: Request, resp: Response){
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;  
        try{           
            const plataforma = new PlataformaDTO(req.body.titulo);
            plataforma.id = Number(req.params.id);            
            const updated = await this.service.update(plataforma);
            return resp.status(200).json(updated).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    async delete(req: Request, resp: Response){
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;
        const id = Number(req.params.id);
        if (await this.service.delete(id))
            resp.status(200).json({mensagem: "Plataforma removida com sucesso"}).end();
        else
            resp.status(400).json({mensagem: "Erro ao tentar excluir a plataforma, verifique se ela está cadastrada"}).end();
    }
    
}