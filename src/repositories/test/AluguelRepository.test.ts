import { Usuario } from "../../model/Usuario";
import { AluguelRepository } from "../InMemoryRepository/AluguelRepository";
import { AluguelRepositoryInterface } from "../contracts/AluguelRepositoryInterface";
import { Plataforma } from "../../model/Plataforma";
import { Conta } from "../../model/Conta";
import { Jogo } from "../../model/Jogo";
import { Aluguel } from "../../model/Aluguel";
import { NotFoundException } from "../../error/NotFoundException";
import { CrudException } from "../../error/CrudException";

describe("AluguelRepository", () => {
    var sut: AluguelRepositoryInterface;
    const usuario = new Usuario("Felipe", "muros@yahoo.com.br", "123456", "11223445565");
    const plataforma = new Plataforma("PS5");
    const jogo = new Jogo("God of War", plataforma, 25, "");
    const conta = new Conta("conta01@ongames.com", "123456", jogo); 
    conta.id = 1;  

    it("deve receber a instância do sut válida", () => {
        sut = AluguelRepository.getInstance();
        expect(sut).not.toBeUndefined();
    });

    it("deve salvar um aluguel", () => {
        var aluguel = new Aluguel(usuario, [conta], 1);
        var resultado = sut.save(aluguel);
        expect(resultado).toBe(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(1);
        aluguel = new Aluguel(usuario, [conta], 2);
        resultado = sut.save(aluguel);
        expect(resultado).toBe(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(2);
    }); 

    it("deve atualizar um aluguel", () => {
        const aluguel = new Aluguel(usuario, [conta], 2);
        aluguel.id = 1;
        const resultado = sut.update(aluguel);
        expect(resultado).toBe(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).periodoEmSemanas).toBe(2);
    });

    it("Deve encontrar ao menos um aluguel por range de data", () => {
        const anoPassado = new Date();
        anoPassado.setFullYear(anoPassado.getFullYear() - 1);
        const anoQueVem = new Date(); 
        anoQueVem.setFullYear(anoQueVem.getFullYear() + 1);      
        const resultado = sut.findByDataAluguelRange(anoPassado, anoQueVem);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBeGreaterThan(0);
    });

    it("Deve retornar um erro do tipo NotFoundException ao buscar um aluguel por range de data que não constem alugueis", () => {
        const anoPassado = new Date();
        anoPassado.setFullYear(anoPassado.getFullYear() - 1); 
        const mesPassado = new Date();
        mesPassado.setMonth(mesPassado.getMonth() - 1);   
        const resultado = sut.findByDataAluguelRange(anoPassado, mesPassado);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Não econtrado aluguel para o período informado.");
    });
    
    it("deve deletar um aluguel", () => {        
        const aluguelId = 1;
        const resultado = sut.delete(aluguelId);        
        expect(resultado).toBeTruthy;
    });

    it("Deve retornar false ao deletar um aluguel não existente no repositório", () => {   
        var resultado = sut.delete(1);        
        expect(resultado).toBeFalsy;
        resultado = sut.delete(10);        
        expect(resultado).toBeFalsy;
        resultado = sut.delete(0);        
        expect(resultado).toBeFalsy;
    });

    it("Deve estender um aluguel", () => {
        const aluguelId = 2;
        const resultado = sut.estenderAluguel(aluguelId, 1);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).periodoEmSemanas).toBe(3);
    });  

    it("Deve encontrar ao menos um aluguel por usuário", () => {
        const resultado = sut.findByUsuario(usuario.id);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBeGreaterThan(0);
    });

    it("Deve retornar um erro do tipo NotFoundException ao buscar um aluguel por usuário não cadastrado", () => {
        const resultado = sut.findByUsuario(10);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Usuário sem aluguel registrado.");
    });

    it("Deve encontrar ao menos um aluguel por conta", () => {
        const resultado = sut.findByConta(conta.id);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBeGreaterThan(0);
    });

    it("Deve retornar um erro do tipo NotFoundException ao buscar um aluguel por conta não cadastrada", () => {
        const resultado = sut.findByConta(10);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Não econtrado aluguel para a conta informada.");
    });
    

    it("Deve retornar todos os alugueis", () => {
        const resultado = sut.findAll();
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBeGreaterThan(0);
    });

    it("Deve encontrar um aluguel por id", () => {
        const resultado = sut.findById(2);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(2);
    });

    it("Deve retornar um erro do tipo NotFoundException ao buscar um aluguel por id não cadastrado", () => {
        const resultado = sut.findById(10);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Aluguel não encontrado.");
    });

    it("deve retornar se uma conta está ou não disponível para aluguel", () => {
        var resultado = sut.isContaAvailable(conta.id);
        expect(resultado).toBeFalsy();
        resultado = sut.isContaAvailable(10);
        expect(resultado).toBeTruthy();
    });

});