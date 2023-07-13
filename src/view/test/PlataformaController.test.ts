import { json } from "stream/consumers";
import { PlataformaRepo } from "../../repositories/InMemoryRepository/PlataformaRepo";
import { PlataformaDTO, PlataformaService } from "../../service/PlataformaService";
import { PlataformaController } from "../PlataformaController";
import { Response } from "express";

function cria_sut() {
    const repo = PlataformaRepo.getInstance();
    const service = new PlataformaService(repo);
    const sut = new PlataformaController(service);
    return {sut, service};
}

function newSpy() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        end: jest.fn()
        };    
}

describe('Testes do controller da plataforma', () => {
    const {sut, service} = cria_sut();
    const resp_spy = newSpy(); 
    
    it('Deve retornar status 200 ao chamar o método findAll', () => {             
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar status 200 ao chamar o método findById', () => {
        service.save(new PlataformaDTO("Xbox"));               
        sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar status 400 ao chamar o método findById com id inválido', () => {
        sut.findById({params: {id: 0}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar status 201 ao chamar o método save', () => {
        const jsonPlat = JSON.stringify(new PlataformaDTO("Nintendo Switch"));        
        sut.save({body: jsonPlat} as any, resp_spy as any);       
        console.log(resp_spy.json);
        expect(resp_spy.status).toHaveBeenCalledWith(201);
        
    });
});
