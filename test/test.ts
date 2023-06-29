import { PlataformaRepositoryInterface } from "../src/repositoryInterface/PlataformaRepositoryInterface";
import { Plataforma } from "../src/model/Plataforma";
import { listaPlataformas } from "../src/temporaryRepository/temporaryPlataformaRepo";

test('Criar plataforma', () => {
    const sut = new Plataforma(1, 'PS4');
    expect(sut.id).toBe(1);
    expect(sut.titulo).toBe('PS4');
})

test('Criar plataforma id inválida', () => {
   expect(() => new Plataforma(0, 'PS4')).toThrowError('Id inválido');
})

test('Criar plataforma sem título', () => {
    expect(() => new Plataforma(1, '')).toThrowError('Título inválido');
})

test('Adicionar plataforma no repositorio', () => {
    const sut = new Plataforma(1, 'PS4');
    const lista = new listaPlataformas();
    lista.add(sut);
    expect(lista.findAll().length).toBe(1);
    expect(lista.findAll()[0].id).toBe(1);
})

test('Adicionar plataforma no repositorio com id duplicado', () => {
    var sut = new Plataforma(1, 'PS4');
    const lista = new listaPlataformas();
    lista.add(sut);    
    expect(() => lista.add(new Plataforma(1, 'XBOX'))).toThrowError('Id em uso');
})

test('Adicionar plataforma no repositorio com título duplicado', () => {
    var sut = new Plataforma(1, 'PS4');
    const lista = new listaPlataformas();
    lista.add(sut);
    sut = new Plataforma(2, 'PS4');
    expect(() => lista.add(sut)).toThrowError('Plataforma já cadastrada');
})

test('Receber todas plataformas por inversão de dependência', () => {
    const repo: PlataformaRepositoryInterface = new listaPlataformas();
    var sut1 = new Plataforma(1, 'PS4');
    var sut2 = new Plataforma(2, 'XBOX');
    var sut3 = new Plataforma(3, 'PC');    
    repo.save(sut1);
    repo.save(sut2);
    repo.save(sut3);    
    expect(repo.findAll()).toStrictEqual([sut1, sut2, sut3]);
})

