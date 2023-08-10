import { DomainError } from "./DomainError";

export class NotFoundException extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundException";
    }
}