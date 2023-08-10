import { DomainError } from "./DomainError";

export class NotAllowedException extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'NotAllowedException';
    }
}