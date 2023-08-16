import { InvalidTitleException } from "../error/InvalidTitleException";
import { DomainObject } from "./DomainObject";
import { Plataforma } from "./Plataforma";
import { NotAllowedException } from "../error/NotAllowedException";

export class Jogo extends DomainObject{       
    private _titulo: string;    
    private _plataforma: Plataforma;    
    private _urlImagem: string;  
    private _valor: number;     
    DEFAULT_IMAGE_URL = 'https://www.ongames.com.br/imagens/default.jpg';

    constructor(titulo: string, plataforma: Plataforma, valor: number, urlImagem: string){     
        super();   
        if (titulo.length === 0) throw new InvalidTitleException('Título inválido')
        this.titulo = titulo;
        if (plataforma == undefined) throw new NotAllowedException('Necessário vincular uma plataforma')
        this.plataforma = plataforma; 
        if(valor <= 0) throw new NotAllowedException('Valor deve ser maior que zero')
        this.valor = valor;
        this.urlImagem = urlImagem.length == 0 ? this.DEFAULT_IMAGE_URL : urlImagem;
    }

    public get titulo(): string {
        return this._titulo;
    }
    public set titulo(value: string) {
        this._titulo = value;
    }

    public get plataforma(): Plataforma {
        return this._plataforma;
    }
    public set plataforma(value: Plataforma) {
        this._plataforma = value;
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