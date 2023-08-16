import { Plataforma } from "../../model/Plataforma";
import { ContaRepository } from "../../repositories/InMemoryRepository/ContaRepository";
import { ContaService } from "../../service/ContaService";
import { ContaController } from "../ContaController";
import { Jogo } from "../../model/Jogo";

function criaSut(){
    const repo = ContaRepository.getInstance();
    const service = new ContaService(repo);
    const sut = new ContaController(service);
    return {sut, service};
}
function newSpy() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        end: jest.fn()
        };    
}
describe('Test Conta Controller', () => {
    const {sut, service} = criaSut();
    const resp_spy = newSpy();
    const plataforma1 = new Plataforma("PS5");
    plataforma1.id = 1;
    const plataforma2 = new Plataforma("XBOX");
    plataforma2.id = 2;
    const jogo1 = new Jogo("Fifa 203", plataforma1, 20,"");
    jogo1.id = 1;    
    const jogo2 = new Jogo("Call of Duty", plataforma2, 10,"");
    jogo2.id = 2;

    it('Deve retornar status 201 e uma conta', () => {
        var req = {body: {email: "conta01@ongames.com", senha: "123456", jogos: [jogo1, jogo2]}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(201);
        req = {body: {email: "conta02@ongames.com", senha: "1234567", jogos: [jogo1]}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    it("Deve retornar status 400 e uma mensagem de erro ao tentar salvar conta com atributo inválido", () => {
        var req = {body: {email: "", senha: "123456", jogos: [jogo1, jogo2]}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = {body: {email: "conta02@ongames.com", senha: "1234567", jogos: [jogo1]}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it("Deve retornar erro 500 ao tentar salvar conta com erro de servidor", () => {
        const serviceSpy = jest.spyOn(service, "save").mockImplementationOnce(() => {throw new Error("Erro de Servidor")});
        const req = {body: {email: "conta02@ongames.com", senha: "1234567", jogos: [jogo1]}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        serviceSpy.mockRestore();
    });

    it("Deve retornar status 200 ao atualizar uma conta", () => {
        var req = {body: {email: "conta02@ongames.com", senha: "1234567999", jogos: [jogo1]}, params: {id: 2}};
        sut.update(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it("Deve retornar status 400 ao tentar atualizar uma conta com atributo inválido", () => {
        var req = {body: {email: "", senha: "1234567999", jogos: [jogo1]}, params: {id: 2}};
        sut.update(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = {body: {email: "conta01@ongames.com", senha: "1234567999", jogos: [jogo1]}, params: {id: 2}};
        sut.update(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);

    });

    it('Deve retornar status 500 ao tentar atualizar uma conta com erro de servidor', () => {
        const serviceSpy = jest.spyOn(service, "update").mockImplementationOnce(() => {throw new Error("Erro de Servidor")});
        const req = {body: {email: "", senha: "1234567999", jogos: [jogo1]}, params: {id: 2}};
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao tentar excluir uma conta', () => {
        var req = {params: {id: 1}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });
    
    it('Deve receber 404 ao tentar excluir uma conta com id não encontrado', () => {
        var req = {params: {id: 5}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);
    });

    it('Deve receber status 200 ao buscar uma conta por email', () => {
        var req = {params: {email: "conta02@ongames.com"}};
        sut.findByEmail(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber status 404 ao buscar uma conta por email não encontrado', () => {
        const req = {params: {email: "conta03@ongames.com"}};
        sut.findByEmail(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);
    });

    it('Deve receber status 500 ao buscar uma conta por email com erro de servidor', () => {
        jest.spyOn(service, "findByEmail").mockImplementationOnce(() => {throw new Error("Erro de Servidor")});
        const req = {params: {email: "conta03@ongames.com"}};
        sut.findByEmail(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve encontrar uma conta por jogo', () => {         
        const req = {params: {idJogo: '1'}};           
        sut.findByJogo(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });


});
