import { Jogo } from "src/model/Jogo";
import { ServiceInterface } from "./contract/ServiceInterface";
import { JogoRepo } from "src/repositories/InMemoryRepository/JogoRepo";

export class JogoService implements ServiceInterface<Jogo>{
    private repo: JogoRepo;

    constructor(repo: JogoRepo){
        this.repo = repo;   
    }

    findAll(): Jogo[] {
        const jogos = this.repo.findAll() as Jogo[];
        if(jogos.length === 0) throw new Error('Nenhum jogo cadastrado');
        return jogos;
    }
    findById(id: number): Jogo {
        const jogo = this.repo.findById(id) as Jogo;
        if(!jogo) throw new Error('Jogo não encontrado');
        return jogo;
    }
    findByTitulo(titulo: string): Jogo {
        const jogo = this.repo.findByTitulo(titulo) as Jogo;
        if(!jogo) throw new Error('Jogo não encontrado');
        return jogo;
    }
    save(entity: Jogo): Jogo {
        this.validateJogo(entity, true);        
        return this.repo.save(entity) as Jogo;
    }

    update(entity: Jogo): Jogo {
        this.validateJogo(entity, false);
        return this.repo.update(entity) as Jogo;        
    }

    delete(id: number): boolean {
        const jogo = this.repo.findById(id) as Jogo;
        if(!jogo) return false;
        return this.repo.delete(id);
    }

    private validateJogo(entity: Jogo, save: boolean){
        if (entity.plataformas.length === 0) throw new Error('Jogo deve ter pelo menos uma plataforma');
        if (entity.valor <= 0) throw new Error('Valor deve ser maior que zero');
        if(save) {
            if (this.repo.findById(entity.id) || this.repo.findByTitulo(entity.titulo)) throw new Error('Jogo já cadastrado');            
        } else { 
            if (!this.repo.findById(entity.id)) throw new Error('Jogo não encontrado');
        }         
    }

}