import { DomainObject } from "./DomainObject";

export class Usuario extends DomainObject{
    private _nome: string;   
    private _email: string;    
    private _cpf: string;
    private _senha: string;

    constructor(nome: string, email: string, senha: string, cpf: string){
        super();
        if (nome.length === 0) throw new Error('Nome inválido')
        this._nome = nome;
        if (email.length === 0) throw new Error('Email inválido')
        this._email = email;
        if (senha.length === 0) throw new Error('Senha inválida')
        this._senha = senha;
        if (cpf.length === 0) throw new Error('CPF inválido')
        this._cpf = cpf;
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
    
}