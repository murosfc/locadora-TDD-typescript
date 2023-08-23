import request from "supertest";

import server from "../../server";

describe("Testes de integração da rota de Plataformas", () => { 

    beforeAll(() => {
        server.close();
    });
    
    afterAll(() => {
        server.close();
    });

    it("GET /plataformas", async () => {
        const response = await request(server).get("/plataformas");        
        expect(response.status).toBe(200)               
    });

    it("POST /plataformas/add", async () => {        
        var response = await request(server).post("/plataformas/add").send({titulo: 'Nintendo Switch'});        
        expect(response.status).toBe(201);  
        response = await request(server).post("/plataformas/add").send({titulo: 'PS5'});        
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
        const response = await request(server).put("/plataformas/update/1").send({titulo: 'NSW'});        
        expect(response.status).toBe(200);        
    });

    it("DELETE /plataformas/delete/:id", async () => {
        const response = await request(server).delete("/plataformas/delete/1");        
        expect(response.status).toBe(200);        
    });    
});
