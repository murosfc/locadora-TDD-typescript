import { NotFoundException } from "../../error/NotFoundException";
import { Conta } from "..//../model/Conta";
import { ContaRepositoryInterface } from "..//contracts/ContaRepositoryInterface";
import { NotAllowedException } from "../../error/NotAllowedException";
export class ContaRepository implements ContaRepositoryInterface   {
    private lista: Conta[];
    static soleInstance: ContaRepository;

    private constructor() {
        this.lista = [];
    }
    
    getTop10(): Object[] {
        var top10Aluguadas: Conta[] = [];
        this.lista.sort((a, b) => b.vezesAlugado - a.vezesAlugado);
        const size = this.lista.length > 10 ? 10 : this.lista.length;
        for (let i = 0; i < size; i++) {
            top10Aluguadas.push(this.lista[i]);
        }   
        return top10Aluguadas;
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

    save(object: Object): Conta {
        const objectToSave = object as Conta;
        objectToSave.id = this.getNewId();
        this.lista.push(objectToSave);
        return objectToSave;
    }

    update(object: Object): Conta|Error{        
        const conta = object as Conta;
        const contacadastrada = this.findByEmail(conta.email) as Conta;
        if (contacadastrada.id !== conta.id) {
            return new NotAllowedException("novo e-mail informado já cadastrado em outra conta");
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
    
    findByEmail(email: string): Conta|Error {
        const conta = this.lista.find(c => c.email === email);
        if (!conta) {
            return new NotFoundException("conta não encontrada");
        }
        return conta;
    }
    
    findByJogo(idJogo: Number): Conta[] {
        var contas: Conta[] = [];        
        this.lista.forEach(conta => {           
            if (conta.jogo.id == idJogo) contas.push(conta);
        })
        return contas;
    }

    findAll(): Conta[] {
        return this.lista;
    }
    findById(id: number): Conta {
        return this.lista.find(c => c.id === id) as Conta;
    }  
  
}