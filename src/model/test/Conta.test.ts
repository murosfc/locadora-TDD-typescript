import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { Conta } from "../Conta";
import { Jogo } from "../Jogo";
import { Plataforma } from "../Plataforma";

describe('Conta', () => {
    const plataforma1 = new Plataforma("PS5");
    const plataforma2 = new Plataforma("XBOX");
    const jogo1 = new Jogo("Fifa 203", plataforma1, 20,"");
    const jogo2 = new Jogo("Call of Duty", plataforma2, 10,"");

    it('Deve criar uma conta com email e senha', () => {
        const sut = new Conta('conta1@ongames.com', '123456', jogo1);
        expect(sut.email).toBe('conta1@ongames.com');
        expect(sut.senha).toBe('123456');
        expect(sut.jogo).toEqual(jogo1);
    });    

    it('Deve lançar exceção do tipo InvalidAttributeException ao criar uma conta sem email', () => {
        expect(() => new Conta('', '123456', jogo1)).toThrowError('Email inválido');
        expect(() => new Conta('', '123456', jogo1)).toThrowError(InvalidAttributeException);
    });

    it('Deve lançar exceção do tipo InvalidAttributeException ao criar uma conta sem jogo', () => {
        expect(() => new Conta('', '123456', undefined as unknown as Jogo)).toThrowError('Email inválido');
        expect(() => new Conta('', '123456', undefined as unknown as Jogo)).toThrowError(InvalidAttributeException);
    });

    it('Deve lançar exceção do tipo InvalidAttributeException ao criar uma conta sem senha', () => {
        expect(() => new Conta('conta3@gmail.com', '', jogo1)).toThrowError('Senha inválida');
        expect(() => new Conta('conta3@gmail.com', '', jogo1)).toThrowError(InvalidAttributeException);
    });

    it('Setters devem alterar os valores dos atributos e getters devem confirmar alterações', () => {
        const sut = new Conta('conta2@ongames.com', '123456', jogo1);
        sut.email = 'conta3@gmail.com';
        sut.senha = '1234567';
        sut.jogo = jogo2;
        sut.id = 5;
        sut.vezesAlugado = 1;
        expect(sut.email).toBe('conta3@gmail.com');
        expect(sut.senha).toBe('1234567');
        expect(sut.jogo).toEqual(jogo2);        
        expect(sut.id).toBe(5);
        expect(sut.vezesAlugado).toBe(1);
    });
});