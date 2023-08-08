import { Response, Request } from "express";
import { JogoControllerInterface } from "./contracts/JogoControllerInterface";
import { JogoServiceInterface } from "../service/contracts/JogoServiceInterface";
import { JogoDTO } from "../service/JogoService";
import { PlataformaDTO } from "../service/PlataformaService";

export class JogoController implements JogoControllerInterface{
    service: JogoServiceInterface<JogoDTO>;

    constructor(service: JogoServiceInterface<JogoDTO>){
        this.service = service;
    }

    save(req: Request, resp: Response){        
        try{
            const jogoDTO = new JogoDTO(req.body.nome, req.body.plataformas, req.body.preco, req.body.urlImagem);
            const jogo = this.service.save(jogoDTO);
            resp.status(201).json(jogo);
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();
        }
    }
    findAll(resp: Response) {
        return resp.status(200).json(this.service.findAll()).end();
    }

    findById(req: Request, resp: Response){
        try{
            return resp.status(200).json(this.service.findById(Number(req.params.id))).end();
        }
        catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }
    }

    update(req: Request, resp: Response){        
        try{ 
            const jogoDTO = new JogoDTO(req.body.nome, req.body.plataformas, req.body.preco, req.body.urlImagem);
            jogoDTO.id = Number(req.params.id);   
            const jogo = this.service.update(jogoDTO);
            return resp.status(200).json(jogo).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }
    }    

    findByPlataforma(req: Request, resp: Response){         
        try{
            const plataforma = new PlataformaDTO(JSON.parse(req.body).titulo);  
            return resp.status(200).json(this.service.findByPlataforma(plataforma)).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }        
    }

    findByRangeValor(req: Request, resp: Response){
        try{
            return resp.status(200).json(this.service.findByRangeValor(Number(req.params.min), Number(req.params.max))).end();
        }catch(error){
            if (error instanceof Error)
                resp.status(400).json({mensagem: error.message}).end();
            else    
                resp.status(500).json({mensagem: "Erro interno no servidor"}).end();       
        }  
    }    
    
    delete(req: Request, resp: Response){
        if (this.service.delete(Number(req.params.id)))
            return resp.status(200).json({mensagem: "Jogo removido com sucesso"}).end();
        else
            return resp.status(400).json({mensagem: "Erro ao tentar excluir o jogo, verifique se ele está cadastrado"}).end();
    }
    
}