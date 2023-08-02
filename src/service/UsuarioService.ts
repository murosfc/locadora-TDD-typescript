import { DomainObject } from "../model/DomainObject";
import { UsuarioServiceInterface } from "./contracts/UsuarioServiceInterface";
import { Usuario } from "../model/Usuario";
import { UsuarioRepositoryInterface } from "../repositories/contracts/UsuarioRepositoryInterface";

export class UsuarioDTO extends DomainObject{
    private _nome: string;  
    private _email: string;    
    private _senha: string;    
    private _cpf: string;    

    constructor(nome: string, email: string, senha: string, cpf: string){
        super();
        this._nome = nome;
        this._email = email;
        this._senha = senha;
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

    static dtoToUsuario(dto: UsuarioDTO): Usuario{
        var user = new Usuario(dto.nome, dto.email, dto.senha, dto.cpf);
        user.id = dto.id; 
        return user;
    }

    static usuarioToDTO(usuario: Usuario): UsuarioDTO{
        var dto = new UsuarioDTO(usuario.nome, usuario.email, "", "");
        dto.id = usuario.id;
        return dto;
    }
}

export class UsuarioService implements UsuarioServiceInterface<UsuarioDTO>{
    private repo: UsuarioRepositoryInterface;

    constructor(repo: UsuarioRepositoryInterface){
        this.repo = repo;
    }

    findByEmail(email: string): UsuarioDTO {
        throw new Error("Method not implemented.");
    }
    findByCpf(cpf: string): UsuarioDTO {
        throw new Error("Method not implemented.");
    }
    findAll(): UsuarioDTO[] {
        throw new Error("Method not implemented.");
    }
    findById(id: number): UsuarioDTO {
        throw new Error("Method not implemented.");
    }
    save(entity: UsuarioDTO): UsuarioDTO {
        const user = UsuarioDTO.dtoToUsuario(entity);
        const savedUser = this.repo.save(user) as Usuario;
        return UsuarioDTO.usuarioToDTO(savedUser);
    }
    update(entity: UsuarioDTO): UsuarioDTO {
        throw new Error("Method not implemented.");
    }
    delete(id: number): boolean {
        throw new Error("Method not implemented.");
    }

}