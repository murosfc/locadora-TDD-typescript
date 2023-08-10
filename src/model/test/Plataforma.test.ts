import { Plataforma } from "../Plataforma";

describe('Testes da endidade Plataforma', () => {
    it('Deve Criar plataforma', () => {
    const plat = new Plataforma('PS4');    
    expect(plat.titulo).toBe('PS4');
    })

    it('Deve gerar erro ao criar plataforma com título inválido', () => {
        expect(() => new Plataforma('')).toThrowError('Título inválido');
    })

    it('Deve atribuir id 1 a plataforma e obter a mesma', () => {
        const plat = new Plataforma('PS4');
        plat.id = 1;
        expect(plat.id).toBe(1);
    })
})


