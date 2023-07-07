import { PlataformaRepositoryInterface } from "../src/repositories/contracts/PlataformaRepositoryInterface";
import { Plataforma } from "../src/model/Plataforma";
import { listaPlataformas } from "../src/repositories/InMemoryRepository/PlataformaRepo";
import { PlataformaService } from "../src/service/PlataformaService";

function cria_sut() {
    const repo: PlataformaRepositoryInterface = new listaPlataformas();
    const sut = new PlataformaService(repo);
    return { repo, sut };
}

describe('Testes da endidade Plataforma', () => {
    it('Deve Criar plataforma', () => {
    const sut = new Plataforma('PS4');    
    expect(sut.titulo).toBe('PS4');
    })

    it('Deve gerar erro ao tentar criar plataforma sem título', () => {
        expect(() => new Plataforma('')).toThrowError('Título inválido');
    })
})

describe('Testes do Use Case Plataforma', () => {
    const { sut, repo } = cria_sut();

    it('Deve adicionar plataforma no repositorio', () => {
        const plat = new Plataforma('PS4');        
        expect(sut.save(plat).titulo).toEqual(plat.titulo);
        expect(sut.findById(1).titulo).toBe(plat.titulo);
    })

    it('Deve gerar erro ao adicionar plataforma no repositorio com título duplicado', () => {
        const plat = new Plataforma('PS4');    
        expect(() => sut.save(plat)).toThrowError('Plataforma já cadastrada');
    })

    it('Deve gerar erro ao tentar forçar adição de plataforma com id repetido', () => {
        var plat = new Plataforma('NSwitch');    
        plat.id = 1;
        expect(() => sut.save(plat)).toThrowError('Id em uso');
    })

    it('Deve eeceber todas plataformas cadastradas', () => {    
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

