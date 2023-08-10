import { NotAllowedException } from "../../error/NotAllowedException";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { UsuarioRepository } from "../../repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioDTO, UsuarioService } from "../UsuarioService";
import { NotFoundException } from "../../error/NotFoundException";

function cria_sut(){
    const repo = UsuarioRepository.getInstance();
    const sut = new UsuarioService(repo);
    return sut;
}

describe('UsuarioService', () => {
    const sut = cria_sut();

    it('Deve testar setters do UsuárioDTO', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
        user.nome = 'João da Silva';
        user.email = 'joao_silva@gmail.com';
        user.cpf = '123456999999';
        user.senha = '123456789';
        expect(user.nome).toBe('João da Silva');
        expect(user.email).toBe('joao_silva@gmail.com');
        expect(user.cpf).toBe('123456999999');
        expect(user.senha).toBe('123456789');
    });


    it('Deve adicionar um usuário', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
        const savedUser = sut.save(user);
        expect(savedUser.nome).toBe(user.nome);
        expect(savedUser.email).toBe(user.email);
        expect(savedUser.senha).toBe('');
        expect(savedUser.cpf).toBe('');
        expect(savedUser.id).toBe(1);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com nome inválido', () => {
        const user = new UsuarioDTO('', 'joao@gmail.com', '123456', '12345678910');
        expect(() => sut.save(user)).toThrowError('Nome inválido')
        expect(() => sut.save(user)).toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com e-mail inválido', () => {
        const user = new UsuarioDTO('João', '', '123456', '12345678910');
        expect(() => sut.save(user)).toThrowError('e-mail inválido')
        expect(() => sut.save(user)).toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com CPF inválido', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '');
        expect(() => sut.save(user)).toThrowError('CPF inválido')
        expect(() => sut.save(user)).toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com senha inválida', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '', '99988877766');
        expect(() => sut.save(user)).toThrowError('Senha inválida')
        expect(() => sut.save(user)).toThrowError(InvalidAttributeException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentat salvar um novo usuário já com id', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
        user.id = 1;
        expect(() => sut.save(user)).toThrowError('Novo usuário não pode te id informada');
        expect(() => sut.save(user)).toThrowError(NotAllowedException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar cadastrar um usuário com e-mail já cadastrado', () => {
        const user = new UsuarioDTO('João Paulo', 'joao@gmail.com', '123456', '99999999999');
        expect(() => sut.save(user)).toThrowError('e-mail informado já está em uso');
        expect(() => sut.save(user)).toThrowError(NotAllowedException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar cadastrar um usuário com CPF já cadastrado', () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com.br', '123456', '12345678910');
        expect(() => sut.save(user)).toThrowError('CPF já cadastrado');
        expect(() => sut.save(user)).toThrowError(NotAllowedException);
    });        

    it('Deve atualizar um usuário', () => {
        const user = new UsuarioDTO('João da Silva', 'joao@gmail.com', '123456', '12345678910');
        user.id = 1;
        const updatedUser = sut.update(user);
        expect(updatedUser.nome).toBe(user.nome);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar atualizar um usuário com id inválido', () => {
        const user = new UsuarioDTO('João', 'joaosilva@gmail.com.br', '123456', '123456999999');
        user.id = 0;
        expect(() => sut.update(user)).toThrowError('Tentativa de atualização de usuário com id inválida');
        expect(() => sut.update(user)).toThrowError(NotAllowedException);
    });

    it('Deve retornar true ao deletar um usuário válido', () => {
        const deleted = sut.delete(1);
        expect(deleted).toBe(true);
    });

    it('Deve retornar false ao tentar deletar um usuário inválido', () => {
        const deleted = sut.delete(0);
        expect(deleted).toBe(false);
    });

    it('Deve retornar um usuário ao buscar por e-mail', () => {
        const user = new UsuarioDTO('João', 'joao.silva@gmail.com.br', '123456', '123456999999');
        sut.save(user);
        const userFound = sut.findByEmail(user.email);
        expect(userFound.nome).toBe(user.nome);
        expect(userFound.email).toBe(user.email);
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por e-mail inválido', () => {
        const email = 'invalido@gmail.com';
        expect(() => sut.findByEmail(email)).toThrowError('Usuário não encontrado');
        expect(() => sut.findByEmail(email)).toThrowError(NotFoundException);
    });

    it('Deve retornar um usuário ao buscar por CPF', () => {
        const user = sut.findByCpf('123456999999');
        expect(user.nome).toBe('João');
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por CPF inválido', () => {
        const cpf = '00000000000';
        expect(() => sut.findByCpf(cpf)).toThrowError('Usuário não encontrado');
        expect(() => sut.findByCpf(cpf)).toThrowError(NotFoundException);
    });

    it('Deve retornar todos os usuários', () => {
        const users = sut.findAll();
        expect(users.length).toBe(1);
    });

    it('Deve retornar um usuário ao buscar por id', () => {
        const user = sut.findById(1);
        expect(user.nome).toBe('João');
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por id inválido', () => {
        const id = 0;
        expect(() => sut.findById(id)).toThrowError('Usuário não encontrado');
        expect(() => sut.findById(id)).toThrowError(NotFoundException);
    });
});