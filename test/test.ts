import { PlataformaRepositoryInterface } from "../src/repositoryInterface/PlataformaRepositoryInterface";
import { Plataforma } from "../src/model/Plataforma";
import { listaPlataformas } from "../src/temporaryRepository/temporaryPlataformaRepo";

const repo: PlataformaRepositoryInterface = new listaPlataformas();

test('Criar plataforma', () => {
    const sut = new Plataforma('PS4');    
    expect(sut.titulo).toBe('PS4');
})

test('Criar plataforma sem título', () => {
    expect(() => new Plataforma('')).toThrowError('Título inválido');
})

test('Adicionar plataforma no repositorio', () => {
    const sut = new Plataforma('PS4');    
    expect(repo.save(sut).titulo).toEqual(sut.titulo);
    expect(repo.findById(1).titulo).toBe(sut.titulo);
})

test('Adicionar plataforma no repositorio com título duplicado', () => {
    var sut = new Plataforma('PS4');    
    expect(() => repo.save(sut)).toThrowError('Plataforma já cadastrada');
})

test('Forçar adição de plataforma com id repetido', () => {
    var sut = new Plataforma('NSwitch');    
    sut.id = 1;
    expect(() => repo.save(sut)).toThrowError('Id em uso');
})

test('Receber todas plataformas por inversão de dependência', () => {    
    var sut1 = repo.findById(1);
    var sut2 = repo.save(new Plataforma('XBOX'));
    var sut3 = repo.save(new Plataforma('PC'));        
    expect(repo.findAll()).toEqual([sut1, sut2, sut3]);
    expect(sut1.id).toBe(1);
    expect(sut2.id).toBe(2);
    expect(sut3.id).toBe(3);
})

test('Atualizar uma plataforma', () => {
    var sut = repo.findById(1);
    sut.titulo = 'PS5';
    expect(repo.update(sut).titulo).toBe('PS5');
})

test('Atualizar uma plataforma inexistente', () => {
    var sut = new Plataforma('PS5');
    expect(() => repo.update(sut)).toThrowError('Plataforma não encontrada');
})

test('Deletar uma plataforma', () => {
    expect(repo.delete(1)).toBe(true);
})

test('Deletar uma plataforma inexistente', () => {
    expect(repo.delete(-1)).toBe(false);
})

test('Encontrar plataforma por titulo', () => {
    expect(repo.findByTitulo('XBOX').titulo).toBe('XBOX');
})

test('Buscar plataforma por titulo inexistente', () => {
    expect(() => repo.findByTitulo('Master System')).toThrowError('Plataforma não encontrada');
})

test('Buscar plataforma com id inexistente', () => {
    expect(() => repo.findById(-1)).toThrowError('Plataforma não encontrada');
})

