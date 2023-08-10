import { DomainError } from "./DomainError";

export class InvalidAttributeException extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidAttributeException';
    }    
}