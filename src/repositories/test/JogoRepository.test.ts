import { Jogo } from "../../model/Jogo";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { Plataforma } from "../../model/Plataforma";
import { JogoRepository } from "../InMemoryRepository/JogoRepository";
import { JogoRepositoryInterface } from "../contracts/JogoRepositoryInterface";

describe("Teste do JogoRepository", () => {
    var sut: JogoRepositoryInterface;
    const platXBOX = new Plataforma('XBOX ONE');  
    platXBOX.id = 1;
    const platPS5 = new Plataforma('PS5');
    platPS5.id = 2;

    it('Deve obter a instância única do repositório', () => {
        sut = JogoRepository.getInstance();
        expect(sut).not.toBeNull();
        expect(sut).not.toBeUndefined();
        expect(sut).toBeInstanceOf(JogoRepository);
    });   

    it('Deve adicionar um jogo no repositório', () => {        
        const jogo = {
            titulo: 'Jogo 1',
            valor: 100,
            plataforma: platPS5
        };
        const jogoSalvo = sut.save(jogo);
        expect(jogoSalvo).not.toBeNull();
        expect(jogoSalvo).not.toBeUndefined();
        expect(jogoSalvo).toBeInstanceOf(Object);
        expect(jogoSalvo).toHaveProperty('id');
        expect(jogoSalvo).toHaveProperty('titulo', jogo.titulo);
        expect(jogoSalvo).toHaveProperty('valor', jogo.valor);
        expect(jogoSalvo).toHaveProperty('plataforma', jogo.plataforma);
    });

    it('Deve gerar exceção do tipo InvalidAttributeException ao tentar adicionar um jogo com título duplicado', () => {
        const jogo = new Jogo('Jogo 1', platXBOX, 100, "");         
        expect(() => sut.save(jogo)).toThrowError('Jogo já cadastrado');
        expect(() => sut.save(jogo)).toThrowError(InvalidAttributeException);
    });

    it('Deve atualizar um jogo no repositório', () => {
        var jogo = new Jogo('Jogo 1', platXBOX, 50, "www.fifa.com/fifa21.png");    
        jogo.id = 1;
        const jogoAtualizado = sut.update(jogo);
        expect(jogoAtualizado).not.toBeNull();
        expect(jogoAtualizado).not.toBeUndefined();
        expect(jogoAtualizado).toBeInstanceOf(Object);
        expect(jogoAtualizado).toHaveProperty('id');
        expect(jogoAtualizado).toHaveProperty('titulo', jogo.titulo);
        expect(jogoAtualizado).toHaveProperty('valor', jogo.valor);
        expect(jogoAtualizado).toHaveProperty('plataforma', jogo.plataforma);
    });
    
    it('Deve gerar exceção do tipo InvalidAttributeException ao tentar atualizar um jogo com título duplicado', () => {
        const jogo = new Jogo('Jogo 2', platPS5, 100, "");     
        var jogoSalvo = sut.save(jogo) as Jogo;
        jogoSalvo.titulo = 'Jogo 1';
        expect(() => sut.update(jogo)).toThrowError('Novo título informado já cadastrado');
        expect(() => sut.update(jogo)).toThrowError(InvalidAttributeException);
    });
    
    it('Deve deletar um jogo no repositório', () => {
        expect(sut.delete(1)).toBe(true);
    });

    it('Dever retornar false ao tentar deletar um jogo inexistente', () => {
        expect(sut.delete(0)).toBe(false);
    });

    it('Deve retornar um jogo ao buscar por id', () => {
        const jogo = sut.findById(1);
        expect(jogo).not.toBeNull();
        expect(jogo).not.toBeUndefined();
        expect(jogo).toBeInstanceOf(Object);
        expect(jogo).toHaveProperty('id');
    });

    it('Deve encontrar um jogo ao buscar por título', () => {
        const jogo = sut.findByTitulo('Jogo 1');
        expect(jogo).not.toBeNull();
        expect(jogo).not.toBeUndefined();
        expect(jogo).toBeInstanceOf(Object);
        expect(jogo).toHaveProperty('id');
    });

    it('Deve encontrar jogos ao buscar por plataforma', () => {
        const jogos = sut.findByPlataforma(platPS5.id);
        expect(jogos).not.toBeNull();
        expect(jogos).not.toBeUndefined();
        expect(jogos).toBeInstanceOf(Array);
    });

    it('Deve retornar um jogo por range de preço', () => {
        const jogos = sut.findByRangeValor(0, 100);
        expect(jogos).not.toBeNull();
        expect(jogos).not.toBeUndefined();
        expect(jogos).toBeInstanceOf(Array);
        expect(jogos.length).toBeGreaterThan(0);
    });

    it('Deve retornar todos os jogos cadastrados', () => {
        const jogos = sut.findAll();
        expect(jogos).not.toBeNull();
        expect(jogos).not.toBeUndefined();
        expect(jogos).toBeInstanceOf(Array);
        expect(jogos.length).toBeGreaterThan(0);
    });

});