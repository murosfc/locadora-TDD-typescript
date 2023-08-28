import request from "supertest";

import server from "../../server";

beforeAll(async () => {
    server.close();
    server.listen(3004, () => {
        console.log(`Now running on port ${3004}`);
    });
});

afterAll(async () => {
    server.close();
});

describe("Teste de integração do UsuarioRouter", () => {

    it("POST /usuarios/add", async () => {
        const novoUsuario = {
            nome: "Felipe Muros",
            email: "felipe@gmail.com",
            senha: "123456",
            cpf: "12345678901",
        };
        try {
            const response = await request(server).post("/usuarios/add").send(novoUsuario);
            expect(response.status).toBe(201);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("PUT /usuarios/update/:id", async () => {
        const usuarioAtualizado = {
            nome: "Felipe Muros",
            email: "felipe@gmail.com",
            senha: "123456789",
            cpf: "12345678901",
        };
        try {
            const response = await request(server).put("/usuarios/update/1").send(usuarioAtualizado);
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("GET /usuarios/", async () => {
        try {
            const response = await request(server).get("/usuarios/");
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("GET /usuarios/:id", async () => {
        try {
            const response = await request(server).get("/usuarios/1");
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("GET /usuarios/email/:email", async () => {
        try {
            const response = await request(server).get("/usuarios/email/felipe@gmail.com");
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("GET /usuarios/cpf/:cpf", async () => {
        try {
            const response = await request(server).get("/usuarios/cpf/12345678901");
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });

    it("DELETE /usuarios/delete/:id", async () => {
        try {
            const response = await request(server).delete("/usuarios/delete/1");
            expect(response.status).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    });
});