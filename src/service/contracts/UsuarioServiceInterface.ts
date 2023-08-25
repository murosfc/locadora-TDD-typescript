import { CommonServiceInterface } from "./CommonServiceInterface";

export interface UsuarioServiceInterface<DTO>{
    findAll(): Promise<DTO[]>;
    findById(id: number): Promise<DTO>|Error;   
    save(entity: DTO): Promise<DTO>|Error;
    update(entity: DTO): Promise<DTO>|Error;
    delete(id: number): Promise<boolean>;  
    findByEmail(email: string): Promise<DTO>;
    findByCpf(cpf: string): Promise<DTO>;
}