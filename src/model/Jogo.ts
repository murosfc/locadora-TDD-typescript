import { Plataforma } from "./Plataforma";

export class Jogo{
    private _id: number;    
    private _titulo: string;    
    private _plataformas: Plataforma[];    
    private _urlImagem: string;   
    DEFAULT_IMAGE_URL = 'https://www.ongames.com.br/imagens/default.jpg';

    constructor(id: number, titulo: string, plataformas: Plataforma[], urlImagem: string){
        if (id <= 0) throw new Error('Id inválido')
        this.id = id;
        if (titulo.length === 0) throw new Error('Título inválido')
        this.titulo = titulo;
        if (plataformas.length === 0) throw new Error('Necessário pelo menos uma plataforma')
        this.plataformas = plataformas; 
        if (urlImagem.length === 0) urlImagem = this.DEFAULT_IMAGE_URL       
        this.urlImagem = urlImagem;
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

    public get plataformas(): Plataforma[] {
        return this._plataformas;
    }
    public set plataformas(value: Plataforma[]) {
        this._plataformas = value;
    }

    public get urlImagem(): string {
        return this._urlImagem;
    }
    public set urlImagem(value: string) {
        this._urlImagem = value;
    }
}