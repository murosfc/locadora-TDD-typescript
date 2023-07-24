import e from "express";
import { PlataformaRepository } from "../InMemoryRepository/PlataformaRepository";
import { PlataformaRepositoryInterface } from "../contracts/PlataformaRepositoryInterface";
import { Plataforma } from "../../model/Plataforma";
import { NotAllowedException } from "../../error/NotAllowedException";

describe('Teste PlataformaRepository', () => {
    var sut: PlataformaRepositoryInterface;

    it('Deve obter a instância de PlataformaRepository', () => {
        sut = PlataformaRepository.getInstance();
        expect(sut).toBeInstanceOf(PlataformaRepository);
        expect(sut).not.toBeNull();
    });

    it('Deve adicionar uma plataforma no repositório', () => {
        const plat = new Plataforma('PS4');
        const savedPlat = sut.save(plat) as Plataforma;        
        expect(savedPlat.id).toBe(1);
        expect(savedPlat.titulo).toBe('PS4');
    });

    it('Deve retornar erro do tipo NotAllowedException ao tentar adicionar uma plataforma com título já cadastrado', () => {
        const plat = new Plataforma('PS4');
        expect(() => sut.save(plat)).toThrowError('Plataforma já cadastrada');
        expect(() => sut.save(plat)).toThrowError(NotAllowedException);
    });

    it('Deve atualiza uma plataforma no repositório', () => {
        const plat = new Plataforma('PS5');
        plat.id = 1;
        const updatedPlat = sut.update(plat) as Plataforma;
        expect(updatedPlat.id).toBe(1);
        expect(updatedPlat.titulo).toBe('PS5');
    });

    it('Deve retornar erro do tipo NotAllowedException ao tentar atualizar uma plataforma com título já cadastrado', () => {
        const plat = new Plataforma('PS4');
        var savedPlat = sut.save(plat) as Plataforma;
        savedPlat.titulo = 'PS5';
        expect(() => sut.update(plat)).toThrowError('Novo título já cadastrado');
        expect(() => sut.update(plat)).toThrowError(NotAllowedException);
    });

    it('Deve deletar uma plataforma no repositório', () => {
        expect(sut.delete(1)).toBe(true);
    });

    it('Deve retornar false ao tentar deletar uma plataforma inexistente no repositório', () => {
        expect(sut.delete(1)).toBe(false);
    });

    it('Deve retornar todas as plataformas do repositório', () => {
        const plat = new Plataforma('PS4');
        sut.save(plat);
        const plataformas = sut.findAll();
        expect(plataformas.length).toBe(2);        
    });

    it('Deve retornar uma plataforma do repositório ao buscar por id', () => {
        const plat = sut.findById(2) as Plataforma;
        expect(plat.id).toBe(2);
    });

    it('Deve econtrar uma plataforma por titulo', () => {
        const plat = sut.findByTitulo('PS4') as Plataforma;
        expect(plat.id).toBe(2);
    });

});