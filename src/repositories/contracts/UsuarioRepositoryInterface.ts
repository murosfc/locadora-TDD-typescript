import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface UsuarioRepositoryInterface extends CommonRepositoryInterface{
    findByEmail(email: string): Object;
    findByCpf(cpf: string): Object;
    findByNome(nome: string): Object;
    getUserByToken(token: string): Object;
}