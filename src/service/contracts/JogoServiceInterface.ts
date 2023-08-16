import { PlataformaDTO } from "../PlataformaService";
import { CommonServiceInterface } from "./CommonServiceInterface";

export interface JogoServiceInterface<DTO> extends CommonServiceInterface<DTO> {
    findByPlataforma(idPlataforma: Number): DTO[];
    findByRangeValor(valorMin: number, valorMax: number): DTO[];
    
}