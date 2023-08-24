import request from "supertest";

import server from "../../server";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";

const plat = PlataformaRepository.getInstance().save(new Plataforma('Nintendo Switch'));
const jsonPlat = JSON.stringify(plat);

describe("Testes de integração da rota de Jogos", () => { 

    beforeAll(() => {
        server.close();
        server.listen(3002, () => {
            console.log(`Now running on port ${3002}`);
        });
    });
    
    afterAll(() => {
        server.close();
    });

    it("POST /jogos/add", async () => {
        var response = await request(server).post("/jogos/add").send({nome: 'Super Mario Odyssey', idPlataforma: plat.id, valor: 15, urlImagem: 'https://i.imgur.com/9DpTmRA.jpg'});        
        expect(response.status).toBe(201);  
        response = await request(server).post("/jogos/add").send({nome: 'The Legend of Zelda: Breath of the Wild',idPlataforma: plat.id, valor: 20, urlImagem: ''});        
        expect(response.status).toBe(201);       
    });

    it("GET /jogos", async () => {
        const response = await request(server).get("/jogos");        
        expect(response.status).toBe(200)               
    });

    it("GET /jogos/:id", async () => {
        const response = await request(server).get("/jogos/1");        
        expect(response.status).toBe(200);        
    });   

    it("GET /jogos/plataforma/:id", async () => {         
        const response = await request(server).get("/jogos/plataforma/"+ plat.id);        
        expect(response.status).toBe(200);        
    });

    it("GET /jogos/valores/:min/:max", async () => {
        const min = 10;
        const max = 20;
        const response = await request(server).get("/jogos/valores/"+min+"/"+max);        
        expect(response.status).toBe(200);        
    });

    it("PUT /jogos/update/:id", async () => {
        const response = await request(server).put("/jogos/update/1").send({nome: 'Super Mario Odyssey', plataforma: plat, preco: 20, urlImagem: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.0/c_scale,w_1100/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5'});        
        expect(response.status).toBe(200);        
    });

    it("DELETE /jogos/delete/:id", async () => {
        const response = await request(server).delete("/jogos/delete/1");        
        expect(response.status).toBe(200);        
    });

});