import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { Conta } from "./Conta";
import { DomainObject } from "./DomainObject";
import { Usuario } from "./Usuario";

export class Aluguel extends DomainObject{
    private _usuario: Usuario;
    private _contas: Conta[];
    private _dataAluguel: Date;
    private _periodoEmSemanas: number;
    private _desconto: number;
    private _valorTotal: number;
    private _dataFinal: Date;       

    constructor(usuario: Usuario, contas: Conta[], periodoEmSemanas: number, desconto?: number){
        super();
        if (usuario == undefined) throw new InvalidAttributeException('Usuário inválido')
        this._usuario = usuario;
        if (contas.length === 0) throw new InvalidAttributeException('Necessário vincular pelo menos uma conta')
        this._contas = contas;
        if (periodoEmSemanas <= 0) throw new InvalidAttributeException('Período inválido')
        this._periodoEmSemanas = periodoEmSemanas;
        if (desconto) this._desconto = desconto;
        else this._desconto = 0;
        this._dataAluguel = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());  
        this._valorTotal = this.calcularValorTotal();
        this._dataFinal = this.calcularDataFinal();
    }

    public estenderAluguel(periodoEmSemanas: number): void{
        if (periodoEmSemanas <= 0) throw new Error('Período inválido')
        this._periodoEmSemanas += periodoEmSemanas;
        this._valorTotal = this.calcularValorTotal();
        this._dataFinal = this.calcularDataFinal();
    }

    private calcularValorTotal(): number{
        let valorTotal = 0;
        this._contas.forEach(conta => {
            valorTotal += conta.jogos.reduce((total, jogo) => total + jogo.valor, 0);
        });
        valorTotal *= this._periodoEmSemanas;
        valorTotal -= this._desconto;
        return valorTotal;
    }

    private calcularDataFinal(): Date{        
        let now = new Date(this._dataAluguel);        
        let dataFinal = new Date(now.getFullYear(), now.getMonth(), now.getDate());   
        dataFinal.setDate(dataFinal.getDate() + (this._periodoEmSemanas * 7));
        dataFinal.setHours(23, 59, 59, 999);
        return dataFinal;
    }

    public get usuario(): Usuario{
        return this._usuario;
    }

    public get contas(): Conta[]{
        return this._contas;
    }

    public get dataAluguel(): Date{
        return this._dataAluguel;
    }

    public get periodoEmSemanas(): number{
        return this._periodoEmSemanas;
    }

    public get desconto(): number{
        return this._desconto;
    }

    public get valorTotal(): number{
        return this._valorTotal;
    }

    public get dataFinal(): Date{
        return this._dataFinal;
    }
}