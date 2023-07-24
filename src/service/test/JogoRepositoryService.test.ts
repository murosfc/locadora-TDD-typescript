import { JogoRepository } from '../../repositories/InMemoryRepository/JogoRepository';
import { JogoDTO, JogoService } from '../JogoService';
import { Jogo } from '../../model/Jogo';
import { PlataformaDTO } from '../PlataformaService';
import { NotAllowedException } from '../../error/NotAllowedException';
import { NotFoundException } from '../../error/NotFoundException';
import { InvalidTitleException } from '../../error/InvalidTitleException';

function cria_sut() {
    const repo = JogoRepository.getInstance();
    const sut = new JogoService(repo);
    return sut;
}

const IMG_GOF_URL = "https://sm.ign.com/t/ign_br/screenshot/default/19149244-1095370340596272-3579967127407830234-n-1_5m3p.960.jpg";
const PLAT_PS4 = new PlataformaDTO('PS4');
const PLAT_PS5 = new PlataformaDTO('PS5');
const PLAT_XBOX = new PlataformaDTO('XBOX');
const PLAT_NSWITCH = new PlataformaDTO('NINTENDO SWITCH');
const PLAT_PC = new PlataformaDTO('PC');
var jogoGof= new Jogo('God of War', [PlataformaDTO.dtoToPlataforma(PLAT_PS4), PlataformaDTO.dtoToPlataforma(PLAT_PS5)], 15, IMG_GOF_URL);

describe('Testes do Use Case Jogo', () => {
    const sut = cria_sut();

    it('Deve adicionar um jogo no repositorio', () => { 
        const dto = JogoDTO.jogoToDTO(jogoGof);      
        const savedJogo = sut.save(dto);        
        expect(savedJogo.id).toEqual(1);
        expect(savedJogo.titulo).toBe(jogoGof.titulo);
    })

    it('Deve gerar erro do tipo NotAllowedException ao tentar adicionar um jogo no repositorio com título duplicado', () => {
        const jogo = new JogoDTO('God of War', [PLAT_XBOX], 20, IMG_GOF_URL);    
        expect(() => sut.save(jogo)).toThrowError('Jogo já cadastrado');
        expect(() => sut.save(jogo)).toThrowError(NotAllowedException);
    })

    it('Deve gerar erro tipo InvalidTitleException ao tenta adicionar jogo no repositorio com título inválido', () => {    
        const jogo = new JogoDTO('', [PLAT_XBOX], 20, "");    
        expect(() => sut.save(jogo)).toThrowError('Título inválido');
        expect(() => sut.save(jogo)).toThrowError(InvalidTitleException);
    })    

    it('Deve gerar erro do tipo NotAllowedException ao tentar forçar adição de um jogo com id repetido', () => {
        const jogo = new JogoDTO('Gears of War', [PLAT_XBOX], 20, "");      
        jogo.id = 1;
        expect(() => sut.save(jogo)).toThrowError('Jogo já cadastrado');
        expect(() => sut.save(jogo)).toThrowError(NotAllowedException);
    })

    it('Deve gerar um erro do tipo NotAllowedException ao tentar adicionar um jogo com valor negativo', () => {
        const jogo = new JogoDTO('Gears of War', [PLAT_XBOX], -20, "");
        expect(() => sut.save(jogo)).toThrowError('Valor deve ser maior que zero');
        expect(() => sut.save(jogo)).toThrowError(NotAllowedException);
    })

    it('Deve gerar um erro do tipo NotAllowedException ao tentar adicionar um jogo sem plataforma', () => {
        const jogo = new JogoDTO('Gears of War', [], 20, "");
        expect(() => sut.save(jogo)).toThrowError('Jogo deve ter pelo menos uma plataforma');
        expect(() => sut.save(jogo)).toThrowError(NotAllowedException);
    })

    it('Deve receber todos os jogos cadastrados', () => {    
        var jogo1 = sut.findById(1);
        var jogo2 = sut.save(new JogoDTO('Gears of War', [PLAT_XBOX], 20, ""));
        var jogo3 = sut.save(new JogoDTO('Mario Kart 8', [PLAT_NSWITCH], 20, ""));        
        expect(sut.findAll()).toEqual([jogo1, jogo2, jogo3]);
        expect(jogo1.id).toBe(1);
        expect(jogo2.id).toBe(2);
        expect(jogo3.id).toBe(3);
    })

    it('Deve atualizar uma jogo', () => {
        var jogo = sut.findById(3);
        jogo.titulo = 'Mario Kart 8: Deluxe';
        expect(sut.update(jogo).titulo).toBe('Mario Kart 8: Deluxe');
    })

    it('Deve gerar erro do tipo NotFoundException ao tentar atualizar um jogo inexistente', () => {
        var plat = new JogoDTO('Fifa 2023', [PLAT_XBOX], 20, "");
        expect(() => sut.update(plat)).toThrowError('Jogo não encontrado');
        expect(() => sut.update(plat)).toThrowError(NotFoundException);
    })

    it('Deve deletar um jogo cadastrado', () => {
        expect(sut.delete(1)).toBe(true);
    })

    it('Deve retornar false ao tentar deletar um jogo não cadastrado', () => {
        expect(sut.delete(32)).toBe(false);
    })

    it('Deve retornar false ao tentar deletar um jogo inexistente', () => {
        expect(sut.delete(-1)).toBe(false);
    })

    it('Deve Encontrar um jogo por titulo', () => {
        expect(sut.findByTitulo('Mario Kart 8: Deluxe').titulo).toBe('Mario Kart 8: Deluxe');
    })

    it('Deve gerar erro do tipo NotFoundException ao tentar buscar um jogo com titulo não cadastrado', () => {
        expect(() => sut.findByTitulo('Zelda: Breath of the Wild')).toThrowError('Jogo não encontrado');
        expect(() => sut.findByTitulo('Zelda: Breath of the Wild')).toThrowError(NotFoundException);
    })

    it('Deve gerar erro tipo NotFoundException ao tentar buscar um jogo com id inexistente', () => {
        expect(() => sut.findById(-1)).toThrowError('Jogo não encontrado');
        expect(() => sut.findById(-1)).toThrowError(NotFoundException);
    })

    it('Deve encontrar um jogo por plataforma', () => {
        var jogos = sut.findByPlataforma(PLAT_NSWITCH);
        expect(jogos.length).toBeGreaterThan(0);        
    })

    it ('Deve gerar erro do tipo NotFoundException ao tentar buscar um jogo por plataforma não cadastrada', () => {
        expect(() => sut.findByPlataforma(PLAT_PC)).toThrowError('Nenhum jogo encontrado para a plataforma informada');
        expect(() => sut.findByPlataforma(PLAT_PC)).toThrowError(NotFoundException);
    })

    it('Deve encontrar um jogo por range de valor', () => {
        var jogos = sut.findByRangeValor(20, 30);
        expect(jogos.length).toBeGreaterThan(0);
    })

    it('Deve gerar erro do tipo NotFoundException ao tentar buscar um jogo por range de valor inválido', () => {
        expect(() => sut.findByRangeValor(100, 200)).toThrowError('Nenhum jogo encontrado para o range de valor informado');
        expect(() => sut.findByRangeValor(100, 200)).toThrowError(NotFoundException);
    })
})

