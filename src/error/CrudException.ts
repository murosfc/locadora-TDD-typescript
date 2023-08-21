import { DomainError } from "./DomainError";

export class CrudException extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'CrudException';
    }
}