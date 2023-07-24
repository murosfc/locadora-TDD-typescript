import { InvalidAttributeException } from "../../error/InvalidAttributeException";
import { Usuario } from "../Usuario";


describe('Teste da entidade Usuario', () => {
    it('Deve criar um usuário', () => {
        const usuario = new Usuario('João', 'joao@gmail.com', '123456', '12345678910');
        expect(usuario).toBeInstanceOf(Usuario);
        expect(usuario.nome).toBe('João');
        expect(usuario.email).toBe('joao@gmail.com');
        expect(usuario.senha).toBe('123456');
        expect(usuario.cpf).toBe('12345678910');
    });

    it('Deve lançar uma exceção to tipo InvalidAttributeException quando o nome for vazio', () => {
        expect(() => new Usuario('', 'joao@gmail.com', '123456', '12345678910')).toThrowError('Nome inválido');        
    });

    it('Deve lançar uma exceção to tipo InvalidAttributeException quando o email for vazio', () => {
        expect(() => new Usuario('João', '', '123456', '12345678910')).toThrowError('Email inválido');        
    });

    it('Deve lançar uma exceção to tipo InvalidAttributeException quando a senha for vazia', () => {
        expect(() => new Usuario('João', 'joao@gmail.com', '', '12345678910')).toThrowError('Senha inválida');
    });
    
    it('Deve lançar uma exceção to tipo InvalidAttributeException quando o cpf for vazio', () => {
        expect(() => new Usuario('João', 'joao@gmail.com', '123456', '')).toThrowError('CPF inválido');
    });
});