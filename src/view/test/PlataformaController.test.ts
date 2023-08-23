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

    it('Deve retornar status 201 ao chamar o método save', async () => {               
        await sut.save({body: {titulo: "Nintendo Switch"}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);        
    });
   
    it("Deve retornar status 400 ao chamar o método save com dados inválidos", async () => {                  
        await sut.save({body: {titulo: ""}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it('Deve receber status 500 ao tentar salvar uma plataforma com erro interno', async () => {        
        jest.spyOn(service, 'save').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.save({params: {titulo: 'Xbox X/S'}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        jest.clearAllMocks();
    });

    it('Deve retornar status 200 ao chamar o método findAll', async () => {             
        await sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar status 200 ao chamar o método findById', async () => {                      
        await sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar status 400 ao chamar o método findById com id inválido', async () => {
        await sut.findById({params: {id: 0}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve receber status 500 ao tentar buscar plataforma por id com erro interno', async () => {
        jest.spyOn(service, 'findById').mockImplementation(() => { throw new Error("Erro interno de servidor")});
        await sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        jest.clearAllMocks();
    });

    it('Deve encontrar uma plataforma por titulo', async () => {
        await sut.findByTitulo({params: {titulo: "Nintendo Switch"}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar status 400 ao chamar o método findByTitulo com dados inválidos', async () => {        
        await sut.findByTitulo({params: {titulo: ""}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });    

    it("Deve retornar status 200 ao chamar o método update", async () => {               
        await sut.update({body: {titulo: "XBOX ONE S/X"}, params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve retornar status 400 ao chamar o método update com dados inválidos", async () => {                   
        await sut.update({body: {titulo: ""}, params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve retornar status 400 ao chamar o método update com id inválido", async () => {           
        await sut.update({body: {titulo: "XBOX ONE S/X"}, params: {id: 0}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve retornar status 200 ao chamar o método delete", async () => {
        await sut.delete({params: {id: 1}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve retornar status 400 ao chamar o método delete com id inválido", async () => {
        await sut.delete({params: {id: 0}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });   

    it('Deve receber status 500 ao tentar atualizar uma plataforma com erro interno', async () => {
        const jsonPlat = JSON.stringify({titulo: "XBOX ONE S/X"});             
        jest.spyOn(service, 'update').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.update({body: jsonPlat, params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar plataforma por titulo com erro interno', async () => {
        const json = JSON.stringify({titulo: 'Xbox X/S'});
        jest.spyOn(service, 'findByTitulo').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findByTitulo({body: json} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

});
