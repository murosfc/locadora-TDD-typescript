import { NotAllowedException } from "../../error/NotAllowedException";
import { Usuario } from "../../model/Usuario";
import { UsuarioRepository } from "../InMemoryRepository/UsuarioRepository";
import { UsuarioRepositoryInterface } from "../contracts/UsuarioRepositoryInterface";

describe("Teste do UsuarioRepository", () => {
    var sut: UsuarioRepositoryInterface;

    it('Deve obter a instância única do repositório', () => {
        sut = UsuarioRepository.getInstance();
        expect(sut).not.toBeNull();
        expect(sut).not.toBeUndefined();
        expect(sut).toBeInstanceOf(UsuarioRepository);
    });

    it('Deve adicionar um usuário no repositório', () => {
        const usuario = new Usuario('João da Silva', 'jsilva@gmail.com', '123456','12345678901');         
        const usuarioSalvo = sut.save(usuario);
        expect(usuarioSalvo).not.toBeNull();
        expect(usuarioSalvo).not.toBeUndefined();
        expect(usuarioSalvo).toBeInstanceOf(Usuario);
        expect(usuarioSalvo).toHaveProperty('id');
        expect(usuarioSalvo).toHaveProperty('nome', usuario.nome);
        expect(usuarioSalvo).toHaveProperty('email', usuario.email);
        expect(usuarioSalvo).toHaveProperty('senha', usuario.senha);
        expect(usuarioSalvo).toHaveProperty('cpf', usuario.cpf);
    });

    it('Deve gerar exceção do tipo NotAllowedException ao tentar adicionar um usuário com CPF já cadastrado', () => {
        const usuario = new Usuario('Lucas Ribeiro', 'lribeiro@gmail.com', '123456','12345678901');
        expect(() => sut.save(usuario)).toThrowError('CPF já cadastrado');  
        expect(() => sut.save(usuario)).toThrowError(NotAllowedException); 
    });
    
    it('Deve gerar exceção do tipo NotAllowedException ao tentar adicionar um usuário com e-mail já cadastrado', () => {
        const usuario = new Usuario('Lucas Ribeiro', 'jsilva@gmail.com', '123456','56545799811');
        expect(() => sut.save(usuario)).toThrowError('E-mail já cadastrado');  
        expect(() => sut.save(usuario)).toThrowError(NotAllowedException); 
    }); 

    it('Deve atualizar um usuário no repositório', () => {
        const usuario = new Usuario('João da Silva Santos', 'jsilva@gmail.com', '654321','12345678901');
        usuario.id = 1;
        const usuarioAtualizado = sut.update(usuario);
        expect(usuarioAtualizado).not.toBeNull();
        expect(usuarioAtualizado).not.toBeUndefined();
        expect(usuarioAtualizado).toBeInstanceOf(Usuario);
        expect(usuarioAtualizado).toHaveProperty('id');
        expect(usuarioAtualizado).toHaveProperty('nome', usuario.nome);
        expect(usuarioAtualizado).toHaveProperty('senha', usuario.senha);
    });

    it('Deve obter CPF anterior ao tentar atualizar CPF', () => {
        var usuario = new Usuario('João da Silva', 'jsilva@gmail.com', '123456','555555555555');  
        usuario.id = 1;    
        const updatedUser = sut.update(usuario) as Usuario;
        expect(updatedUser.cpf).toBe('12345678901');
    });

    it('Deve gerar exceção do tipo NotAllowedException ao tentar atualizar email com um já em uso', () => {
        var usuario = new Usuario('Lucas Ribeiro', 'lribeiro@gmail.com', '123456','56545799811'); 
        sut.save(usuario); 
        usuario = new Usuario('Lucas Ribeiro', 'jsilva@gmail.com', '123456','56545799811');   
        usuario.id = 2;
        expect(() => sut.update(usuario)).toThrowError('Novo e-mail já está em uso por outra conta');
        expect(() => sut.update(usuario)).toThrowError(NotAllowedException);
    });

    it('Deve deletar um usuário no repositório', () => {
        expect(sut.delete(1)).toBeTruthy();
    });

    it('Deve returnar false ao tentar deletar um usuário com id inválido', () => {
        expect(sut.delete(0)).toBeFalsy();
    });

    it('Deve encontrar um usuário por id', () => {
        const usuario = sut.findById(2);
        expect(usuario).not.toBeNull();
        expect(usuario).not.toBeUndefined();
        expect(usuario).toBeInstanceOf(Usuario);
    });

    it('Deve encontar um usuário por nome', () => {
        const usuario = sut.findByNome('Lucas Ribeiro');
        expect(usuario).not.toBeNull();
        expect(usuario).not.toBeUndefined();
        expect(usuario).toBeInstanceOf(Usuario);        
    });

    it('Deve encontar um usuário por email', () => {
        const usuario = sut.findByEmail('lribeiro@gmail.com');
        expect(usuario).not.toBeNull();
        expect(usuario).not.toBeUndefined();
        expect(usuario).toBeInstanceOf(Usuario);
    });

    it('Deve encontar um usuário por cpf', () => {
        const usuario = sut.findByCpf('56545799811');
        expect(usuario).not.toBeNull();
        expect(usuario).not.toBeUndefined();
        expect(usuario).toBeInstanceOf(Usuario);
    });

    it('Deve retornar todos os usuários', () => {
        const usuario = new Usuario('João da Silva', 'jsilva@gmail.com', '123456','12345678901');         
        sut.save(usuario);
        const usuarios = sut.findAll();
        expect(usuarios).not.toBeNull();
        expect(usuarios).not.toBeUndefined();
        expect(usuarios).toBeInstanceOf(Array);
        expect(usuarios).toHaveLength(2);
    });
});