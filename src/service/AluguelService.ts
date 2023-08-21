import { Aluguel } from "../model/Aluguel";
import { AluguelServiceInterface } from "./contracts/AluguelServiceInterface";
import { AluguelRepositoryInterface } from "../repositories/contracts/AluguelRepositoryInterface";
import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { NotAllowedException } from "../error/NotAllowedException";
import { DomainError } from "../error/DomainError";
import { NotFoundException } from "../error/NotFoundException";

export class AluguelService implements AluguelServiceInterface<Aluguel>{
    private repository: AluguelRepositoryInterface;

    constructor(repository: AluguelRepositoryInterface) {
        this.repository = repository;
    }

    private exportDto(aluguel: Aluguel): Aluguel{
        aluguel.usuario.senha = "informação ocultada";
        return aluguel;        
    }

    private validaAluguel(aluguel: Aluguel): boolean|Error{
        if(!aluguel.usuario){
            return new InvalidAttributeException("Usuário não informado");
        }
        if(aluguel.contas.length === 0){
            return new InvalidAttributeException("Conta não informada");
        }
        if(aluguel.periodoEmSemanas <= 0){
            return new InvalidAttributeException("Período de aluguel inválido");
        }
        var constasDisponiveis = true;
        aluguel.contas.forEach(conta => {
           if(!this.repository.isContaAvailable(conta.id)){                               
                constasDisponiveis = false;
            }
        });
        return constasDisponiveis? true : new NotAllowedException("Conta informada já pertence a um aluguel ativo");;
    }

    save(entity: Aluguel): Aluguel | Error {
        const result = this.validaAluguel(entity);
        console.log("result: " + result);
        if(result instanceof DomainError){            
            return result;
        }
        const aluguel = this.repository.save(entity);
        if(aluguel instanceof Error){
            return aluguel;
        }
        return this.exportDto(aluguel as Aluguel);
    }
    
    update(entity: Aluguel): Aluguel | Error {
        const aluguelDB = this.repository.findById(entity.id);    
        if (aluguelDB instanceof Error) {
            return aluguelDB;
        }
        const aluguel = aluguelDB as Aluguel;   
        const periodoAExtender = entity.periodoEmSemanas - aluguel.periodoEmSemanas; 
        return this.estenderAluguel(entity.id, periodoAExtender); 
    }

    delete(id: number): boolean {        
        const aluguel = this.repository.findById(id);
        if(aluguel instanceof Error){
            return false;
        }
        return this.repository.delete(id);   
    }   

    estenderAluguel(id: number, periodoEmSemanas: number): Aluguel | Error {
        if(periodoEmSemanas <= 0){
            return new InvalidAttributeException("Período de aluguel inválido");
        }
        const aluguelDB = this.repository.findById(id);
        if(aluguelDB instanceof Error){
            return aluguelDB;
        }
        const aluguel = aluguelDB as Aluguel;
        aluguel.estenderAluguel(periodoEmSemanas);
        const aluguelAtualizado = this.repository.update(aluguel);
        if(aluguelAtualizado instanceof Error){
            return aluguelAtualizado;
        }  
        return this.exportDto(aluguelAtualizado as Aluguel); 	
    }

    private retornarLista(lista: Object): Aluguel[] | Error{
        if(lista instanceof Error){
            return lista;
        }
        const listaAluguel = lista as Aluguel[];
        const listaAlugueisDTO = listaAluguel .map(aluguel => this.exportDto(aluguel as Aluguel));
        return listaAlugueisDTO; 
    }

    findByUsuario(idUsuario: number): Error | Aluguel[] {
        const listaAlugueis = this.repository.findByUsuario(idUsuario);
        return this.retornarLista(listaAlugueis);       
    }

    findByConta(idConta: number): Error | Aluguel[] {
        const listaAlugueis = this.repository.findByConta(idConta);
        return this.retornarLista(listaAlugueis);
    }

    findAll(): Aluguel[] {
        return this.repository.findAll().map(aluguel => this.exportDto(aluguel as Aluguel));
    }

    findByDataAluguelRange(dataInicial: Date, dataFinal: Date): Error | Aluguel[] {
        const listaAlugueis = this.repository.findByDataAluguelRange(dataInicial, dataFinal);
        return this.retornarLista(listaAlugueis);
    }    

    findById(id: number): Aluguel | Error {
        const aluguel = this.repository.findById(id);
        if(aluguel instanceof Error){
            return new NotFoundException("Aluguel não encontrado");
        }
        return this.exportDto(aluguel as Aluguel);
    }
   
    
    
}