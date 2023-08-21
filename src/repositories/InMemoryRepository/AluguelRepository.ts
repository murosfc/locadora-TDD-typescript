import { NotAllowedException } from "../../error/NotAllowedException";
import { CrudException } from "../../error/CrudException";
import { NotFoundException } from "../../error/NotFoundException";
import { Aluguel } from "../../model/Aluguel";
import { AluguelRepositoryInterface } from "../contracts/AluguelRepositoryInterface";

export class AluguelRepository implements AluguelRepositoryInterface {
    private static _instance: AluguelRepository;
    private lista: Aluguel[];
    
    private constructor() { 
        this.lista = [];
    }

    private addOrUpdate(aluguel: Aluguel): Aluguel | Error {
        const indice = this.lista.findIndex(a => a.id === aluguel.id);
        if (indice === -1) {
            this.lista.push(aluguel);
        } else {
            this.lista[indice] = aluguel;
        }
        if(this.lista.find(a => a.id === aluguel.id) === undefined){
            return new CrudException("Erro ao salvar aluguel");
        }
        return aluguel;
    }

    static getInstance(): AluguelRepositoryInterface {
        if (!AluguelRepository._instance) {
            AluguelRepository._instance = new AluguelRepository();
        }
        return AluguelRepository._instance;
    }

    private getNewId(): number {
        return this.lista.length + 1;
    }
    
    save(object: Object): Aluguel | Error{
        const aluguel = object as Aluguel;
        aluguel.id = this.getNewId();
        return this.addOrUpdate(aluguel);
    }
    update(object: Object): Aluguel | Error{
        const aluguel = object as Aluguel;
        const indice = this.lista.findIndex(a => a.id === aluguel.id);
        if(this.lista[indice].periodoEmSemanas !== aluguel.periodoEmSemanas){
            this.estenderAluguel(aluguel.id, aluguel.periodoEmSemanas);
        }
        return this.addOrUpdate(aluguel);
    }
    delete(id: number): boolean {
        const indice = this.lista.findIndex(a => a.id === id);
        if (indice === -1) {
            return false;
        }
        this.lista.splice(indice, 1);
        return true;
    }
    estenderAluguel(id: number, periodoEmSemanas: number): Aluguel | Error {
        if(periodoEmSemanas <= 0){
            return new NotAllowedException("Não é permitido reduzir o prazo do aluguel.");
        }
        const indice = this.lista.findIndex(a => a.id === id);
        if (indice === -1) {
            return new NotFoundException("Aluguel não encontrado.");
        }
        const aluguel = this.lista[indice];
        aluguel.estenderAluguel(periodoEmSemanas);
        return this.addOrUpdate(aluguel);       
    }
    findByUsuario(idUsuario: number): Error | Aluguel[] {
        var alugueis: Aluguel[] = [];
        this.lista.forEach(aluguel => {
            if (aluguel.usuario.id === idUsuario) {
                alugueis.push(aluguel);
            }
        });
        if (alugueis.length === 0) {
            return new NotFoundException("Usuário sem aluguel registrado.");
        }
        return alugueis;
    }
    findByConta(idConta: number): Error | Aluguel[] {
        var alugueis: Aluguel[] = [];
        this.lista.forEach(aluguel => {
            aluguel.contas.forEach(conta => {
                if (conta.id === idConta) {
                    alugueis.push(aluguel);
                }
            });
        });
        if (alugueis.length === 0) {
            return new NotFoundException("Não econtrado aluguel para a conta informada.");
        }
        return alugueis;
    }
    findByDataAluguelRange(dataInicial: Date, dataFinal: Date): Error | Aluguel[] {
        var alugueis: Aluguel[] = [];
        this.lista.forEach(aluguel => {
            if (aluguel.dataAluguel >= dataInicial && aluguel.dataFinal <= dataFinal) {
                alugueis.push(aluguel);
            }
        });
        if (alugueis.length === 0) {
            return new NotFoundException("Não econtrado aluguel para o período informado.");
        }
        return alugueis;
    }
    findAll(): Aluguel[] {
        return this.lista;
    }
    findById(id: number): Aluguel | Error {
        const aluguel = this.lista.find(a => a.id === id);
        if (aluguel === undefined) {
            return new NotFoundException("Aluguel não encontrado.");
        }
        return aluguel;
    }
    
}
