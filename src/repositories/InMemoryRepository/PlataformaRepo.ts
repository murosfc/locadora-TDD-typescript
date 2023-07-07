import { Plataforma } from "../../model/Plataforma";
import { PlataformaRepositoryInterface } from "../contracts/PlataformaRepositoryInterface";

export class listaPlataformas implements PlataformaRepositoryInterface{
    private lista: Plataforma[];

    constructor(){
        this.lista =[];
    }
    
    findAll(): Plataforma[]{
        return this.lista;
    }
    
    findById(id: number): Plataforma | Error {
        var plat = this.lista.find(p => p.id === id);
        if(plat instanceof Plataforma){
            return plat;
        }
        return new Error('Plataforma não encontrada');       
    }

    findByTitulo(titulo: string): Plataforma | Error{
        var plat = this.lista.find(p => p.titulo === titulo);
        if(plat instanceof Plataforma){
            return plat;
        }
        return new Error('Plataforma não encontrada'); 
    }

    save(plataforma: Plataforma): Plataforma | Error{ 
        const tempPlat = this.lista.find(p => p.titulo === plataforma.titulo);      
        if (tempPlat instanceof Plataforma){            
            return new Error('Plataforma já cadastrada');
        }
        if (plataforma.id !== undefined) throw new Error('Id em uso');
        plataforma.id = this.getNewId();
        this.lista.push(plataforma);
        return plataforma;       
    }

    update(plataforma: Plataforma): Plataforma | Error {
        if (this.lista.find(p => p.id === plataforma.id) === undefined){
            return new Error('Plataforma não encontrada');
        }
        this.lista.push(plataforma);
        return plataforma; 
    }

    delete(id: number): boolean {
        var plat = this.lista.find(p => p.id === id);
        if(plat instanceof Plataforma){
            this.lista.splice(this.lista.findIndex(p => p.id === id), 1);
            return true;
        }
        return false;        
    }


    private getNewId(): number{
        return this.lista.length + 1;
    }

}