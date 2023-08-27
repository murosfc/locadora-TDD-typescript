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
    var globalUser = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
    
    beforeAll(async () => {        
        globalUser = await sut.save(globalUser)
    });

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


    it('Deve adicionar um usuário',  async () => {
        const user = new UsuarioDTO('Felipe', 'felipe@gmail.com', '123456', '12345678999');
        const savedUser = await sut.save(user);
        expect(savedUser.nome).toBe(user.nome);
        expect(savedUser.email).toBe(user.email);
        expect(savedUser.senha).toBe('');
        expect(savedUser.cpf).toBe('');
        expect(savedUser.id).toBe(2);
    });    

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com nome inválido', async () => {
        const user = new UsuarioDTO('', 'joao@gmail.com', '123456', '12345678910');
        expect(async () => await sut.save(user)).rejects.toThrowError('Nome inválido')
        expect(async () => await sut.save(user)).rejects.toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com e-mail inválido', async () => {
        const user = new UsuarioDTO('João', '', '123456', '12345678910');
        expect(async () => await sut.save(user)).rejects.toThrowError('e-mail inválido')
        expect(async () => await sut.save(user)).rejects.toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com CPF inválido', async () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '');
        expect(async () => await sut.save(user)).rejects.toThrowError('CPF inválido')
        expect(async () => await sut.save(user)).rejects.toThrowError(InvalidAttributeException);
    });

    it('Deve gerar erro do tipo InvalidAttributeException adicionar um usuário com senha inválida', async () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '', '99988877766');
        expect(async () => await sut.save(user)).rejects.toThrowError('Senha inválida')
        expect(async () => await sut.save(user)).rejects.toThrowError(InvalidAttributeException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentat salvar um novo usuário já com id', async () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com', '123456', '12345678910');
        user.id = 1;
        expect(async () => await sut.save(user)).rejects.toThrowError('Novo usuário não pode te id informada');
        expect(async () => await sut.save(user)).rejects.toThrowError(NotAllowedException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar cadastrar um usuário com e-mail já cadastrado', async () => {
        const user = new UsuarioDTO('João Paulo', 'joao@gmail.com', '123456', '99999999999');
        expect(async () => await sut.save(user)).rejects.toThrowError('e-mail informado já está em uso');
        expect(async () => await sut.save(user)).rejects.toThrowError(NotAllowedException);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar cadastrar um usuário com CPF já cadastrado', async () => {
        const user = new UsuarioDTO('João', 'joao@gmail.com.br', '123456', '12345678910');
        expect(async () => await sut.save(user)).rejects.toThrowError('CPF já cadastrado');
        expect(async () => await sut.save(user)).rejects.toThrowError(NotAllowedException);
    });   
    
    it("Deve fazer login com sucesso", async () => {
        const user = await sut.login(globalUser.email, '123456');
        expect(user.nome).toBe(globalUser.nome);    
    });

    it("Deve gerar um erro do tipo NotFoundException ao tentar fazer login com e-mail inválido", async () => {
        const email = 'notregistered@gmail.com';
        expect(async () => await sut.login(email, globalUser.senha)).rejects.toThrowError('Usuário não encontrado');
        expect(async () => await sut.login(email, globalUser.senha)).rejects.toThrowError(NotFoundException);
    });

    it("Deve gerar um erro do tipo NotAllowedException ao tentar fazer login com senha inválida", async () => {
        const senha = 'invalidpassword';
        expect(async () => await sut.login(globalUser.email, senha)).rejects.toThrowError('Senha inválida');
        expect(async () => await sut.login(globalUser.email, senha)).rejects.toThrowError(NotAllowedException);
    });

    it('Deve retornar um usuário ao buscar por id', async () => {
        const user = await sut.findById(globalUser.id);
        expect(user.nome).toBe(globalUser.nome);
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por id inválido', async () => {
        const id = 0;
        expect(async () => await sut.findById(id)).rejects.toThrowError('Usuário não encontrado');
        expect(async () => await sut.findById(id)).rejects.toThrowError(NotFoundException);
    });

    it('Deve retornar um usuário ao buscar por e-mail', async () => {        
        const userFound = await sut.findByEmail(globalUser.email);
        expect(userFound.nome).toBe(globalUser.nome);
        expect(userFound.email).toBe(globalUser.email);
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por e-mail inválido', async () => {
        const email = 'invalido@gmail.com';
        expect(async () => await sut.findByEmail(email)).rejects.toThrowError('Usuário não encontrado');
        expect(async () => await sut.findByEmail(email)).rejects.toThrowError(NotFoundException);
    });

    it('Deve retornar um usuário ao buscar por CPF', async () => {
        const user = await sut.findByCpf('12345678910');
        expect(user.nome).toBe(globalUser.nome);
    });

    it('Deve gerar um erro do tipo NotFoundException ao buscar por CPF inválido', async () => {
        const cpf = '00000000000';
        expect(async () => await sut.findByCpf(cpf)).rejects.toThrowError('Usuário não encontrado');
        expect(async () => await sut.findByCpf(cpf)).rejects.toThrowError(NotFoundException);
    });

    it('Deve retornar todos os usuários', async () => {
        const users = await sut.findAll();
        expect(users.length).toBeGreaterThan(0);
    });

    it('Deve atualizar um usuário', async () => {
        const user = new UsuarioDTO('João da Silva', 'joao@gmail.com', '123456', '12345678910');
        user.id = globalUser.id;
        const updatedUser = await sut.update(user);
        expect(updatedUser.nome).toBe(user.nome);
    });

    it('Deve gerar um erro do tipo NotAllowedException ao tentar atualizar um usuário com id inválido', async () => {
        const user = new UsuarioDTO('João', 'joaosilva@gmail.com.br', '123456', '123456999999');
        user.id = 0;
        expect(async () => await sut.update(user)).rejects.toThrowError('Tentativa de atualização de usuário com id inválida');
        expect(async () => await  sut.update(user)).rejects.toThrowError(NotAllowedException);
    });

    it('Deve retornar true ao deletar um usuário válido', async () => {
        const deleted = await sut.delete(1);
        expect(deleted).toBe(true);
    });

    it('Deve retornar false ao tentar deletar um usuário inválido', async () => {
        const deleted = await sut.delete(0);
        expect(deleted).toBe(false);
    });
    
});

