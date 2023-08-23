import { PlataformaDTO } from "../../service/PlataformaService";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository"
import { JogoService } from "../../service/JogoService";
import { JogoController } from "../JogoController";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";

function criaSut() {
    const repo = JogoRepository.getInstance();
    const service = new JogoService(repo);
    const sut = new JogoController(service);
    return {sut, service};
}

function newSpy() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        end: jest.fn()
        };    
}

describe('Testes do Controller para Jogos', () => {
    const {sut, service} = criaSut();
    const resp_spy = newSpy();

    const PLAT_XBOX = PlataformaRepository.getInstance().save(new Plataforma("Xbox X/S"));   
    const PLAT_PS5 = PlataformaRepository.getInstance().save(new Plataforma("PS5"));   
    const PLAT_SWITCH = PlataformaRepository.getInstance().save(new Plataforma("Nintendo Switch"));    

    it("Deve retornar 201 ao cadastrar um Jogo", () => {       
        const req = { body: { nome: "Fifa 2023", idPlataforma: PLAT_PS5.id, valor: 15, urlImagem: ""}};
        sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    it("Deve retornar 400 ao tentar cadastrar um Jogo com parâmetro inválido", () => {
        var req = { body: { nome: "", idPlataforma: PLAT_PS5.id, valor: 15, urlImagem: ""}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { nome: "Zelda", idPlataforma: 0, valor: 15, urlImagem: ""}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { nome: "Zelda", idPlataforma: PLAT_SWITCH.id, valor: -1, urlImagem: ""}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 ao listar todos os jogos", () => {
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it('Deve retornar 500 ao listar todos os jogos com erro interno', () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        jest.spyOn(service, 'findAll').mockRestore();
    });

    it("Deve retornar 400 ao busca um jogo por valor em um range inválido", () => {
        const req = {params: {min: 20, max: 10}};
        sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 deletar um jogo", () => {
        const req = {params: {id: 1}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 200 ao buscar jogo por id", () => {
        const req = { params: { id: 1}};
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao buscar jogo por id inválido", () => {
        const req = { params: { id: 0}};
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })    

    it("Deve retornar 200 ao atualizar um jogo", () => {
        const req = { body: { nome: "Fifa 2023", plataforma: PLAT_XBOX, valor: 20, urlImagem: ""}, params: {id: 1}};
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao atualizar um jogo com parâmetro inválido", () => {
        const req = { body: { nome: "", plataforma: PLAT_XBOX, valor: 20, urlImagem: ""}, params: {id: 1}};
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        const req2 = { body: { nome: "Fifa 2023", plataforma: undefined, valor: 20, urlImagem: ""}, params: {id: 1}};
        sut.update(req2 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        const req3 = { body: { nome: "Fifa 2023", plataforma: PLAT_XBOX, valor: -1, urlImagem: ""}, params: {id: 1}};
        sut.update(req3 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 ao buscar jogo por plataforma", () => {        
        sut.findByPlataforma({params: {id: 2}}  as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao buscar jogo por plataforma inválida", () => {               
        sut.findByPlataforma({params: {id: 21}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 ao busca um jogo por valor em um range válido", () => {
        const req = {params: {min: 10, max: 30}};
        sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    
    it("Deve retornar 400 deletar um jogo com id inválido", () => {
        const req = {params: {id: 0}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })    

    it('Deve receber status 500 ao tentar salvar um jogo com erro interno', () => {
        const plataformas: PlataformaDTO[] = [PLAT_XBOX, PLAT_PS5, PLAT_SWITCH];
        const req = { body: { nome: "Fifa 2023", plataformas: plataformas, valor: 15, urlImagem: ""}};        
        jest.spyOn(service, 'save').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar jogo por id com erro interno', () => {
        const req = { params: { id: 1}};
        jest.spyOn(service, 'findById').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar atualizar um jogo com erro interno', () => {
        const req = { body: { nome: "Fifa 2023", plataformas: [PLAT_XBOX], valor: 20, urlImagem: ""}, params: {id: 1}};
        jest.spyOn(service, 'update').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar jogo por plataforma com erro interno', () => {
        const json = JSON.stringify({titulo: 'Xbox X/S'});
        jest.spyOn(service, 'findByPlataforma').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.findByPlataforma({body: json} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar jogo por valor em um range com erro interno', () => {
        const req = {params: {min: 10, max: 20}};
        jest.spyOn(service, 'findByRangeValor').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });


})
