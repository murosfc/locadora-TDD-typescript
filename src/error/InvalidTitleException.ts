import { DomainError } from "./DomainError";

export class InvalidTitleException extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidTitleException';
    }
}