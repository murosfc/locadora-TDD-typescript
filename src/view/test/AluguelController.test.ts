import { Plataforma } from "../../model/Plataforma";
import { AluguelRepository } from "../../repositories/InMemoryRepository/AluguelRepository"
import { AluguelService } from "../../service/AluguelService";
import { AluguelController } from "../AluguelController";
import { Jogo } from "../../model/Jogo";
import { Conta } from "../../model/Conta";
import { Usuario } from "../../model/Usuario";
import { Aluguel } from "../../model/Aluguel";
import { UsuarioDTO } from "src/service/UsuarioService";

function criaSut(){
    const repo = AluguelRepository.getInstance();
    const service = new AluguelService(repo);
    const sut = new AluguelController(service);
    return {sut, service};
}

// describe("Teste de unidade do controller de aluguel", () => {
//     const {sut, service} = criaSut();
//     const plataforma = new Plataforma("PS5");
//     const jogo = new Jogo("God of War", plataforma, 25, "");
//     const jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "");
//     const conta = new Conta("conta01@ongames.com", "123456", [jogo]);
//     conta.id = 1; 
//     const conta2 = new Conta("conta02@ongames.com", "123456", [jogo2]); 
//     conta2.id = 2;
//     const usuario = new UsuarioDTO("Felipe", "felipe@gmail.com", "123456", "11223445565");
//     const resp_spy  = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), end: jest.fn()};

//     it("deve receber a instância do sut válida", () => {
//         expect(sut).not.toBeUndefined();
//     });

//     it("deve receber 201 ao salvar um aluguel", () => {
//         var req = {body: {usuario: usuario, contas: [conta], periodoEmSemanas: 1}};
//         sut.save(req as any, resp_spy as any);
//         console.log(resp_spy.json.mock.calls[0][0].message);
//         expect(resp_spy.status).toHaveBeenCalledWith(201);
//     });

//     it("deve receber 400 ao salvar um aluguel com erro de atributo", () => {
//         var req = {body: {usuario: undefined as unknown as Usuario, contas: [conta], periodoEmSemanas: 1}};
//         sut.save(req as any, resp_spy as any);
//         expect(resp_spy.status).toHaveBeenCalledWith(400);
//         req = {body: {usuario: usuario, contas: [], periodoEmSemanas: 1}}; 
//         sut.save(req as any, resp_spy as any);
//         expect(resp_spy.status).toHaveBeenCalledWith(400);
//         req = {body: {usuario: usuario, contas: [conta], periodoEmSemanas: 0}};
//         sut.save(req as any, resp_spy as any);
//         expect(resp_spy.status).toHaveBeenCalledWith(400);
//     });



})