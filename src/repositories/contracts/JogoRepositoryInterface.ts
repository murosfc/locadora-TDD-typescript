import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface JogoRepositoryInterface extends CommonRepositoryInterface{    
    findByPlataforma(idPlataforma: Number): Object[];
    findByRangeValor(valorMin: number, valorMax: number): Object[];
    findByTitulo(titulo: string): Object;
}