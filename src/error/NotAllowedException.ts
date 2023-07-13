export class NotAllowedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotAllowedException';
    }
}