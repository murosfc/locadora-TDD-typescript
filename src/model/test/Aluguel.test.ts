import exp from "constants";
import { Aluguel } from "../Aluguel";
import { Conta } from "../Conta";
import { Jogo } from "../Jogo";
import { Plataforma } from "../Plataforma";
import { Usuario } from "../Usuario";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";

describe('Aluguel', () => {
    const usuario = new Usuario('João', 'joao@gmail.com', '123456', '12345678910');
    const plataforma = new Plataforma('PS5');
    const jogo = new Jogo('God of War', plataforma, 20, '');    
    const conta = new Conta('conta01@ongames.com', '123456', jogo);
    var sut: Aluguel;
    
    it('Deve criar um aluguel', () => {
        sut = new Aluguel(usuario, [conta], 2, 0 );        
        expect(sut).not.toBe(undefined);       
    });

    it('Deve lançar erro tipo InvalidAttributeException ao tentar criar um aluguel usuário inválido', () => {     
        expect( () => new Aluguel(undefined as unknown as Usuario, [conta], 2, 0 )).toThrowError('Usuário inválido');
        expect( () => new Aluguel(undefined as unknown as Usuario, [conta], 2, 0 )).toThrowError(InvalidAttributeException);
    });

    it('Deve lançar erro tipo InvalidAttributeException ao tentar criar um aluguel sem contas', () => {        
        expect(() => new Aluguel(usuario, [], 2, 0 )).toThrowError('Necessário vincular pelo menos uma conta');
        expect(() => new Aluguel(usuario, [], 2, 0 )).toThrowError(InvalidAttributeException);
    });

    it('Deve lançar erro tipo InvalidAttributeException ao tentar criar um aluguel com período inválido', () => {
        expect(() => new Aluguel(usuario, [conta], 0, 0 )).toThrowError('Período inválido');
        expect(() => new Aluguel(usuario, [conta], 0, 0 )).toThrowError(InvalidAttributeException);
    });

    it('Valor do aluguel deve ser igual a 40 (2 períodos * 20 reais)', () => {   
        sut = new Aluguel(usuario, [conta], 2, 0 );              
        expect(sut.valorTotal).toBe(40);       
    });

    it('Data final do aluguel deve ser igual a 14 dias após a data de aluguel', () => { 
        let dataFinalEsperada = new Date();       
        dataFinalEsperada.setDate(dataFinalEsperada.getDate() + (sut.periodoEmSemanas * 7));
        dataFinalEsperada.setHours(23, 59, 59, 999);            
        expect(sut.dataFinal.toLocaleDateString).toBe(dataFinalEsperada.toLocaleDateString);
    });

    it('Valor do aluguel deve ser igual a 30 aplicando cupom de desconto de 10 reais', () => {
        sut = new Aluguel(usuario, [conta], 2, 10 );        
        expect(sut.valorTotal).toBe(30);       
    });

    it('Deve estender o aluguel em 2 períodos e atualizar valor total', () => {        
        sut = new Aluguel(usuario, [conta], 2, 0 );        
        sut.estenderAluguel(2);
        expect(sut.periodoEmSemanas).toBe(4);
        expect(sut.valorTotal).toBe(80);       
    } );
    
    it("Deve lançar erro tipo InvalidAttributeException ao tentar estender o aluguel em 0 períodos", () => {
        sut = new Aluguel(usuario, [conta], 2, 0 );
        expect(() => sut.estenderAluguel(0)).toThrowError('Período inválido');
        expect(() => sut.estenderAluguel(0)).toThrowError(InvalidAttributeException);
    });

    it('Getters devem retornar os valores de sut', () => {
        sut = new Aluguel(usuario, [conta], 2, 0 );   
        expect(sut.usuario).toBe(usuario);
        expect(sut.contas).toEqual([conta]);
        let today = new Date();
        expect(sut.dataAluguel.getDate() + sut.dataAluguel.getMonth() +sut.dataAluguel.getFullYear()).toBe(today.getDate() + today.getMonth() + today.getFullYear());
        expect(sut.periodoEmSemanas).toBe(2);
        expect(sut.desconto).toBe(0);
        expect(sut.valorTotal).toBe(40);      
        sut.estenderAluguel(2);        
        let dataFinalEsperada = new Date();       
        dataFinalEsperada.setDate(today.getDate() + (sut.periodoEmSemanas * 7));
        dataFinalEsperada.setHours(23, 59, 59, 999);        
        expect(sut.dataFinal.toLocaleDateString).toBe(dataFinalEsperada.toLocaleDateString);
    });
})