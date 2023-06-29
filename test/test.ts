import { PlataformaRepository } from "../src/repositoryInterface/PlataformaRepository";
import { Plataforma } from "../src/model/Plataforma";

class listaPlataformas implements PlataformaRepository{
    private lista: Plataforma[] = [];
    constructor(){}

    add(plataforma: Plataforma): Plataforma{        
        if (this.lista.find(p => p.getId() === plataforma.getId()) !== undefined){
            throw new Error('Id em uso');
        }
        if (this.lista.find(p => p.getTitulo() === plataforma.getTitulo()) !== undefined){
            throw new Error('Plataforma já cadastrada');
        }
        this.lista.push(plataforma);
        return plataforma;
    }

    findAll(): Plataforma[]{
        return this.lista;
    }

}

test('Criar plataforma', () => {
    const sut = new Plataforma(1, 'PS4');
    expect(sut.getId()).toBe(1);
    expect(sut.getTitulo()).toBe('PS4');
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
    expect(lista.findAll()[0].getId()).toBe(1);
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