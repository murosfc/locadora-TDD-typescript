import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { PlataformaDTO, PlataformaService } from "../../service/PlataformaService";
import { PlataformaController } from "../PlataformaController";


function cria_sut() {
    const repo = PlataformaRepository.getInstance();
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
        const jsonPlat = JSON.stringify({titulo: "Nintendo Switch"});            
        sut.save({body: jsonPlat} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);        
    });

    it("Deve retornar status 400 ao chamar o método save com dados inválidos", () => {
        const jsonPlat = JSON.stringify({titulo: ""});             
        sut.save({body: jsonPlat} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve retornar status 200 ao chamar o método update", () => {
        const jsonPlat = JSON.stringify({titulo: "XBOX ONE S/X"});            
        sut.update({body: jsonPlat, params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve retornar status 400 ao chamar o método update com dados inválidos", () => {
        const jsonPlat = JSON.stringify({titulo: ""});             
        sut.update({body: jsonPlat, params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve retornar status 400 ao chamar o método update com id inválido", () => {
        const jsonPlat = JSON.stringify({titulo: "XBOX ONE S/X"});             
        sut.update({body: jsonPlat, params: {id: 0}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve retornar status 200 ao chamar o método delete", () => {
        sut.delete({params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve retornar status 400 ao chamar o método delete com id inválido", () => {
        sut.delete({params: {id: 0}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });
});
