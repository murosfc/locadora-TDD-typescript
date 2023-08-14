import { Plataforma } from "../../model/Plataforma";
import { Conta } from "../../model/Conta";
import { ContaRepository } from "../InMemoryRepository/ContaRepository";
import { Jogo } from "../../model/Jogo";
import { DomainError } from "../../error/DomainError";

describe('ContaRepository', () => {
    const sut = ContaRepository.getInstance();
    const plataforma1 = new Plataforma("PS5");
    const plataforma2 = new Plataforma("XBOX");
    const jogo1 = new Jogo("Fifa 203", [plataforma1, plataforma2], 20,"");
    const jogo2 = new Jogo("Call of Duty", [plataforma1, plataforma2], 10,"");

    it('Deve salvar uma conta no repositório', () => {
        var conta = new Conta("conta01@ongames.com", "123456", [jogo1]);
        var savedConta = sut.save(conta) as Conta;
        expect(savedConta.id === 1);
        conta = new Conta("conta02@ongames.com", "654312", [jogo2]);
        var savedConta = sut.save(conta) as Conta;
        expect(savedConta.id === 2);
    });

    it('Deve atualizar uma conta no repositório', () => {
        const conta = new Conta("conta01@ongames.com", "123456", [jogo1]);
        conta.senha = "654321";
        conta.id = 1;
        const  updatedConta = sut.update(conta) as Conta;
        expect(updatedConta.senha === "654321");
    });

    it('Deve receber um erro do tipo NotAllowedException ao tentar atualizar uma conta com um e-mail já cadastrado', () => {
        const conta = new Conta("conta02@ongames.com", "123456", [jogo1]);
        conta.id = 1;
        const updatedConta = sut.update(conta);
        expect(updatedConta instanceof DomainError);
        expect((updatedConta as DomainError).message === "novo e-mail informado já cadastrado em outra conta");
    });

    it('Deve receber true ao deletar um usuário existente', () => {
        expect(sut.delete(1)).toBeTruthy();
    });

    it('Deve receber false ao deletar um usuário inexistente', () => {
        expect(sut.delete(1)).toBeFalsy();
        expect(sut.delete(0)).toBeFalsy();
    });

    it('Deve receber uma conta ao buscar por e-mail', () => {
        const conta = sut.findByEmail("conta02@ongames.com") as Conta;
        expect(conta.id).toBe(2);        
    });

    it('Deve receber um erro do tipo NotFoundException ao buscar por e-mail inexistente', () => {
        const conta = sut.findByEmail("naocadastrado@ongames.com");
        expect(conta instanceof DomainError);
        expect((conta as DomainError).message === "conta não encontrada");        
    });

    it('Deve encontrar contas por jogo', () => {    
        var contas = sut.findByJogo(jogo1);
        expect(contas.length === 1);
        contas = sut.findByJogo(jogo2);
        expect(contas.length === 0);
    });

    it('Deve encontrar todas as contas', () => {
        const contas = sut.findAll();
        expect(contas.length === 1);
    });

    it('Deve encontrar uma conta ao pesquisar por id', () => {        
        const conta = sut.findById(2) as Conta;
        expect(conta.id === 2);
    });


});