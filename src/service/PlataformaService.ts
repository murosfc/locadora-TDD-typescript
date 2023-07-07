import { PlataformaRepositoryInterface } from "src/repositories/contracts/PlataformaRepositoryInterface";
import { Plataforma } from "../model/Plataforma";
import { PlataformaServiceInterface } from "./contract/PlataformaServiceInterface";

export class PlataformaService implements PlataformaServiceInterface<Plataforma>{
    private repo: PlataformaRepositoryInterface;

    constructor(repo: PlataformaRepositoryInterface){
        this.repo = repo;
    }

    findAll(): Plataforma[] {        
        return this.repo.findAll();
    }

    findById(id: number): Plataforma {
        const plat = this.repo.findById(id);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw plat.message;
    }

    findByTitulo(titulo: string): Plataforma{        
        const plat = this.repo.findByTitulo(titulo);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw plat.message;
    }
    save(plataforma: Plataforma): Plataforma {
        const plat =  this.repo.save(plataforma);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw plat.message;
    }
    update(plataforma: Plataforma): Plataforma {
        const plat =  this.repo.update(plataforma);
        if (plat instanceof Plataforma){
            return plat;
        }
        throw plat.message;
    }
    delete(id: number): boolean {
        return this.repo.delete(id);
    }  

}