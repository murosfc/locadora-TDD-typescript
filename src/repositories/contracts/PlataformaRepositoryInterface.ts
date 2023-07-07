import { Plataforma } from "../../model/Plataforma";

export interface PlataformaRepositoryInterface{
    findAll(): Plataforma[];
    findById(id: number): Plataforma | Error;
    findByTitulo(titulo: string): Plataforma | Error;
    save(plataforma: Plataforma): Plataforma | Error;
    update(plataforma: Plataforma): Plataforma | Error;
    delete(id: number): boolean;    
}