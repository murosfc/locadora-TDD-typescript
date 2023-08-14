import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { Conta } from "../Conta";
import { Jogo } from "../Jogo";
import { Plataforma } from "../Plataforma";

describe('Conta', () => {
    const plataforma1 = new Plataforma("PS5");
    const plataforma2 = new Plataforma("XBOX");
    const jogo1 = new Jogo("Fifa 203", [plataforma1, plataforma2], 20,"");
    const jogo2 = new Jogo("Call of Duty", [plataforma1, plataforma2], 10,"");

    it('Deve criar uma conta com email e senha', () => {
        const sut = new Conta('conta1@ongames.com', '123456', [jogo1, jogo2]);
        expect(sut.email).toBe('conta1@ongames.com');
        expect(sut.senha).toBe('123456');
        expect(sut.jogos).toEqual([jogo1, jogo2]);
    });

    it('Deve criar uma conta sem jogos', () => {
        const sut = new Conta('conta2@ongames.com', '123456');
        expect(sut.email).toBe('conta2@ongames.com');
        expect(sut.senha).toBe('123456');
        expect(sut.jogos).toEqual([]);
    });

    it('Deve lançar exceção do tipo InvalidAttributeException ao criar uma conta sem email', () => {
        expect(() => new Conta('', '123456')).toThrowError('Email inválido');
        expect(() => new Conta('', '123456')).toThrowError(InvalidAttributeException);
    });

    it('Deve lançar exceção do tipo InvalidAttributeException ao criar uma conta sem senha', () => {
        expect(() => new Conta('conta3@gmail.com', '')).toThrowError('Senha inválida');
        expect(() => new Conta('conta3@gmail.com', '')).toThrowError(InvalidAttributeException);
    });

    it('Setters devem alterar os valores dos atributos e getters devem confirmar alterações', () => {
        const sut = new Conta('conta2@ongames.com', '123456');
        sut.email = 'conta3@gmail.com';
        sut.senha = '1234567';
        sut.jogos = [jogo1];
        sut.id = 5;
        expect(sut.email).toBe('conta3@gmail.com');
        expect(sut.senha).toBe('1234567');
        expect(sut.jogos).toEqual([jogo1]);        
        expect(sut.id).toBe(5);
    });
});