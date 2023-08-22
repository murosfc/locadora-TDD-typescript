import { Plataforma } from "../../model/Plataforma";
import { AluguelRepository } from "../../repositories/InMemoryRepository/AluguelRepository"
import { AluguelService } from "../../service/AluguelService";
import { AluguelController } from "../AluguelController";
import { Jogo } from "../../model/Jogo";
import { Conta } from "../../model/Conta";
import { Usuario } from "../../model/Usuario";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository";
import { ContaRepository } from "../../repositories/InMemoryRepository/ContaRepository";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";

function criaSut() {
    const repo = AluguelRepository.getInstance();
    const service = new AluguelService(repo);
    const sut = new AluguelController(service);
    return { sut, service };
}

describe("Teste de unidade do controller de aluguel", () => {
    const { sut, service } = criaSut();
    var plataforma = new Plataforma("PS5");
    plataforma = PlataformaRepository.getInstance().save(plataforma);
    var jogo = new Jogo("God of War", plataforma, 25, "");
    jogo = JogoRepository.getInstance().save(jogo) as Jogo;
    var jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "");
    jogo2 = JogoRepository.getInstance().save(jogo2) as Jogo;
    var conta = new Conta("conta01@ongames.com", "123456", [jogo]);
    conta = ContaRepository.getInstance().save(conta) as Conta;
    var conta2 = new Conta("conta02@ongames.com", "123456", [jogo2]);
    conta2 = ContaRepository.getInstance().save(conta2) as Conta;
    var usuario = new Usuario("Felipe", "felipe@gmail.com", "123456", "11223445565");
    usuario = UsuarioRepository.getInstance().save(usuario);
    const resp_spy = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), end: jest.fn() };

    it("deve receber a instância do sut válida", () => {
        expect(sut).not.toBeUndefined();
    });

    it("deve receber 201 ao salvar um aluguel", () => {
        var req = { body: { usuario: usuario, contas: [conta], periodoEmSemanas: 1 } };
        sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);
        var req = { body: { usuario: usuario, contas: [conta2], periodoEmSemanas: 2 } };
        sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    it("deve receber 400 ao salvar um aluguel com erro de atributo", () => {
        var req = { body: { usuario: undefined as unknown as Usuario, contas: [conta], periodoEmSemanas: 1 } };
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { usuario: usuario, contas: [], periodoEmSemanas: 1 } };
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { usuario: usuario, contas: [conta], periodoEmSemanas: 0 } };
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it("Deve receber 200 ao atualizar um aluguel", () => {
        var req = { body: { usuario: usuario, contas: [conta], periodoEmSemanas: 3 }, params: {id: 1 } };
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve receber 400 ao tentar atualizar um aluguel com atributo inválido", () => {
        var req = { body: { usuario: undefined as unknown as Usuario, contas: [conta], periodoEmSemanas: 3 }, params: {id: 1 } };
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { usuario: usuario, contas: [], periodoEmSemanas: 3 }, params: {id: 1 } };
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { usuario: usuario, contas: [conta], periodoEmSemanas: 0 }, params: {id: 1 } };
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it("Deve receber 404 ao tentar atualizar um aluguel com id inválido", () => {
        var req = { body: { usuario: usuario, contas: [conta], periodoEmSemanas: 3 }, params: {id: 100 } };
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);        
    });

    it("Deve retornar 200 ao buscar um aluguel por id", () => {
        var req = { params: {id: 1 } };
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);        
    });

    it("Deve retornar 404 ao buscar um aluguel por id inválido", () => {
        var req = { params: {id: 100 } };
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);        
    });

    it("Deve retornar 204 ao excluir um aluguel", () => {
        var req = { params: {id: 2 } };
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(204);                
    });

    it("Deve retornar 404 ao excluir um aluguel com id inválido", () => {
        var req = { params: {id: 100 } };
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);                
    });

    it("Deve retornar 500 ao buscar um aluguel por ir com erro interno", () => {
        var req = { params: {id: 1 } };
        const serviceSpy = jest.spyOn(service, "findById").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it("Deve retornar 500 ao excluir um aluguel com erro interno", () => {
        var req = { params: {id: 1 } };
        const serviceSpy = jest.spyOn(service, "delete").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);                
    });
    
    it("Deve retornar 200 ao estender um aluguel", () => {
        var req = { body: { periodoEmSemanas: 1 }, params: {id: 1 } };
        sut.estenderAluguel(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);                
    });

    it("Deve retornar 500 ao estender um aluguel com erro interno", () => {
        var req = { body: { periodoEmSemanas: 1 }, params: {id: 1 } };
        const serviceSpy = jest.spyOn(service, "estenderAluguel").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.estenderAluguel(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });
    
    it('Deve retornar 200 ao procurar um aluguel por usuário', () => {
        var req = { params: {idUsuario: 1 } };
        sut.findByUsuario(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);                
    });   

    it('Deve retornar 404 ao procurar um aluguel por usuário inválido', () => {
        var req = { params: {idUsuario: 100 } };
        sut.findByUsuario(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);                
    });

    it("Deve retornar 500 ao procurar um aluguel por usuário com erro interno", () => {
        var req = { params: {idUsuario: 1 } };
        const serviceSpy = jest.spyOn(service, "findByUsuario").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.findByUsuario(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve retornar 200 ao procurar um aluguel por conta', () => {
        var req = { params: {idConta: 1 } };
        sut.findByConta(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);                
    });

    it('Deve retornar 404 ao procurar um aluguel por conta inválida', () => {
        var req = { params: {idConta: 100 } };
        sut.findByConta(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(404);                
    });

    it("Deve retornar 500 ao procurar um aluguel por conta com erro interno", () => {
        var req = { params: {idConta: 1 } };
        const serviceSpy = jest.spyOn(service, "findByConta").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.findByConta(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it("Deve retornar 200 ao procurar um aluguel por range de data", () => {
        const dataInicial = new Date("2023-01-01");
        const dataFinal = new Date(); 
        dataFinal.setDate(dataInicial.getDate() + 30);   
        var req = { params: {dataInicial: dataInicial, dataFinal: dataFinal } };
        sut.findByDataAluguelRange(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it("Deve retornar 500 ao procurar um aluguel por range de data com erro interno", () => {
        const dataInicial = new Date("2023-01-01");
        const dataFinal = new Date();
        dataFinal.setDate(dataInicial.getDate() + 30);
        var req = { params: {dataInicial: dataInicial, dataFinal: dataFinal } };
        const serviceSpy = jest.spyOn(service, "findByDataAluguelRange").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.findByDataAluguelRange(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it("Deve retornar 200 ao buscar todos os alugueis", () => {
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it("Deve retornar 500 ao buscar todos os alugueis com erro interno", () => {
        const serviceSpy = jest.spyOn(service, "findAll").mockImplementation(() => { throw new Error("Erro interno de servidor") });
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });
})