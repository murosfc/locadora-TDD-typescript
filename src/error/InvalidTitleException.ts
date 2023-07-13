export class InvalidTitleException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidTitleException';
    }
}