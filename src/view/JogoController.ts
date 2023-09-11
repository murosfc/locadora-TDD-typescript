import { Response, Request } from "express";
import { JogoControllerInterface } from "./contracts/JogoControllerInterface";
import { JogoServiceInterface } from "../service/contracts/JogoServiceInterface";
import { JogoDTO } from "../service/JogoService";
import { DomainError } from "../error/DomainError";

import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaRepository } from "../repositories/InMemoryRepository/PlataformaRepository";

import { UsuarioService } from "../service/UsuarioService";
import { UsuarioRepository } from "../repositories/InMemoryRepository/UsuarioRepository";

export class JogoController implements JogoControllerInterface{
    service: JogoServiceInterface<JogoDTO>;
    repoPlataforma = PlataformaRepository.getInstance();
    private usuarioService = new UsuarioService(UsuarioRepository.getInstance());

    constructor(service: JogoServiceInterface<JogoDTO>){
        this.service = service;
    }

    async save(req: Request, resp: Response){  
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;       
        try{            
            const platDTO = this.repoPlataforma.findById(Number(req.body.idPlataforma)) as PlataformaDTO;  
                   
            const jogoDTO = new JogoDTO(req.body.titulo, platDTO, req.body.valor, req.body.urlImagem);
            const jogo = this.service.save(jogoDTO);
            resp.status(201).json(jogo);
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    async findAll(resp: Response) {
        try{   
            const jogos = this.service.findAll();               
            resp.status(200).json(jogos).end();
        }
        catch(error){
            resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }       
    }   

    async findById(req: Request, resp: Response){
        try{
            resp.status(200).json(this.service.findById(Number(req.params.id))).end();
        }
        catch(error){
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

    async update(req: Request, resp: Response){   
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;     
        try{ 
            const platDTO = this.repoPlataforma.findById(Number(req.body.plataforma.id)) as PlataformaDTO;                              
            const jogoDTO = new JogoDTO(req.body.titulo, platDTO, req.body.valor, req.body.urlImagem);            
            jogoDTO.id = Number(req.params.id);   
            const jogo = this.service.update(jogoDTO);           
            resp.status(200).json(jogo).end();
        }catch(error){            
            if (error instanceof DomainError)            
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }
    }    

    async findByPlataforma(req: Request, resp: Response){                
        try{               
            const listaJogos = this.service.findByPlataforma(Number(req.params.id));        
            resp.status(200).json(listaJogos).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }        
    }

    async findByRangeValor(req: Request, resp: Response){       
        try{            
            const jogos = this.service.findByRangeValor(Number(req.params.min), Number(req.params.max));
            resp.status(200).json(jogos).end();
        }catch(error){
            if (error instanceof DomainError)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }  
    }    
    
    async delete(req: Request, resp: Response){
        if (!await this.checkPermission(resp, req.headers.authorization as string)) return;
        if (this.service.delete(Number(req.params.id)))
            resp.status(200).json({mensagem: "Jogo removido com sucesso"}).end();
        else
            resp.status(400).json({mensagem: "Erro ao tentar excluir o jogo, verifique se ele está cadastrado"}).end();
    }
    
}