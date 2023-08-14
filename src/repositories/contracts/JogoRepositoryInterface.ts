import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface JogoRepositoryInterface extends CommonRepositoryInterface{    
    findByPlataforma(plataforma: Object): Object[];
    findByRangeValor(valorMin: number, valorMax: number): Object[];
    findByTitulo(titulo: string): Object;
}