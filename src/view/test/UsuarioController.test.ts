import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioService } from "../../service/UsuarioService";
import { UsuarioController } from "../UsuarioController";

function criaSut() {
    const repo = UsuarioRepository.getInstance();
    const service = new UsuarioService(repo);
    const sut = new UsuarioController(service);
    return { sut, service};
}

describe('UsuarioController', () => {
    const { sut, service } = criaSut();
    const resp_spy = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), end: jest.fn() };

    it('Deve salvar um usuário novo obtendo status code 200', () => {
        const req = { body: { nome: "João", email: "joao@gmail.com", senha: "123456", cpf: "12345678901"}};        
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    it('Deve obter um erro 400 ao tentar salvar um usuário com dados inválidos', () => {
        const req = { body: { nome: "", email: "", senha: "", cpf: ""}};
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve obter um erro 500 ao tentar salvar um usuário com erro interno', () => {
        const req = { body: { nome: "João", email: "joaosl@gmail.com", senha: "123456", cpf: "12345678999"}};   
        jest.spyOn(service, 'save').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve atualizar um usuário obtendo status code 200', () => {
        const req = { body: { nome: "João Oliveira", email: "joao_oliveira@gmail.com", senha: "123456", cpf: "12345678901"}, params: {id: 1}};
        sut.update(req as any, resp_spy as any); 
        console.log(resp_spy.json.mock.calls[0][0]);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });




        


});