import { Jogo } from "src/model/Jogo";
import { JogoRepositoryInterface } from "../contracts/JogoRepositoryInterface";
import { Plataforma } from "src/model/Plataforma";


export class JogoRepo implements JogoRepositoryInterface {  
    private lista: Jogo[];
    static soleInstance: JogoRepo;

    private constructor() {
        this.lista = [];
    }

    static getInstance(): JogoRepositoryInterface {
        if (!this.soleInstance) {
            this.soleInstance = new JogoRepo();
        }
        return this.soleInstance;
    }

    private getNewId(): number {
        return this.lista.length + 1;
    }

    findByTitulo(titulo: string): Jogo {
        return this.lista.find(j => j.titulo === titulo) as Jogo;
    }

    findByPlataforma(plataforma: Plataforma): Jogo[] {
        var jogos: Jogo[] = [];
        for (let i = 0; i < this.lista.length; i++) {
            for (let j = 0; j < this.lista[i].plataformas.length; j++) {
                if (this.lista[i].plataformas[j] === plataforma) {
                    jogos.push(this.lista[i]);
                    j = this.lista[i].plataformas.length;
                }
            }
        }
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
        jogo.id = this.getNewId();
        this.lista.push(jogo);
        return jogo;
    }
    
    update(object: Object): Object{
        const jogo = object as Jogo;        
        this.lista[jogo.id] = jogo; 
        return this.lista[jogo.id];    
    }
    
    delete (id: number): boolean {
        if (id < 0 || id > this.lista.length) return false;
        this.lista.splice(id, 1);
        return true;
    }   
}



