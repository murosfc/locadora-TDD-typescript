export abstract class DomainObject {
    protected _id: number;

    constructor(){        
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }    
}