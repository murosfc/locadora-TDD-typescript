import request from "supertest";
import { testServer } from "../../server_test";

describe("Testes de integração da rota de Plataformas", () => {
    var server: any;

    beforeAll(async () => {
        server = testServer.init(3001);
    });
    
    afterAll(async () => {
        server.close();
    })

    it("GET /plataformas", async () => {
        const response = await request(server).get("/plataformas");
        expect(response.status).toBe(200)
    });

    it("POST /plataformas/add", async () => {
        var response = await request(server).post("/plataformas/add").send({ titulo: 'Nintendo Switch' });
        expect(response.status).toBe(201);
        response = await request(server).post("/plataformas/add").send({ titulo: 'PS5' });
        expect(response.status).toBe(201);
    });

    it("GET /plataformas/:id", async () => {
        const response = await request(server).get("/plataformas/1");
        expect(response.status).toBe(200);
    });

    it("GET /plataformas/titulo/:titulo", async () => {
        const response = await request(server).get("/plataformas/titulo/PS5");
        expect(response.status).toBe(200);
    });

    it("PUT /plataformas/update/:id", async () => {
        const response = await request(server).put("/plataformas/update/1").send({ titulo: 'NSW' });
        expect(response.status).toBe(200);
    });

    it("DELETE /plataformas/delete/:id", async () => {
        const response = await request(server).delete("/plataformas/delete/1");
        expect(response.status).toBe(200);
    });
});
