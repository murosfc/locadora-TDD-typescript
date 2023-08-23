import { AluguelRepository } from "../../repositories/InMemoryRepository/AluguelRepository";
import { AluguelService } from "../AluguelService";
import { Plataforma } from "../../model/Plataforma";
import { Jogo } from "../../model/Jogo";
import { Conta } from "../../model/Conta";
import { Aluguel } from "../../model/Aluguel";
import { Usuario } from "../../model/Usuario";
import { NotAllowedException } from "../../error/NotAllowedException";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { NotFoundException } from "../../error/NotFoundException";

describe("AluguelService", () => {
    const repo = AluguelRepository.getInstance();
    const sut= new AluguelService(repo);
    const plataforma = new Plataforma("PS5");
    const jogo = new Jogo("God of War", plataforma, 25, "");
    const jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "");
    const conta = new Conta("conta01@ongames.com", "123456", [jogo]);
    conta.id = 1; 
    const conta2 = new Conta("conta02@ongames.com", "123456", [jogo2]); 
    conta2.id = 2;
    const usuario = new Usuario("Felipe", "felipe@gmail.com", "123456", "11223445565");

    it("deve receber a instância do sut válida", () => {
        expect(sut).not.toBeUndefined();
    });

    it("deve salvar um aluguel", () => {
        var aluguel = new Aluguel(usuario, [conta], 1);
        var resultado = sut.save(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(1);
        aluguel = new Aluguel(usuario, [conta2], 1);
        resultado = sut.save(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(2);
    });

    it("deve gerar uma exceção do tipo InvalidAttributeException ao tentar salvar um aluguel sem contas", () => {   
        //mockar o construtor de aluguel e criar um aluguel sem contas para testar
        const fakeAluguel = jest.fn().mockImplementation(() => {
            return {
                usuario: usuario,
                contas: [],
                periodoEmSemanas: 1
            }
        }); 
        jest.mock('../../model/Aluguel', () => {
            return fakeAluguel;
        });              
        var resultado = sut.save(fakeAluguel());       
        expect(resultado).toBeInstanceOf(InvalidAttributeException);
        expect((resultado as Error).message).toBe("Conta não informada");
    });

    it("Deve gerar um erro do tipo NotAllowedException ao tentar atualizar um aluguel encerrado", () => {
        const serviceSpy = jest.spyOn(repo, "findById").mockReturnValue({id: 3, usuario: usuario, contas: [conta], periodoEmSemanas: 1, dataFinal: new Date("2023-08-21")});
        const aluguel = new Aluguel(usuario, [conta], 1);
        aluguel.id = 3;
        const resultado = sut.update(aluguel);
        expect(resultado).toBeInstanceOf(NotAllowedException);
        expect((resultado as Error).message).toBe("Não é possível alterar um aluguel encerrado");
        serviceSpy.mockRestore();
    });

    it("deve gerar uma exceção do tipo InvalidAttributeException ao tentar salvar um aluguel com período de aluguel inválido", () => {        
        const fakeAluguel = jest.fn().mockImplementation(() => {
            return {
                usuario: usuario,
                contas: [conta],
                periodoEmSemanas: 0
            }
        }); 
        jest.mock('../../model/Aluguel', () => {
            return fakeAluguel;
        });              
        var resultado = sut.save(fakeAluguel());       
        expect(resultado).toBeInstanceOf(InvalidAttributeException);
        expect((resultado as Error).message).toBe("Período de aluguel inválido");
    });

    it("deve gerar uma exceção do tipo InvalidAttributeException ao tentar salvar um aluguel sem usuário", () => {
        const fakeAluguel = jest.fn().mockImplementation(() => {
            return {
                usuario: null,
                contas: [conta],
                periodoEmSemanas: 1
            }
        }); 
        jest.mock('../../model/Aluguel', () => {
            return fakeAluguel;
        });              
        var resultado = sut.save(fakeAluguel());       
        expect(resultado).toBeInstanceOf(InvalidAttributeException);
        expect((resultado as Error).message).toBe("Usuário não informado");
        jest.unmock('../../model/Aluguel');
    });

    it("deve gerar uma exceção do tipo NotAllowedException ao tentar salvar um aluguel com uma conta que já está alugada", () => {       
        const aluguel = new Aluguel(usuario, [conta], 2);
        const resultado = sut.save(aluguel);
        expect(resultado).toBeInstanceOf(NotAllowedException);
        expect((resultado as Error).message).toBe("Conta informada já pertence a um aluguel ativo");
    });

    it("Deve atualizar um aluguel", () => { 
        const aluguel = new Aluguel(usuario, [conta], 2);
        aluguel.id = 1;
        const resultado = sut.update(aluguel);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(1);
        expect((resultado as Aluguel).periodoEmSemanas).toBe(2);
    });

    it('Dever retornar erro do tipo NotFonudException ao tentar atualizar um aluguel que não existe', () => {
        const aluguel = new Aluguel(usuario, [conta], 2);
        aluguel.id = 3;
        const resultado = sut.update(aluguel);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Aluguel não encontrado.");
    });

    it("Deve retornar um erro do tipo InvalidAttributeException ao tentar atualizar um aluguel com período inválido", () => {       
        const aluguel = new Aluguel(usuario, [conta], 1);
        aluguel.id = 1;
        const resultado = sut.update(aluguel);
        expect(resultado).toBeInstanceOf(InvalidAttributeException);
        expect((resultado as Error).message).toBe("Período de aluguel inválido");
    });

    it("Deve receber true ao deletar um aluguel com sucesso", () => {
        const resultado = sut.delete(1);
        expect(resultado).toBeTruthy();
    });

    it("Deve receber false ao tentar deletar um aluguel que não existe", () => {
        const resultado = sut.delete(32);
        expect(resultado).toBeFalsy();
    });

    it("Deve estender um aluguel", () => {       
        const aluguelId = 2;
        const resultado = sut.estenderAluguel(aluguelId, 1);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).periodoEmSemanas).toBe(2);
    });

    it("Deve retornar um erro do tipo InvalidAttributeException ao tentar estender um aluguel com período inválido", () => {
        const aluguelId = 2;
        const resultado = sut.estenderAluguel(aluguelId, 0);
        expect(resultado).toBeInstanceOf(InvalidAttributeException);
        expect((resultado as Error).message).toBe("Período de aluguel inválido");       
    });

    it("Deve receber um erro do tipo NotFoundException ao tentar estender um aluguel que não existe", () => {
        const aluguelId = 32;
        const resultado = sut.estenderAluguel(aluguelId, 1);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Aluguel não encontrado.");
    });

    it("Deve encontrar um aluguel por usuário", () => {
        const resultado = sut.findByUsuario(usuario.id);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBe(1);
        expect((resultado as Array<Aluguel>)[0].id).toBe(2);
    });

    it("Deve retornar um erro do tipo NotFoundException ao tentar encontrar um aluguel por usuário que não existe", () => {
        const resultado = sut.findByUsuario(32);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Usuário sem aluguel registrado.");   
    });

    it("Deve encontrar um aluguel por conta", () => {
        const resultado = sut.findByConta(conta2.id);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBe(1);
        expect((resultado as Array<Aluguel>)[0].id).toBe(2);
    });

    it("Deve retornar todos os alugueis", () => {
        const resultado = sut.findAll();
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBe(1);   
    });

    it("Deve encontrar um aluguel por range de datas", () => {
        const dataInicial = new Date("2023-01-01");
        const dataFinal = new Date(); 
        dataFinal.setDate(dataInicial.getDate() + 30);       
        const resultado = sut.findByDataAluguelRange(dataInicial, dataFinal);
        expect(resultado).toBeInstanceOf(Array);
        expect((resultado as Array<Aluguel>).length).toBe(1);
        expect((resultado as Array<Aluguel>)[0].id).toBe(2);
    });

    it("Deve encontrar um aluguel por id", () => {
        const resultado = sut.findById(2);
        expect(resultado).toBeInstanceOf(Aluguel);
        expect((resultado as Aluguel).id).toBe(2);
    });

    it("Deve retornar um erro do tipo NotFoundException ao tentar encontrar um aluguel por id que não existe", () => {
        const resultado = sut.findById(32);
        expect(resultado).toBeInstanceOf(NotFoundException);
        expect((resultado as Error).message).toBe("Aluguel não encontrado");
    });
    
});
