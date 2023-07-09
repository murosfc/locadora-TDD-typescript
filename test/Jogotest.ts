import { JogoRepo } from '../src/repositories/InMemoryRepository/JogoRepo';
import { JogoService } from '../src/service/JogoService';
import { Jogo } from '../src/model/Jogo';
import { Plataforma } from '../src/model/Plataforma';

function cria_sut() {
    const repo = JogoRepo.getInstance();
    const sut = new JogoService(repo);
    return sut;
}

const IMG_GOF_URL = "https://sm.ign.com/t/ign_br/screenshot/default/19149244-1095370340596272-3579967127407830234-n-1_5m3p.960.jpg";
const PLAT_PS4 = new Plataforma('PS4');
const PLAT_PS5 = new Plataforma('PS5');
const PLAT_XBOX = new Plataforma('XBOX');
var jogoGof;

describe('Testes da endidade Jogo', () => {
    it('Deve Criar jogo', () => {    
    jogoGof = new Jogo('God of War', [PLAT_PS4, PLAT_PS5], 15, IMG_GOF_URL);
    expect(jogoGof.titulo).toBe('God of War');
    expect(jogoGof.plataformas.length).toBe(2);    
})

describe('Testes do Use Case Plataforma', () => {
    const sut = cria_sut();

    it('Deve adicionar um jogo no repositorio', () => {       
        const savedJogo = sut.save(jogoGof);        
        expect(savedJogo.id).toEqual(1);
        expect(savedJogo.titulo).toBe(jogoGof.titulo);
    })

    it('Deve gerar erro ao adicionar um jogo no repositorio com título duplicado', () => {
        const jogo = new Jogo('God of War', [PLAT_XBOX], 20, IMG_GOF_URL);    
        expect(() => sut.save(jogo)).toThrowError('Jogo já cadastrada');
    })

    it('Deve gerar erro ao adicionar plataforma no repositorio com título inválido', () => {        
        expect(() => sut.save(new Plataforma(''))).toThrowError('Título inválido');
    })    

    it('Deve gerar erro ao tentar forçar adição de plataforma com id repetido', () => {
        var plat = new Plataforma('NSwitch');    
        plat.id = 1;
        expect(() => sut.save(plat)).toThrowError('Plataforma já cadastrada');
    })

    it('Deve receber todas plataformas cadastradas', () => {    
        var plat1 = sut.findById(1);
        var plat2 = sut.save(new Plataforma('XBOX'));
        var plat3 = sut.save(new Plataforma('PC'));        
        expect(sut.findAll()).toEqual([plat1, plat2, plat3]);
        expect(plat1.id).toBe(1);
        expect(plat2.id).toBe(2);
        expect(plat3.id).toBe(3);
    })

    it('Deve atualizar uma plataforma', () => {
        var plat = sut.findById(1);
        plat.titulo = 'PS5';
        expect(sut.update(plat).titulo).toBe('PS5');
    })

    it('Deve gerar erro ao tentar atualizar uma plataforma inexistente', () => {
        var plat = new Plataforma('PS5');
        expect(() => sut.update(plat)).toThrowError('Plataforma não encontrada');
    })

    it('Deve deletar uma plataforma cadastrada', () => {
        expect(sut.delete(1)).toBe(true);
    })

    it('Deve retornar false ao tentar deletar uma plataforma não cadastrada', () => {
        expect(sut.delete(32)).toBe(false);
    })

    it('Deve retornar false ao tentar deletar uma plataforma inexistente', () => {
        expect(sut.delete(-1)).toBe(false);
    })

    it('Deve Encontrar plataforma por titulo', () => {
        expect(sut.findByTitulo('XBOX').titulo).toBe('XBOX');
    })

    it('Deve gerar erro ao tentar buscar plataforma por titulo inexistente', () => {
        expect(() => sut.findByTitulo('Master System')).toThrowError('Plataforma não encontrada');
    })

    it('Deve gerar erro ao tentar buscar plataforma com id inexistente', () => {
        expect(() => sut.findById(-1)).toThrowError('Plataforma não encontrada');
    })
})

