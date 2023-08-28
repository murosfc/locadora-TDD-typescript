import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { DomainObject } from "./DomainObject";
import { UsuarioTipoEnum } from "./enum/UsuarioTipoEnum";

export class Usuario extends DomainObject{
    private _nome: string;   
    private _email: string;    
    private _cpf: string;
    private _senha: string;
    private _tipo: string;    
    private _token: string; 

    constructor(nome: string, email: string, senha: string, cpf: string){
        super();
        if (nome.length === 0) throw new InvalidAttributeException('Nome inválido')
        this._nome = nome;
        if (email.length === 0) throw new InvalidAttributeException('Email inválido')
        this._email = email;
        if (senha.length === 0) throw new InvalidAttributeException('Senha inválida')
        this._senha = senha;
        if (cpf.length === 0) throw new InvalidAttributeException('CPF inválido')
        this._cpf = cpf;
        this._tipo = UsuarioTipoEnum.CLIENTE;
    }

    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
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
    
    public get cpf(): string {
        return this._cpf;
    }
    public set cpf(value: string) {
        this._cpf = value;
    }

    public get tipo(): string {
        return this._tipo;
    }
    
    public set tipo(value: string) {
        this._tipo = value;
    }

    public get token(): string {
        return this._token;
    }
    public set token(value: string) {
        this._token = value;
    }
    
}