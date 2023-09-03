import request from "supertest";

import server from "../../server";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository";
import { Jogo } from "../../model/Jogo";
import { ContaRepository } from "../../repositories/InMemoryRepository/ContaRepository";
import { Conta } from "../../model/Conta";
import { Usuario } from "../../model/Usuario";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { testServer } from "../../server_test";

describe("Testes de integração da rota AluguelRouter", () => {
    var server: any;

    beforeAll(async () => {
        server = testServer.init(3005);
    });
    
    afterAll(async () => {
        server.close();
    });

    const plat = PlataformaRepository.getInstance().save(new Plataforma("PS4"));
    const jogo = JogoRepository.getInstance().save(new Jogo("God of War: Ghost of Sparta ", plat, 10, "")) as Jogo;
    const conta = ContaRepository.getInstance().save(new Conta("conta05@ongames.com", "123456", [jogo])) as Conta;
    const usuario = UsuarioRepository.getInstance().save(new Usuario ("Usuario 01", "user1@gmail.com", "123456", "12345678901"));

    it("POST /alugueis/add", async () => {
        const response = await request(server).post("/alugueis/add").send({idUsuario: usuario.id, contas: [conta.id], periodoEmSemanas: 1, desconto: 0});
        expect(response.status).toBe(201);
    });

    it("GET /alugueis/:id", async () => {
        const response = await request(server).get("/alugueis/1");
        expect(response.status).toBe(200);
    });

    it("PUT /alugueis/estender/:id", async () => {
        const response = await request(server).put("/alugueis/estender/1").send({periodoEmSemanas: 1});
        expect(response.status).toBe(200);
    });

    it("GET /alugueis/usuario/:idUsuario", async () => {
        const response = await request(server).get("/alugueis/usuario/1");
        expect(response.status).toBe(200);
    });

    it("GET /alugueis/conta/:idConta", async () => {
        const response = await request(server).get("/alugueis/conta/"+conta.id);
        expect(response.status).toBe(200);
    });

    it("GET /alugueis/dataAluguel/:dataInicial/:dataFinal", async () => {
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const anoQueVem = new Date();
        anoQueVem.setDate(anoQueVem.getDate() + 365);
        const response = await request(server).get(`/alugueis/dataAluguel/${ontem.toISOString()}/${anoQueVem.toISOString()}`);
        expect(response.status).toBe(200);
    });

    it("GET /alugueis/", async () => {
        const response = await request(server).get("/alugueis/");
        expect(response.status).toBe(200);
    });

    it("PUT /alugueis/update/:id", async () => {
        const response = await request(server).put("/alugueis/update/1").send({idUsuario: usuario.id, contas: [conta.id], periodoEmSemanas: 3, desconto: 0});
        expect(response.status).toBe(200);
    });
    
    it("DELETE /alugueis/delete/:id", async () => {
        const response = await request(server).delete("/alugueis/delete/1");
        expect(response.status).toBe(204);
    });

});
