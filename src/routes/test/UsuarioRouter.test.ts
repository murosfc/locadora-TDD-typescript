import request from "supertest";
import { testServer } from "../../server_test";

describe("Teste de integração do UsuarioRouter", () => {
    var server: any;

    beforeAll(async () => {
        server = testServer.init(3004);
    });

    afterAll(async () => {
        server.close();
    })

    it("POST /usuarios/add", async () => {
        const novoUsuario = {
            nome: "Felipe Muros",
            email: "felipe@gmail.com",
            senha: "123456",
            cpf: "12345678901",
        };
        const response = await request(server).post("/usuarios/add").send(novoUsuario);
        expect(response.status).toBe(201);
    });
    
    it("POST /usuarios/login e GET /usuarios/token", async () => {
        const usuario = {email: 'felipe@gmail.com', senha: '123456' };
        var response = await request(server).post("/usuarios/login").send(usuario);
        const token = response.body;        
        expect(response.status).toBe(200);
        response = await request(server).get("/usuarios/token").set('Authorization', token);
        expect(response.status).toBe(200);
    });

    it("PUT /usuarios/update/:id", async () => {
        const usuarioAtualizado = {
            nome: "Felipe C Muros",
            email: "felipe@gmail.com",
            senha: "123456",
            cpf: "12345678901",
        };
        const response = await request(server).put("/usuarios/update/1").send(usuarioAtualizado);
        expect(response.status).toBe(200);
    });

    it("GET /usuarios/", async () => {
        const response = await request(server).get("/usuarios/");
        expect(response.status).toBe(200);

    });

    it("GET /usuarios/:id", async () => {
        const response = await request(server).get("/usuarios/1");
        expect(response.status).toBe(200);

    });

    it("GET /usuarios/email/:email", async () => {
        const response = await request(server).get("/usuarios/email/felipe@gmail.com");
        expect(response.status).toBe(200);
    });

    it("GET /usuarios/cpf/:cpf", async () => {
        const response = await request(server).get("/usuarios/cpf/12345678901");
        expect(response.status).toBe(200);
    });

   

    it("DELETE /usuarios/delete/:id", async () => {
        const response = await request(server).delete("/usuarios/delete/1");
        expect(response.status).toBe(200);

    });
});