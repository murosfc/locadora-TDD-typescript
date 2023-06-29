import { Plataforma } from "./Plataforma";

export class Jogo{       
    private _titulo: string;    
    private _plataformas: Plataforma[];    
    private _urlImagem: string;  
    private _valor: number;     
    DEFAULT_IMAGE_URL = 'https://www.ongames.com.br/imagens/default.jpg';

    constructor(titulo: string, plataformas: Plataforma[], valor: number, urlImagem: string){        
        if (titulo.length === 0) throw new Error('Título inválido')
        this.titulo = titulo;
        if (plataformas.length === 0) throw new Error('Necessário vincular pelo menos uma plataforma')
        this.plataformas = plataformas; 
        if(valor <= 0) throw new Error('Valor inválido')
        this.valor = valor;
        if (urlImagem.length === 0) urlImagem = this.DEFAULT_IMAGE_URL       
        this.urlImagem = urlImagem;
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

    public get valor(): number {
        return this._valor;
    }
    public set valor(value: number) {
        this._valor = value;
    }

    public get urlImagem(): string {
        return this._urlImagem;
    }
    public set urlImagem(value: string) {
        this._urlImagem = value;
    }
}