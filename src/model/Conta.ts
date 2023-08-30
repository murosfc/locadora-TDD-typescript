import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { DomainObject } from "./DomainObject";
import { Jogo } from "./Jogo";

export class Conta extends DomainObject{
    private _email: string;    
    private _senha: string;   
    private _jogos: Jogo[];
    private _vezesAlugado: number;    

    constructor(email: string, senha: string, jogos?: Jogo[]){
        super();
        if (email.length === 0) throw new InvalidAttributeException('Email inválido')
        this._email = email;
        if (senha.length === 0) throw new InvalidAttributeException('Senha inválida')
        this._senha = senha;
        if (jogos) this._jogos = jogos;
        else this._jogos = [];
        this._vezesAlugado = 0;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get senha(): string {
        return this._senha;
    }
    public set senha(value: string) {
        this._senha = value;
    }

    public get jogos(): Jogo[] {
        return this._jogos;
    }
    public set jogos(value: Jogo[]) {
        this._jogos = value;
    }
    public get vezesAlugado(): number {
        return this._vezesAlugado;
    }
    public set vezesAlugado(value: number) {
        this._vezesAlugado = value;
    }

}