import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface AluguelRepositoryInterface extends CommonRepositoryInterface{
    estenderAluguel(id: number, periodoEmSemanas: number): Object|Error;
    findByUsuario(idUsuario: number): Object[]|Error;
    findByConta(idConta: number): Object[]|Error;
    findByDataAluguelRange(dataInicial: Date, dataFinal: Date): Object[]|Error;
    isContaAvailable(idConta: number): boolean;
}