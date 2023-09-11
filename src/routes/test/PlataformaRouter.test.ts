import request from "supertest";
import { testServer } from "../../server_test";

import { UsuarioDTO, UsuarioService } from "../../service/UsuarioService";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioTipoEnum } from "../../model/enum/UsuarioTipoEnum";

async function getAdmToken(){
    const userSerice = new UsuarioService(UsuarioRepository.getInstance());
    const userDTO = new UsuarioDTO('Felipe', 'felipe@gmail.com', '123456', '12345678999'); 
    userDTO.tipo = UsuarioTipoEnum.ADMINISTRADOR;      
    const savedUser = await userSerice.save(userDTO);  
    const token = (await userSerice.login(userDTO.email, userDTO.senha)).token;      
    return token;
}


describe("Testes de integração da rota de Plataformas", () => {
    var server: any;
    var header = {authorization: ""};

    beforeAll(async () => {
        server = testServer.init(3001);
        header.authorization = await getAdmToken();
    });
    
    afterAll(async () => {
        server.close();
    })

    it("GET /plataformas", async () => {
        const response = await request(server).get("/plataformas");
        expect(response.status).toBe(200)
    });

    it("POST /plataformas/add", async () => {
        var response = await request(server).post("/plataformas/add").send({ titulo: 'Nintendo Switch' }).set(header);
        expect(response.status).toBe(201);
        response = await request(server).post("/plataformas/add").send({ titulo: 'PS5' }).set(header);
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
        const response = await request(server).put("/plataformas/update/1").send({ titulo: 'NSW' }).set(header);
        expect(response.status).toBe(200);
    });

    it("DELETE /plataformas/delete/:id", async () => {
        const response = await request(server).delete("/plataformas/delete/1").set(header);
        expect(response.status).toBe(200);
    });
});
