import { PlataformaDTO } from "../PlataformaService";
import { CommonServiceInterface } from "./CommonServiceInterface";

export interface JogoServiceInterface<DTO> extends CommonServiceInterface<DTO> {
    findByPlataforma(plataforma: PlataformaDTO): DTO[];
    findByRangeValor(valorMin: number, valorMax: number): DTO[];
    
}