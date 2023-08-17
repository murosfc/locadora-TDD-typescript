import { Plataforma } from "../../model/Plataforma";
import { ContaRepository } from "../../repositories/InMemoryRepository/ContaRepository";
import { ContaDTO, ContaService } from "../ContaService";
import { Jogo } from "../../model/Jogo";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { NotAllowedException } from "../../error/NotAllowedException";

function setIdJogo(jogo1: Jogo, jogo2: Jogo){
    jogo1.id = 1;
    jogo2.id = 2;    
}

describe('ContaService', () => {
    const repo = ContaRepository.getInstance();
    const sut = new ContaService(repo);
    const plataforma1 = new Plataforma("PS5");
    const plataforma2 = new Plataforma("XBOX");
    const jogo1 = new Jogo("Fifa 203", plataforma1, 20,"") as Jogo;
    const jogo2 = new Jogo("Call of Duty", plataforma2, 10,"") as Jogo;
    setIdJogo(jogo1, jogo2);
    
    it('Deve salvar uma conta com sucesso', () => {
        var conta = new ContaDTO("conta01@ongames.com", "123456", [jogo1]);
        var savedConta = sut.save(conta) as ContaDTO;
        expect(savedConta.id === 1);
        conta = new ContaDTO("conta02@ongames.com", "123456", [jogo2]);
        savedConta = sut.save(conta) as ContaDTO;
        expect(savedConta.id === 2);
    });

    it('Deve gerar uma exceção do tipo IvalidAttibuteException ao tentar salvar uma conta com e-mail inválido', () => {
        var conta = new ContaDTO("", "56505605", [jogo1,jogo2]);
        var savedConta = sut.save(conta);   
        expect(savedConta instanceof InvalidAttributeException);
        expect((savedConta as Error).message === "Você está tentando salvar uma conta com email inválido.");
    });

    it('Deve gerar uma exceção do tipo IvalidAttibuteException ao tentar salvar uma conta com senha inválida', () => {
        var conta = new ContaDTO("conta03@ongames.com", "", [jogo1,jogo2]);
        var savedConta = sut.save(conta);   
        expect(savedConta instanceof InvalidAttributeException);
        expect((savedConta as Error).message === "Você está tentando salvar uma conta com senha inválida.");
    });

    it('Deve gerar uma exceção do tipo NotAllowedExecption ao tentar salvar uma conta com id', () => {
        const conta = new ContaDTO("conta03@ongames.com", "asdasd", [jogo1,jogo2]);
        conta.id = 5;
        const savedConta = sut.save(conta);
        expect(savedConta instanceof InvalidAttributeException);
        expect((savedConta as Error).message === "Você está tentando salvar uma conta com id já existente.");
    });

    it('Deve atualizar uma conta com sucesso', () => {
        const conta = new ContaDTO("conta01@ongames.com", "905608746", [jogo1, jogo2]);
        conta.id = 1; 
        const updatedConta = sut.update(conta) as ContaDTO;       
        expect(updatedConta.senha).toBe("informação ocultada");
        expect(updatedConta.jogos.length === 2);
    });

    it('Deve gerar uma exceção do tipo IvalidAttibuteException ao tentar atualizar uma conta com e-mail inválido', () => {
        var conta = new ContaDTO("", "56505605", [jogo1,jogo2]);
        conta.id = 1; 
        var updatedConta = sut.update(conta);   
        expect(updatedConta instanceof InvalidAttributeException);
        expect((updatedConta as Error).message).toBe("Você está tentando atualizar uma conta com email inválido.");
    });

    it('Deve gerar uma exceção do tipo IvalidAttibuteException ao tentar atualizar uma conta com senha inválida', () => {
        const conta = new ContaDTO("conta01@ongames.com", "", [jogo1, jogo2]);
        conta.id = 1; 
        const updatedConta = sut.update(conta);  
        expect(updatedConta instanceof InvalidAttributeException);
        expect((updatedConta as Error).message).toBe("Você está tentando atualizar uma conta com senha inválida.");
    });

    it('Deve gerar uma exceção do tipo NotAllowedExecption ao tentar atualizar uma conta com id inexistente', () => {
        const conta = new ContaDTO("conta01@ongames.com", "654893216", [jogo1, jogo2]);
        conta.id = -1;        
        const updatedConta = sut.update(conta);
        expect(updatedConta instanceof NotAllowedException);
        expect((updatedConta as Error).message).toBe("Conta não existe, portanto não pode ser atualizada.");
    });

    it('Deve retornar true ao excluir uma conta com sucesso', () => {
        const deletedConta = sut.delete(1);
        expect(deletedConta).toBe(true);
    });

    it('Deve retornar false ao tentar excluir uma conta inexistente', () => {
        const deletedConta = sut.delete(1);
        expect(deletedConta).toBe(false);
    });

    it('Deve retornar uma conta buscada por e-mail', () => {
        const conta = sut.findByEmail("conta02@ongames.com") as ContaDTO;
        expect(conta.email).toBe("conta02@ongames.com");
    });

    it('Deve retornar um erro do tipo NotFoundException ao buscar uma conta por e-mail inexistente', () => {
        const conta = sut.findByEmail("noregistered@ongames.com");
        expect(conta instanceof NotAllowedException);
        expect((conta as Error).message).toBe("Conta não encontrada com o e-mail informado.");
    });

    it('Deve encontrar pelo menos uma conta por jogo', () => {
        const contas = sut.findByJogo(jogo1.id);        
        expect(contas !instanceof Error);
    });

    it('Deve retornar uma lista vazia ao buscar conta por jogo inexistente', () => {
        const contas = sut.findByJogo(5);
        expect(contas !instanceof Error);
    });

    it('Deve retornar uma lista de contas', () => {
        const contas = sut.findAll();
        expect(contas.length).toBe(1);
    });

    it('Deve encontrar uma conta por id', () => {
        const conta = sut.findById(2);
        expect((conta as ContaDTO).id).toBe(2);
    });

    it('Deve retornar um erro do tipo NotFoundException ao buscar uma conta por id inexistente', () => {
        const conta = sut.findById(100);
        expect(conta instanceof NotAllowedException);
        expect((conta as Error).message).toBe("Conta não encontrada com o id informado.");
    });


});

