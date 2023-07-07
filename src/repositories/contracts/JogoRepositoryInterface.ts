import { Jogo } from "src/model/Jogo";
import { CommonRepositoryInterface } from "./CommonRepositoryInterface";
import { Plataforma } from "src/model/Plataforma";

export interface JogoRepositoryInterface extends CommonRepositoryInterface{
    findByTitulo(titulo: string): Jogo;
    findByPlataforma(plataforma: Plataforma): Jogo[];
    findByRangeValor(valorMin: number, valorMax: number): Jogo[];
}