export class Plataforma{
    private _id: number;    
    private _titulo: string;    

    constructor(id: number, titulo: string){
        if (id <= 0) throw new Error('Id inválido')
        this.id = id;
        if (titulo.length === 0) throw new Error('Título inválido')
        this.titulo = titulo;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get titulo(): string {
        return this._titulo;
    }
    public set titulo(value: string) {
        this._titulo = value;
    }
    
}