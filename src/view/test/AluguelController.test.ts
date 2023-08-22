import { Plataforma } from "../../model/Plataforma";
import { AluguelRepository } from "../../repositories/InMemoryRepository/AluguelRepository"
import { AluguelService } from "../../service/AluguelService";
import { AluguelController } from "../AluguelController";
import { Jogo } from "../../model/Jogo";
import { Conta } from "../../model/Conta";
import { Usuario } from "../../model/Usuario";
import { Aluguel } from "../../model/Aluguel";
import { UsuarioDTO } from "../../service/UsuarioService";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository";
import { ContaRepository } from "../../repositories/InMemoryRepository/ContaRepository";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";

function criaSut(){
    const repo = AluguelRepository.getInstance();
    const service = new AluguelService(repo);
    const sut = new AluguelController(service);
    return {sut, service};
}


describe("Teste de unidade do controller de aluguel", () => {
    const {sut, service} = criaSut();
    const plataforma = new Plataforma("PS5");
    PlataformaRepository.getInstance().save(plataforma);
    const jogo = new Jogo("God of War", plataforma, 25, "");
    const jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "");
    JogoRepository.getInstance().save(jogo);
    JogoRepository.getInstance().save(jogo2);
    const conta = new Conta("conta01@ongames.com", "123456", [jogo]);
    ContaRepository.getInstance().save(conta);    
    const conta2 = new Conta("conta02@ongames.com", "123456", [jogo2]); 
    ContaRepository.getInstance().save(conta2);
    const usuario = new Usuario("Felipe", "felipe@gmail.com", "123456", "11223445565");
    UsuarioRepository.getInstance().save(usuario);
    const resp_spy  = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), end: jest.fn()};

    it("deve receber a instância do sut válida", () => {
        expect(sut).not.toBeUndefined();
    });

    it("deve receber 201 ao salvar um aluguel", () => {
        var req = {body: {usuarioId: usuario.id, contas: [conta.id], periodoEmSemanas: 1}};
        sut.save(req as any, resp_spy as any);
        console.log(resp_spy.json.mock.calls[0][0].message);
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    // it("deve receber 400 ao salvar um aluguel com erro de atributo", () => {
    //     var req = {body: {usuario: undefined as unknown as Usuario, contas: [conta], periodoEmSemanas: 1}};
    //     sut.save(req as any, resp_spy as any);
    //     expect(resp_spy.status).toHaveBeenCalledWith(400);
    //     req = {body: {usuario: usuario, contas: [], periodoEmSemanas: 1}}; 
    //     sut.save(req as any, resp_spy as any);
    //     expect(resp_spy.status).toHaveBeenCalledWith(400);
    //     req = {body: {usuario: usuario, contas: [conta], periodoEmSemanas: 0}};
    //     sut.save(req as any, resp_spy as any);
    //     expect(resp_spy.status).toHaveBeenCalledWith(400);
    // });



})