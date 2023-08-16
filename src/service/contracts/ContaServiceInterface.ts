import { CommonServiceInterface } from './CommonServiceInterface';

export interface ContaServiceInterface<DTO> extends CommonServiceInterface<DTO> {
    findByEmail(email: string): DTO|Error;
    findByJogo(jogo: Object): DTO[]|Error;    
}
