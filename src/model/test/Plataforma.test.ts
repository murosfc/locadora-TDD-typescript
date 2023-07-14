import { Plataforma } from "../Plataforma";

describe('Testes da endidade Plataforma', () => {
    it('Deve Criar plataforma', () => {
    const plat = new Plataforma('PS4');    
    expect(plat.titulo).toBe('PS4');
    })

    it('Deve gerar erro ao criar plataforma com título inválido', () => {
        expect(() => new Plataforma('')).toThrowError('Título inválido');
    })
})


