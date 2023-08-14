import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface PlataformaRepositoryInterface extends CommonRepositoryInterface{  
    findByTitulo(titulo: string): Object;    
}