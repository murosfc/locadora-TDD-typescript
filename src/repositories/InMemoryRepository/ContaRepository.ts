import { NotFoundException } from "src/error/NotFoundException";
import { Conta } from "..//../model/Conta";
import { ContaRepositoryInterface } from "..//contracts/ContaRepositoryInterface";
import { NotAllowedException } from "src/error/NotAllowedException";
export class ContaRepository implements ContaRepositoryInterface   {
    private lista: Conta[];
    static soleInstance: ContaRepository;

    private constructor() {
        this.lista = [];
    }

    static getInstance(): ContaRepositoryInterface {
        if (!this.soleInstance) {
            this.soleInstance = new ContaRepository();
        }
        return this.soleInstance;
    }

    private getNewId(): number {
        return this.lista.length + 1;
    }
    
    findByEmail(email: string): Conta {
        return this.lista.find(c => c.email === email) as Conta;
    }
    findByJogo(jogo: Object): Conta[] {
        var contas: Conta[];
        contas = [];
        this.lista.forEach(conta => {
            conta.jogos.forEach(j => {
                if (j === jogo) {
                    contas.push(conta);
                }
            })
        })
        return contas;
    }

    findAll(): Conta[] {
        return this.lista;
    }
    findById(id: number): Conta {
        return this.lista.find(c => c.id === id) as Conta;
    }
    findByTitulo(titulo: string): Conta {
        return this.findByEmail(titulo);
    }
    save(object: Object): Conta {
        return this.save(object);
    }
    update(object: Object): Conta|Error{        
        const conta = object as Conta;
        if (this.findByEmail(conta.email).id !== conta.id) {
            return new NotAllowedException("novo e-amil informado já cadastrado em outra conta");
        }
        const index = this.lista.findIndex(c => c.id === conta.id);
        this.lista[index] = conta;
        return this.findById(conta.id) as Conta;        
    }
    delete(id: number): boolean {
        const index = this.lista.findIndex(c => c.id === id);
        if (index === -1) {
            return false;
        }
        this.lista.splice(index, 1);
        return true;
    }
  
}