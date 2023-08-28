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

    beforeAll(async () => {
        var req = { body: { nome: "João", email: "joao@gmail.com", senha: "123456", cpf: "12345678901"}};        
        await sut.save(req as any, resp_spy as any);   
    });

    it('Deve salvar um usuário novo obtendo status code 201', async () => {              
        const req = { body: { nome: "Pedro Ribeiro", email: "pedro_ribeiro@gmail.com", senha: "123456", cpf: "28394758402"}};        
        try {
            await sut.save(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(201);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve obter um erro 400 ao tentar salvar um usuário com dados inválidos', async () => {
        const req = { body: { nome: "", email: "", senha: "", cpf: ""}};
        await sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve obter um erro 500 ao tentar salvar um usuário com erro interno', async () => {
        try{
            const req = { body: { nome: "João", email: "joaosl@gmail.com", senha: "123456", cpf: "12345678999"}};   
            jest.spyOn(service, 'save').mockImplementation(() => { throw new Error("Erro interno no servidor")});
            await sut.save(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(500);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve obter 200 ao fazer login', async () => {
        try{
            const req = { body: { email: 'joao@gmail.com', senha: '123456'}};
            await sut.login(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve obter 400 ao fazer login com dados inválidos', async () => {
        try{
            const req = { body: { email: 'joao@gmail.com', senha: ''}};
            await sut.login(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(400);
        }catch (error) {
            console.log(error);
        }
        try{
            const req = { body: { email: '', senha: '123456'}};
            await sut.login(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(400);
        }catch (error) {
            console.log(error);
        }
    });

    it('Deve obter 500 ao fazer login com erro interno', async () => {
        try{
            const req = { body: { email: 'joao@gmail.com', senha: '123456'}};
            jest.spyOn(service, 'login').mockImplementation(() => { throw new Error("Erro interno no servidor")});
            await sut.login(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(500);
        }catch (error) {
            console.log(error);
        }
    });

    it('Deve atualizar um usuário obtendo status code 200', async () => {
        try{
            const req = { body: { nome: "João Oliveira", email: "joao_oliveira@gmail.com", senha: "123456", cpf: "12345678901"}, params: {id: 1}};
            await sut.update(req as any, resp_spy as any);        
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it("Deve obter um erro 400 ao tentar atualizar um usuário com dados inválidos", async () => {
        const req = { body: { nome: "", email: "", senha: "", cpf: ""}, params: {id: 1}};
        await sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve obter um erro 500 ao tentar atualizar um usuário com erro interno', async () => {    
        const req = { body: { nome: "João", email: "joaoslima@gmail.com", senha: "123456", cpf: "12345678999"}};
        try{
            jest.spyOn(service, 'update').mockImplementation(() => { throw new Error("Erro interno no servidor")});
            await sut.update(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(500);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve receber 200 ao excluír um usuário', async () => {
        const req = { params: {id: 1}};
        try{
            await sut.delete(req as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve receber 400 ao tentar excluír um usuário com id inválido ou inexistente', async () => {
        var req = { params: {id: 0}};
        await sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { params: {id: 1}};
        await sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });     

    it('Deve receber 200 ao buscar por todos os usuários', async () => {
        await sut.findAll(resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    });

    it('Deve receber 200 ao buscar um usuário por CPF', async () => {
        try {
            await sut.findByCpf({params: {cpf: "28394758402"}} as any, resp_spy as any);        
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve receber status 400 ao buscar um usuário por CPF inválido', async () => {
        await sut.findByCpf({params: {cpf: ""}} as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve receber status 500 ao buscar um usuário por CPF com erro interno', async () => {
        const req = {params: {cpf: "98998998999"}};
        jest.spyOn(service, 'findByCpf').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        await sut.findByCpf(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao buscar um usuário por e-mail', async () => {    
        try{            
            await sut.findByEmail({params: {email: "pedro_ribeiro@gmail.com"}} as any, resp_spy as any);        
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve receber 400 ao buscar um usuário por e-mail inválido', async () => {       
        await sut.findByEmail({params: {email: "naocadastrado@gmail.com"}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    });

    it('Deve receber 500 de erro interno de servidor ao buscar por e-mail', async () =>{           
        jest.spyOn(service, 'findByEmail').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        await sut.findByEmail({params: {email: "no@ongames.com"}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber 200 ao solicitar o cadastros de todos os clientes', async () =>{
        await sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it('Deve retornar 500 ao listar todos os jogos com erro interno', async () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });


    it('Deve receber 200 ao buscar um usuário por id', async () => { 
        try{         
            await sut.findById({params: {id: 2}} as any, resp_spy as any);
            expect(resp_spy.status).toHaveBeenCalledWith(200);
        } catch (error) {
            console.log(error);
        }
    });

    it('Deve receber 400 ao buscar um usuário por id inválido ou inválido', async () => {        
        await sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);        
    });

    it('Deve receber 500 de erro interno de servidor ao buscar por id', async () =>{        
        jest.spyOn(service, 'findById').mockImplementation(() => {throw new Error("Erro interno de servidor")});
        await sut.findById({params: {id: 1}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });
});