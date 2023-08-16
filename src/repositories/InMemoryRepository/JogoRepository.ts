import { Jogo } from "../../model/Jogo";
import { JogoRepositoryInterface } from "../contracts/JogoRepositoryInterface";
import { Plataforma } from "../../model/Plataforma";
import { InvalidAttributeException } from "../../error/InvalidAttributeException";


export class JogoRepository implements JogoRepositoryInterface {  
    private lista: Jogo[];
    static soleInstance: JogoRepository;

    private constructor() {
        this.lista = [];
    }

    static getInstance(): JogoRepositoryInterface {
        if (!this.soleInstance) {
            this.soleInstance = new JogoRepository();
        }
        return this.soleInstance;
    }

    private getNewId(): number {
        return this.lista.length + 1;
    }

    findByTitulo(titulo: string): Jogo {
        return this.lista.find(j => j.titulo === titulo) as Jogo;
    }

    findByPlataforma(idPlataforma: Number): Jogo[] {        
        var jogos: Jogo[] = [];
        this.lista.forEach(j => {
            if (j.plataforma.id === idPlataforma ) {
                jogos.push(j);
            }});
        return jogos;
    }

    findByRangeValor(valorMin: number, valorMax: number): Jogo[] {
        var jogos: Jogo[] = [];
        for (let i = 0; i < this.lista.length; i++) {
            if (this.lista[i].valor >= valorMin && this.lista[i].valor <= valorMax) {
                jogos.push(this.lista[i]);
            }
        }
        return jogos;
    }

    findAll(): Object[] {
        return this.lista;
    }
    
    findById(id: number): Jogo {
        return this.lista.find(j => j.id === id) as Jogo;        
    }
    
    save(object: Object): Object{        
        const jogo = object as Jogo;
        if (this.findByTitulo(jogo.titulo)) {
            throw new InvalidAttributeException('Jogo já cadastrado');
        }        
        jogo.id = this.getNewId();
        this.lista.push(jogo);
        return jogo;
    }
    
    update(object: Object): Object{
        const jogo = object as Jogo;
        const jogoTitulo = this.findByTitulo(jogo.titulo);
        if (jogoTitulo != undefined && jogoTitulo.id !== jogo.id) {
            throw new InvalidAttributeException('Novo título informado já cadastrado');
        }        
        this.lista[jogo.id] = jogo; 
        return this.lista[jogo.id];    
    }
    
    delete (id: number): boolean {
        if (id <= 0 || id > this.lista.length) return false;
        this.lista.splice(id, 1);
        return true;
    }   
}



