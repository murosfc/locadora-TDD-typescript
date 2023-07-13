import { CommonServiceInterface } from "./CommonServiceInterface";

export interface PlataformaServiceInterface<DTO> extends CommonServiceInterface<DTO>{   
    findByTitulo(titulo: string): DTO;   
}