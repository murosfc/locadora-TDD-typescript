import request from "supertest";
import { PlataformaRepository } from "../../repositories/InMemoryRepository/PlataformaRepository";
import { Plataforma } from "../../model/Plataforma";
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

const plat = PlataformaRepository.getInstance().save(new Plataforma('Nintendo Switch'));

describe("Testes de integração da rota de Jogos", () => { 
    var server: any;
    var header = {authorization: ""};

    beforeAll(async () => {
        server = testServer.init(3002);
        header.authorization = await getAdmToken();
    });
    
    afterAll(async () => {
        server.close();
    });

    it("POST /jogos/add", async () => {
        var response = await request(server).post("/jogos/add").send({titulo: 'Super Mario Odyssey', idPlataforma: plat.id, valor: 15, urlImagem: 'https://i.imgur.com/9DpTmRA.jpg'}).set(header);        
        expect(response.status).toBe(201);  
        response = await request(server).post("/jogos/add").send({titulo: 'The Legend of Zelda: Breath of the Wild',idPlataforma: plat.id, valor: 20, urlImagem: ''}).set(header);        
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
        const plataforma = {id: plat.id, nome: plat.titulo};
        const response = await request(server).put("/jogos/update/1").send({titulo: 'Super Mario Odyssey', plataforma: plataforma, valor: 20, urlImagem: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.0/c_scale,w_1100/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5'}).set(header);        
        expect(response.status).toBe(200);        
    });

    it("DELETE /jogos/delete/:id", async () => {
        const response = await request(server).delete("/jogos/delete/1").set(header);        
        expect(response.status).toBe(200);        
    });

});