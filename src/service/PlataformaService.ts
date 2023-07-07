import { PlataformaRepositoryInterface } from "src/repositories/contracts/PlataformaRepositoryInterface";
import { Plataforma } from "../model/Plataforma";

export class PlataformaService implements PlataformaRepositoryInterface{
    private repo: PlataformaRepositoryInterface;

    constructor(repo: PlataformaRepositoryInterface){
        this.repo = repo;
    }

    findAll(): Plataforma[] {        
        return this.repo.findAll() as Plataforma[];
    }

    findById(id: number): Plataforma {
        const plat = this.repo.findById(id);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw new Error("Plataforma não encontrada");
    }

    findByTitulo(titulo: string): Plataforma{        
        const plat = this.repo.findByTitulo(titulo);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw new Error("Plataforma não encontrada");
    }

    save(entity: Plataforma): Plataforma {
        this.validaPlataforma(entity, true);
        return this.repo.save(entity) as Plataforma;        
    }

    update(entity: Plataforma): Plataforma {
        this.validaPlataforma(entity, false);
        return this.repo.update(entity) as Plataforma;
    }

    delete(id: number): boolean {        
        return this.repo.delete(id);
    }  

    private validaPlataforma(entity: Plataforma, save: boolean){        
        if (entity.titulo.length <=0 ) throw new Error("Título inválido");
        if (save) {
            if (this.repo.findByTitulo(entity.titulo) || this.repo.findById(entity.id)) throw new Error("Plataforma já cadastrada");
        }
        else if (!this.repo.findById(entity.id)) throw new Error("Plataforma não encontrada");
    }

}

