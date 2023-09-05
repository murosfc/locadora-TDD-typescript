import { Response, Request } from "express";
import { JogoControllerInterface } from "./contracts/JogoControllerInterface";
import { JogoServiceInterface } from "../service/contracts/JogoServiceInterface";
import { JogoDTO } from "../service/JogoService";
import { DomainError } from "../error/DomainError";
import { PlataformaDTO } from "../service/PlataformaService";
import { PlataformaRepository } from "../repositories/InMemoryRepository/PlataformaRepository";

export class JogoController implements JogoControllerInterface{
    service: JogoServiceInterface<JogoDTO>;
    repoPlataforma = PlataformaRepository.getInstance();

    constructor(service: JogoServiceInterface<JogoDTO>){
        this.service = service;
    }

    save(req: Request, resp: Response){        
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
    findAll(resp: Response) {
        try{   
            const jogos = this.service.findAll();               
            resp.status(200).json(jogos).end();
        }
        catch(error){
            resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }       
    }   

    findById(req: Request, resp: Response){
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

    update(req: Request, resp: Response){        
        try{ 
            const platDTO = this.repoPlataforma.findById(Number(req.body.plataforma.id)) as PlataformaDTO; 
            console.log("id plata : "+req.body.plataforma.id);                   
            const jogoDTO = new JogoDTO(req.body.titulo, platDTO, req.body.valor, req.body.urlImagem);            
            jogoDTO.id = Number(req.params.id);   
            const jogo = this.service.update(jogoDTO);           
            resp.status(200).json(jogo).end();
        }catch(error){
            console.log((error as Error).message);
            if (error instanceof DomainError)            
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }
    }    

    findByPlataforma(req: Request, resp: Response){         
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

    findByRangeValor(req: Request, resp: Response){
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
    
    delete(req: Request, resp: Response){
        if (this.service.delete(Number(req.params.id)))
            resp.status(200).json({mensagem: "Jogo removido com sucesso"}).end();
        else
            resp.status(400).json({mensagem: "Erro ao tentar excluir o jogo, verifique se ele está cadastrado"}).end();
    }
    
}