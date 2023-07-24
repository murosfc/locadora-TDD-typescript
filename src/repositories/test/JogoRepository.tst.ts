import { Plataforma } from "src/model/Plataforma";
import { JogoRepository } from "../InMemoryRepository/JogoRepository";
import { JogoRepositoryInterface } from "../contracts/JogoRepositoryInterface";

describe("Teste do JogoRepository", () => {
    var sut: JogoRepositoryInterface;

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
            plataformas: [
                {
                    new Plataforma('XBOX ONE')
                }
            ]
        };
        const jogoSalvo = sut.save(jogo);
        expect(jogoSalvo).not.toBeNull();
        expect(jogoSalvo).not.toBeUndefined();
        expect(jogoSalvo).toBeInstanceOf(Object);
        expect(jogoSalvo).toHaveProperty('id');
        expect(jogoSalvo).toHaveProperty('titulo', jogo.titulo);
        expect(jogoSalvo).toHaveProperty('valor', jogo.valor);
        expect(jogoSalvo).toHaveProperty('plataformas', jogo.plataformas);
    });
});