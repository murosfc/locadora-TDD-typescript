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
        if (usuario == null) throw new Error('Usuário inválido')
        this._usuario = usuario;
        if (contas.length === 0) throw new Error('Necessário vincular pelo menos uma conta')
        this._contas = contas;
        if (periodoEmSemanas <= 0) throw new Error('Período inválido')
        this._periodoEmSemanas = periodoEmSemanas;
        if (desconto) this._desconto = desconto;
        else this._desconto = 0;
        this._dataAluguel = new Date();
        this._valorTotal = this.calcularValorTotal(this._contas, this._periodoEmSemanas, this._desconto);
        this._dataFinal = this.calcularDataFinal(this._dataAluguel, this._periodoEmSemanas);
    }

    private calcularValorTotal(contas: Conta[], periodoEmSemanas: number, desconto: number): number{
        let valorTotal = 0;
        contas.forEach(conta => {
            valorTotal += conta.jogos.reduce((total, jogo) => total + jogo.valor, 0);
        });
        valorTotal *= periodoEmSemanas;
        valorTotal -= valorTotal * desconto;
        return valorTotal;
    }

    private calcularDataFinal(dataAluguel: Date, periodoEmSemanas: number): Date{
        let dataFinal = new Date(dataAluguel);
        dataFinal.setDate(dataFinal.getDate() + (periodoEmSemanas * 7));
        return dataFinal;
    }

}