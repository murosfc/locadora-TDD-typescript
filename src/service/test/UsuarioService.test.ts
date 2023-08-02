import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioDTO, UsuarioService } from "../UsuarioService";

function cria_sut(){
    const repo = UsuarioRepository.getInstance();
    const sut = new UsuarioService(repo);
    return sut;
}

describe('UsuarioService', () => {
    const sut = cria_sut();

    it('Deve adicionar um usuário', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
        const savedUser = sut.save(user);
        expect(savedUser.nome).toBe(user.nome);
        expect(savedUser.email).toBe(user.email);
        expect(savedUser.senha).toBe('');
        expect(savedUser.cpf).toBe('');
        expect(savedUser.id).toBe(1);
    });

    it('Deve atualizar um usuário', () => {
        const user = new UsuarioDTO('João da Silva', 'joao@gmail.com', '123456', '12345678910');
        



});