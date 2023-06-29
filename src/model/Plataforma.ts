export class Plataforma{
    private id: number;
    private titulo: string;

    constructor(id: number, titulo: string){
        if (id <= 0) throw new Error('Id inválido')
        this.id = id;
        if (titulo.length === 0) throw new Error('Título inválido')
        this.titulo = titulo;
    }

    getId(): number{    
        return this.id;
    }

    getTitulo(): string{    
        return this.titulo;
    }

    setId(id: number): void{    
        this.id = id;
    }

    setTitulo(titulo: string): void{
        this.titulo = titulo;
    }
}