import { Plataforma } from "../../model/Plataforma";
import { PlataformaRepository } from "../InMemoryRepository/PlataformaRepository";
import { PlataformaDTO, PlataformaService } from "../../service/PlataformaService";
import { NotAllowedException } from "../../error/NotAllowedException";
import { InvalidTitleException } from "../../error/InvalidTitleException";
import { NotFoundException } from "../../error/NotFoundException";

function cria_sut() {
    const repo = PlataformaRepository.getInstance();
    const sut = new PlataformaService(repo);
    return { repo, sut };
}

describe('Testes do Use Case Plataforma', () => {
    const { sut, repo } = cria_sut();

    it('Deve adicionar plataforma no repositorio', () => {
        const plat = new PlataformaDTO('PS4');  
        const savedPlataforma = sut.save(plat);          
        expect(savedPlataforma.id).toEqual(1);
        expect(savedPlataforma.titulo).toBe(plat.titulo);
    })

    it('Deve gerar erro do tipo NotAllowedException ao adicionar plataforma no repositorio com título duplicado', () => {
        const plat = new PlataformaDTO('PS4');     
        expect(() => sut.save(plat)).toThrowError('Plataforma já cadastrada');
        expect(() => sut.save(plat)).toThrowError(NotAllowedException);
    })

    it('Deve gerar erro do tipo InvalidTitleException ao adicionar plataforma no repositorio com título inválido', () => {        
        expect(() => sut.save(new PlataformaDTO(''))).toThrowError('Título inválido');
        expect(() => sut.save(new PlataformaDTO(''))).toThrowError(InvalidTitleException);
    })    

    it('Deve gerar erro do tipo NotAllowedException ao tentar forçar adição de plataforma com id repetido', () => {
        var plat = new PlataformaDTO('NSwitch');    
        plat.id = 1;
        expect(() => sut.save(plat)).toThrowError('Plataforma já cadastrada');
        expect(() => sut.save(plat)).toThrowError(NotAllowedException);
    })

    it('Deve receber todas plataformas cadastradas', () => {    
        var plat1 = sut.findById(1);
        var plat2 = sut.save(new PlataformaDTO('XBOX'));
        var plat3 = sut.save(new PlataformaDTO('PC'));        
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

    it('Deve gerar erro do tipo NotFoundExcelption ao tentar atualizar uma plataforma inexistente', () => {
        var plat = new PlataformaDTO('PS5');
        expect(() => sut.update(plat)).toThrowError('Plataforma não encontrada');
        expect(() => sut.update(plat)).toThrowError(NotFoundException);
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

    it('Deve gerar erro do tipo NotFoundException ao tentar buscar plataforma por titulo inexistente', () => {
        expect(() => sut.findByTitulo('Master System')).toThrowError('Plataforma não encontrada');
        expect(() => sut.findByTitulo('Master System')).toThrowError(NotFoundException);
    })

    it('Deve gerar erro do tipo NotFoundException ao tentar buscar plataforma com id inexistente', () => {
        expect(() => sut.findById(-1)).toThrowError('Plataforma não encontrada');
        expect(() => sut.findById(-1)).toThrowError(NotFoundException);
    })
})

