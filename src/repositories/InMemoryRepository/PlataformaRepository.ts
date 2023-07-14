import { Plataforma } from "../../model/Plataforma";
import { PlataformaRepositoryInterface } from "../contracts/PlataformaRepositoryInterface";

export class PlataformaRepository implements PlataformaRepositoryInterface {
    private lista: Plataforma[];
    static soleInstance: PlataformaRepository;

    private constructor() {
        this.lista = [];
    }

    static getInstance(): PlataformaRepository {
        if (!this.soleInstance) {
            this.soleInstance = new PlataformaRepository();            
        }
        return this.soleInstance;
    }

    findAll(): Plataforma[] {
        return this.lista;
    }

    findById(id: number): Plataforma {
        return this.lista.find(p => p.id === id) as Plataforma;
    }

    findByTitulo(titulo: string): Plataforma {
        return this.lista.find(p => p.titulo === titulo) as Plataforma;
    }

    save(plataforma: Plataforma): Plataforma {
        plataforma.id = this.getNewId();
        this.lista.push(plataforma);
        return plataforma;
    }

    update(plataforma: Plataforma): Plataforma {
        const plat = this.lista.find(p => p.id === plataforma.id);
        return this.lista[this.lista.findIndex(p => p.id === plataforma.id)] = plataforma;
    }

    delete(id: number): boolean {
        var plat = this.lista.find(p => p.id === id);
        if (plat instanceof Plataforma) {
            this.lista.splice(this.lista.findIndex(p => p.id === id), 1);
            return true;
        }  
        return false;      
    }

    private getNewId(): number {
        return this.lista.length + 1;
    }

}