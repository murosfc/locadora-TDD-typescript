import { PlataformaDTO } from "../../service/PlataformaService";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository"
import { JogoService } from "../../service/JogoService";
import { JogoController } from "../JogoController";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";

import { UsuarioDTO, UsuarioService } from "../../service/UsuarioService";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioTipoEnum } from "../../model/enum/UsuarioTipoEnum";
import { mock } from "node:test";

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

async function getAdmToken(){
    const userSerice = new UsuarioService(UsuarioRepository.getInstance());
    const userDTO = new UsuarioDTO('Felipe', 'felipe@gmail.com', '123456', '12345678999'); 
    userDTO.tipo = UsuarioTipoEnum.ADMINISTRADOR;      
    const savedUser = await userSerice.save(userDTO);  
    const token = (await userSerice.login(userDTO.email, userDTO.senha)).token;      
    return token;
}


describe('Testes do Controller para Jogos', () => {
    const {sut, service} = criaSut();
    const resp_spy = newSpy();
    var header = {authorization: ""};    
    
    beforeAll(async () => {
        header.authorization = await getAdmToken();
    });

    const PLAT_XBOX = PlataformaRepository.getInstance().save(new Plataforma("Xbox X/S"));   
    const PLAT_PS5 = PlataformaRepository.getInstance().save(new Plataforma("PS5"));   
    const PLAT_SWITCH = PlataformaRepository.getInstance().save(new Plataforma("Nintendo Switch"));    

    it("Deve retornar 201 ao cadastrar um Jogo", async () => {       
        const req = { body: { titulo: "Fifa 2023", idPlataforma: PLAT_PS5.id, valor: 15, urlImagem: ""}, headers: header};
        await sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(201);
    });

    it("Deve retornar 400 ao tentar cadastrar um Jogo com parâmetro inválido", async () => {
        var req = { body: { titulo: "", idPlataforma: PLAT_PS5.id, valor: 15, urlImagem: ""}, headers: header};
        await sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { titulo: "Zelda", idPlataforma: 0, valor: 15, urlImagem: ""}, headers: header};
        await sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        req = { body: { titulo: "Zelda", idPlataforma: PLAT_SWITCH.id, valor: -1, urlImagem: ""}, headers: header};
        await sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 ao listar todos os jogos", async () => {
       await sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it('Deve retornar 500 ao listar todos os jogos com erro interno', async () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findAll(resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        jest.spyOn(service, 'findAll').mockRestore();
    });

    it("Deve retornar 400 ao busca um jogo por valor em um range inválido", async () => {
        const req = {params: {min: 20, max: 10}};
        await sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 deletar um jogo", async () => {
        const req = {params: {id: 1}, headers: header};
        await sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 200 ao buscar jogo por id", async () => {
        const req = { params: { id: 1}};
        await sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao buscar jogo por id inválido", async () => {
        const req = { params: { id: 0}};
        await sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })    

    it("Deve retornar 200 ao atualizar um jogo", async () => {
        const req = { body: { titulo: "Fifa 2023", plataforma: PLAT_XBOX, valor: 20, urlImagem: ""}, params: {id: 1}, headers: header};
        await sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao atualizar um jogo com parâmetro inválido", async () => {
        const req = { body: { titulo: "", plataforma: PLAT_XBOX, valor: 20, urlImagem: ""}, params: {id: 1}, headers: header};
        await sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        const req2 = { body: { titulo: "Fifa 2023", plataforma: undefined, valor: 20, urlImagem: ""}, params: {id: 1}, headers: header};
        await sut.update(req2 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
        const req3 = { body: { titulo: "Fifa 2023", plataforma: PLAT_XBOX, valor: -1, urlImagem: ""}, params: {id: 1}, headers: header};
        await sut.update(req3 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it('Deve receber status 500 ao tentar atualizar um jogo com erro interno', async () => {
        const req = { body: { titulo: "Fifa 2023", plataformas: [PLAT_XBOX], valor: 20, urlImagem: ""}, params: {id: 1}, headers: header};
        jest.spyOn(service, 'update').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.update(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
        jest.clearAllMocks();
    });

    it("Deve retornar 200 ao buscar jogo por plataforma", async () => {        
        await sut.findByPlataforma({params: {id: PLAT_XBOX.id}}  as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })

    it("Deve retornar 400 ao buscar jogo por plataforma inválida", async () => {               
        await sut.findByPlataforma({params: {id: 21}} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })

    it("Deve retornar 200 ao busca um jogo por valor em um range válido", async () => {
        const req = {params: {min: 10, max: 30}};
        await sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(200);
    })
    
    it("Deve retornar 400 deletar um jogo com id inválido", async () => {
        const req = {params: {id: 0}, headers: header};
        await sut.delete(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(400);
    })    

    it('Deve receber status 500 ao tentar salvar um jogo com erro interno', async () => {
        const plataformas: PlataformaDTO[] = [PLAT_XBOX, PLAT_PS5, PLAT_SWITCH];
        const req = { body: { titulo: "Fifa 2023", plataformas: plataformas, valor: 15, urlImagem: ""}, headers: header};        
        jest.spyOn(service, 'save').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.save(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar jogo por id com erro interno', async () => {
        const req = { params: { id: 1}};
        jest.spyOn(service, 'findById').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findById(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });    

    it('Deve receber status 500 ao tentar buscar jogo por plataforma com erro interno', async () => {
        const json = JSON.stringify({titulo: 'Xbox X/S'});
        jest.spyOn(service, 'findByPlataforma').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findByPlataforma({body: json} as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve receber status 500 ao tentar buscar jogo por valor em um range com erro interno', async () => {
        const req = {params: {min: 10, max: 20}};
        jest.spyOn(service, 'findByRangeValor').mockImplementation(() => { throw new Error("Erro interno no servidor")});
        await sut.findByRangeValor(req as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(500);
    });

    it('Deve retornar 401 ao tentar salvar, editar e deletar um jogo sem permissão', async () => {
        const req = { body: { titulo: "Fifa 2023", idPlataforma: PLAT_PS5.id, valor: 15, urlImagem: ""}, headers:{authorization: "invalidToken"}};
        await sut.save(req as any, resp_spy as any);        
        expect(resp_spy.status).toHaveBeenCalledWith(401);
        const req2 = { body: { titulo: "Fifa 2023", plataforma: PLAT_XBOX, valor: 20, urlImagem: ""}, params: {id: 1}, headers:{authorization: "invalidToken"}};
        await sut.update(req2 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(401);
        const req3 = {params: {id: 1}, headers: {authorization: "invalidToken"}};
        await sut.delete(req3 as any, resp_spy as any);
        expect(resp_spy.status).toHaveBeenCalledWith(401);
    });
})
