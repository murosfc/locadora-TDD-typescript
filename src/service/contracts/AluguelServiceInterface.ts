import { CommonServiceInterface } from "./CommonServiceInterface";

export interface AluguelServiceInterface<DTO> extends CommonServiceInterface<DTO> {
    estenderAluguel(id: number, periodoEmSemanas: number): DTO|Error;
    findByUsuario(idUsuario: number): DTO[]|Error;
    findByConta(idConta: number): DTO[]|Error;
    findByDataAluguelRange(dataInicial: Date, dataFinal: Date): DTO[]|Error;
}