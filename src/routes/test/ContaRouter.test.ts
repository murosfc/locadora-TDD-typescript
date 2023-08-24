import request from "supertest";

import server from "../../server";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";
import { JogoRepository } from "../../repositories/InMemoryRepository/JogoRepository";
import { Jogo } from "../../model/Jogo";

describe("ContaRouter", () => {
    const plat = PlataformaRepository.getInstance().save(new Plataforma("PS5"));
    const jogo = JogoRepository.getInstance().save(new Jogo("God of War", plat, 25, "")) as Jogo;
    
    beforeAll(() => {
        server.close();
        server.listen(3003, () => {
            console.log(`Now running on port ${3003}`);
        });
    });

    afterAll(() => {
        server.close();
    });

    it("POST /contas/add", async () => {        
        const response = await request(server).post("/contas/add").send({ email: "conta01@ongames.com", senha: "123456", jogos: [jogo.id] });
        expect(response.status).toBe(201);
    });

    it("GET /contas/email/:email", async () => {
        const response = await request(server).get("/contas/email/" + "conta01@ongames.com");
        expect(response.status).toBe(200);
    });

    it("GET /contas/jogo/:id", async () => {
        const response = await request(server).get("/contas/jogo/" + jogo.id);
        expect(response.status).toBe(200);
    });

    it("GET /contas/", async () => {
        const response = await request(server).get("/contas/");
        expect(response.status).toBe(200);
    });

    it("GET /contas/:id", async () => {
        const response = await request(server).get("/contas/1");
        expect(response.status).toBe(200);
    });

    it("PUT /contas/update/:id", async () => {
        const response = await request(server).put("/contas/update/1").send({ email: "conta01@ongames.com", senha: "1234567", jogos: [jogo.id] });
        expect(response.status).toBe(200);
    });

    it("DELETE /contas/delete/:id", async () => {
        const response = await request(server).delete("/contas/delete/1");
        expect(response.status).toBe(200);
    });

});