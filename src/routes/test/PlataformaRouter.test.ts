import request from "supertest";

import app from "../../server";


afterAll(done => {  
    app.listen().close();   
    done();
  })

  beforeAll(done => {
    done();
    })

describe("Testes de integração da rota de Plataformas", () => {
    it("GET /plataformas", async () => {
        const response = await request(app).get("/plataformas");
        expect(response.status).toBe(200);
    });

    // it("POST /plataformas/add", async () => {
    //     const response = await request(app).post("/plataformas/add").send({
    //         body: {titulo: "PS5"},
    //     });
    //     expect(response.status).toBe(201);
    // });


});
