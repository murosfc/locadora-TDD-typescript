import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioService } from "../../service/UsuarioService";
import { UsuarioController } from "../UsuarioController";

function criaSut() {
    const repo = UsuarioRepository.getInstance();
    const service = new UsuarioService(repo);
    const sut = new UsuarioController(service);
    return {sut, service};
}

function newSpy() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        end: jest.fn()
    };    
}

describe('UsuarioController', () => {
    const {sut, service} = criaSut();
    const resp_spy = newSpy();

    it('Deve salvar um usuário novo obtendo status code 200', () => {
        var req = { body: { nome: "João", email: "joao@gmail.com", senha: "123456", cpf: "12345678901"}};        
        sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);
        req = { body: { nome: "Pedro Ribeiro", email: "pedro_ribeiro@gmail.com", senha: "123456", cpf: "28394758402"}};        
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
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it("Deve obter um erro 400 ao tentar atualizar um usuário com dados inválidos", () => {
        const req = { body: { nome: "", email: "", senha: "", cpf: ""}, params: {id: 1}};
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve obter um erro 500 ao tentar atualizar um usuário com erro interno', () => {    
        const req = { body: { nome: "João", email: "joaoslima@gmail.com", senha: "123456", cpf: "12345678999"}};
        jest.spyOn(service, 'update').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao excluír um usuário', () => {
        const req = { params: {id: 1}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber 400 ao tentar excluír um usuário com id inválido ou inexistente', () => {
        var req = { params: {id: 0}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { params: {id: 1}};
        sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });     

    it('Deve receber 200 ao buscar por todos os usuários', () => {
        sut.findAll(resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber 200 ao buscar um usuário por CPF', () => {
        sut.findByCpf({params: {cpf: "28394758402"}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber status 400 ao buscar um usuário por CPF inválido', () => {
        sut.findByCpf({params: {cpf: ""}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve receber status 500 ao buscar um usuário por CPF com erro interno', () => {
        const req = {params: {cpf: "98998998999"}};
        jest.spyOn(service, 'findByCpf').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        sut.findByCpf(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao buscar um usuário por e-mail', () => {                
        sut.findByEmail({body: {email: "pedro_ribeiro@gmail.com"}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber 400 ao buscar um usuário por e-mail inválido', () => {       
        sut.findByEmail({body: {email: "naocadastrado@gmail.com"}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve receber 500 de erro interno de servidor ao buscar por e-mail', () =>{           
        jest.spyOn(service, 'findByEmail').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        sut.findByEmail({body: {email: "no@ongames.com"}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao solicitar o cadastros de todos os clientes', () =>{
        sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it('Deve receber 200 ao buscar um usuário por id', () => {          
        sut.findById({params: {id: 2}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber 400 ao buscar um usuário por id inválido ou inválido', () => {        
        sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it('Deve receber 500 de erro interno de servidor ao buscar por id', () =>{        
        jest.spyOn(service, 'findById').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });
});