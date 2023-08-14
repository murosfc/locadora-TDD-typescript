import { ContaServiceInterface } from '../service/contracts/ContaServiceInterface';

export class ContaDTO {
    id: number;
    nome: string;
    email: string;
    senha: string;
    jogos: Object[];
}

export class ContaService implements ContaServiceInterface<ContaDTO>{

    save(entity: ContaDTO): ContaDTO {
        throw new Error('Method not implemented.');
    }
    update(entity: ContaDTO): ContaDTO {
        throw new Error('Method not implemented.');
    }
    delete(id: number): boolean {
        throw new Error('Method not implemented.');
    }
    findByEmail(email: string): ContaDTO | Error {
        throw new Error('Method not implemented.');
    }
    findByJogo(jogo: Object): ContaDTO[] {
        throw new Error('Method not implemented.');
    }
    findAll(): ContaDTO[] {
        throw new Error('Method not implemented.');
    }
    findById(id: number): ContaDTO {
        throw new Error('Method not implemented.');
    }
    

}