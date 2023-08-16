import { Jogo } from '../Jogo';
import { PlataformaDTO } from '../../service/PlataformaService';
import { NotAllowedException } from '../../error/NotAllowedException';
import { InvalidTitleException } from '../../error/InvalidTitleException';
import { Plataforma } from '../Plataforma';
import { mock } from 'node:test';


const IMG_GOF_URL = "https://sm.ign.com/t/ign_br/screenshot/default/19149244-1095370340596272-3579967127407830234-n-1_5m3p.960.jpg";
const PLAT_PS4 = new PlataformaDTO('PS4');
const PLAT_PS5 = new PlataformaDTO('PS5');
const PLAT_XBOX = new PlataformaDTO('XBOX');
const PLAT_NSWITCH = new PlataformaDTO('NINTENDO SWITCH');
const PLAT_PC = new PlataformaDTO('PC');
var jogoGof: Jogo;

describe('Testes da endidade Jogo', () => {
    it('Deve Criar jogo com id undefined', () => {    
    jogoGof = new Jogo('God of War', PlataformaDTO.dtoToPlataforma(PLAT_PS5), 15, IMG_GOF_URL);
    expect(jogoGof.titulo).toBe('God of War');    
    expect(jogoGof.plataforma.titulo).toBe('PS5');
    expect(jogoGof.valor).toBe(15);
    expect(jogoGof.urlImagem).toBe(IMG_GOF_URL);
    expect(jogoGof.id).toBeUndefined(); //id é undefined pois ainda não foi salvo no repositório
    })

    it('Deve atribuir id 1 a um jogo e obter a mesma', () => {
        jogoGof.id = 1;
        expect(jogoGof.id).toBe(1);
    })

    it('Deve colocar a imgagem padrão quando url da imagem for vazia', () => {
        const jogo = new Jogo('God of War', PlataformaDTO.dtoToPlataforma(PLAT_PS4), 15, "");
        expect(jogo.urlImagem).toBe(jogo.DEFAULT_IMAGE_URL);
    })
    it('Deve gerar erro do tipo InvalidTitleException ao tentar criar um jogo com título inválido', () => {
        expect(() => new Jogo('', PlataformaDTO.dtoToPlataforma(PLAT_PS4), 15, "")).toThrowError('Título inválido');
        expect(() => new Jogo('', PlataformaDTO.dtoToPlataforma(PLAT_PS4), 15, "")).toThrowError(InvalidTitleException);
    })

    it('Deve gerar erro do tipo NotAllowedException ao tentar criar um jogo com valor negativo', () => {
        expect(() => new Jogo('God of War', PlataformaDTO.dtoToPlataforma(PLAT_PS4), -15, "")).toThrowError('Valor deve ser maior que zero');
        expect(() => new Jogo('God of War', PlataformaDTO.dtoToPlataforma(PLAT_PS4), -15, "")).toThrowError(NotAllowedException);
    })

    it('Deve gerar erro do tipo NotAllowedException ao tentar criar um jogo sem plataforma', () => {        
        const fakePlataforma = undefined as unknown as Plataforma;
        expect(() => new Jogo('God of War',fakePlataforma, 15, "")).toThrowError('Necessário vincular uma plataforma');
        expect(() => new Jogo('God of War', fakePlataforma, 15, "")).toThrowError(NotAllowedException);
    })
})


