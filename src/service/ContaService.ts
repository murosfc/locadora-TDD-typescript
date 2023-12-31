import { Jogo } from '../model/Jogo';
import { Conta } from '../model/Conta';
import { DomainObject } from '../model/DomainObject';
import { ContaServiceInterface } from '../service/contracts/ContaServiceInterface';
import { NotAllowedException } from '../error/NotAllowedException';
import { ContaRepositoryInterface } from '../repositories/contracts/ContaRepositoryInterface';
import { InvalidAttributeException } from '../error/InvalidAttributeException';
import { NotFoundException } from '../error/NotFoundException';

export class ContaDTO extends DomainObject{   
    email: string;
    senha: string;
    jogo: Jogo;
    vezesAlugado: number; 
    
    constructor(email: string, senha: string, jogo: Jogo) {
        super();        
        this.email = email;
        this.senha = senha;
        this.jogo = jogo;
        this.vezesAlugado = 0;
    }

    static contaToDto(conta: Conta): ContaDTO{
        const dto = new ContaDTO(conta.email, conta.senha, conta.jogo);
        dto.id = conta.id;  
        dto.senha = conta.senha;
        dto.vezesAlugado = conta.vezesAlugado;            
        return dto;         
    }

    static dtoToConta(dto: ContaDTO): Conta{
        const conta = new Conta(dto.email, dto.senha, dto.jogo);
        conta.id = dto.id;
        conta.vezesAlugado = dto.vezesAlugado;
        return conta;        
    }
}

export class ContaService implements ContaServiceInterface<ContaDTO>{
    private repository: ContaRepositoryInterface;

    constructor(repository: ContaRepositoryInterface) {
        this.repository = repository;
    }

    getTop10(): Error | ContaDTO[] {
        const contas = this.repository.getTop10();        
        if (contas.length === 0) {
            return new NotFoundException('Nenhuma conta encontrada');
        }
        const dtos: ContaDTO[] = [];
        contas.forEach(conta => {
            dtos.push(ContaDTO.contaToDto(conta as Conta));
        });
        return dtos;
    }
       
    save(entity: ContaDTO): ContaDTO|Error {
        if (entity.id > 0) {
            return new NotAllowedException('Você está tentando salvar uma conta com id já existente.');
        }
        if (entity.email.length === 0) {
            return new InvalidAttributeException('Você está tentando salvar uma conta com email inválido.');
        }
        if (entity.senha.length === 0) {
            return new InvalidAttributeException('Você está tentando salvar uma conta com senha inválida.');
        }
        if (entity.jogo === undefined) {
            return new InvalidAttributeException('Você está tentando salvar uma conta com jogo inválido.')
        }        
        const conta = ContaDTO.dtoToConta(entity);
        const savedConta = this.repository.save(conta) as Conta;        
        return ContaDTO.contaToDto(savedConta);
    }
    update(entity: ContaDTO): ContaDTO|Error {       
        if (entity.id <= 0 || entity.id === undefined) {
            return new NotAllowedException('Conta não existe, portanto não pode ser atualizada.');
        }
        if (entity.email.length === 0) {
            return new InvalidAttributeException('Você está tentando atualizar uma conta com email inválido.');
        }
        if (entity.senha.length === 0) {
            return new InvalidAttributeException('Você está tentando atualizar uma conta com senha inválida.');
        } 
        if (entity.jogo === undefined) {
            return new InvalidAttributeException('Você está tentando atualizar uma conta com jogo inválido.')
        }         
        const conta = ContaDTO.dtoToConta(entity);
        const updatedConta = this.repository.update(conta) as Conta;
        return ContaDTO.contaToDto(updatedConta);
    }
    delete(id: number): boolean {
        return this.repository.delete(id);
    }

    findByEmail(email: string): ContaDTO | Error {
        const conta = this.repository.findByEmail(email);
        if (conta instanceof Error) {
            return new NotFoundException('Conta não encontrada com o e-mail informado.');
        }
        return ContaDTO.contaToDto(conta as Conta);
    }
    findByJogo(idJogo: Number): ContaDTO[] | Error {                       
        const contas = this.repository.findByJogo(idJogo);         
        if (contas.length === 0) {
            return new NotFoundException('Nenhuma conta encontada para o jogo informado');
        }          
        const dtos: ContaDTO[] = [];
        contas.forEach(conta => {
            dtos.push(ContaDTO.contaToDto(conta as Conta));
        });       
        return dtos;
    }
    findAll(): ContaDTO[] {
        const contas = this.repository.findAll();
        const dtos: ContaDTO[] = [];
        contas.forEach(conta => {            
            dtos.push(ContaDTO.contaToDto(conta as Conta));            
        });
        return dtos;
    }
    findById(id: number): ContaDTO|Error {
        const conta = this.repository.findById(id);
        if (!conta) {
            return new NotFoundException('Conta não encontrada com o id informado.');
        }
        return ContaDTO.contaToDto(conta as Conta);
    }
    

}