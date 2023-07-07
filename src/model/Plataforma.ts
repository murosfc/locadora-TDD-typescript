import { DomainObject } from "./DomainObject";

export class Plataforma extends DomainObject{       
    private _titulo: string;    

    constructor(titulo: string){  
        super();     
        if (titulo.length === 0) throw new Error('Título inválido')
        this.titulo = titulo;
    }  
      
    public get titulo(): string {
        return this._titulo;
    }
    public set titulo(value: string) {
        this._titulo = value;
    }    
}