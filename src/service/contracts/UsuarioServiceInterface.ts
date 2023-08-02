import { CommonServiceInterface } from "./CommonServiceInterface";

export interface UsuarioServiceInterface<DTO> extends CommonServiceInterface<DTO>{
    findByEmail(email: string): DTO;
    findByCpf(cpf: string): DTO;
}