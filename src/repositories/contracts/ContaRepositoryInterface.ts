import { CommonRepositoryInterface } from "./CommonRepositoryInterface";

export interface ContaRepositoryInterface extends CommonRepositoryInterface {
    findByEmail(email: string): Object;
    findByJogo(jogo: Object): Object[];
}