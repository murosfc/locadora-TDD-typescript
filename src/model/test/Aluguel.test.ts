import exp from "constants";
import { Aluguel } from "../Aluguel";
import { Conta } from "../Conta";
import { Jogo } from "../Jogo";
import { Plataforma } from "../Plataforma";
import { Usuario } from "../Usuario";

describe('Aluguel', () => {
    const usuario = new Usuario('João', 'joao@gmail.com', '123456', '12345678910');
    const plataforma = new Plataforma('PS5');
    const jogo = new Jogo('God of War', plataforma, 20, '');    
    const conta = new Conta('conta01@ongames.com', '123456', [jogo]);
    var sut: Aluguel;
    
    it('Deve criar um aluguel', () => {
        sut = new Aluguel(usuario, [conta], 2, 0 );        
        expect(sut).not.toBe(undefined);       
    });

    it('Valor do aluguel deve ser igual a 40 (2 períodos * 20 reais)', () => {              
        expect(sut.valorTotal).toBe(40);       
    });

    it('Data final do aluguel deve ser igual a 14 dias após a data de aluguel', () => {             
        expect(sut.dataFinal.getDate() +sut.dataFinal.getMonth() + sut.dataFinal.getFullYear()).toBe((sut.dataAluguel.getDate() + 14) + sut.dataAluguel.getMonth() + sut.dataAluguel.getFullYear());       
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
        expect(new Date(sut.dataFinal)).toBe(dataFinalEsperada);
    });
})