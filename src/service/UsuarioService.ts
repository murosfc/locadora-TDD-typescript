import { DomainObject } from "../model/DomainObject";
import { UsuarioServiceInterface } from "./contracts/UsuarioServiceInterface";
import { Usuario } from "../model/Usuario";
import { UsuarioRepositoryInterface } from "../repositories/contracts/UsuarioRepositoryInterface";
import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { NotAllowedException } from "../error/NotAllowedException";
import { NotFoundException } from "../error/NotFoundException";

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
        const user = this.repo.findByEmail(email) as Usuario;
        if (!user) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }

    findByCpf(cpf: string): UsuarioDTO {
        const user = this.repo.findByCpf(cpf) as Usuario;
        if (!user) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }
    findAll(): UsuarioDTO[] {
        const users = this.repo.findAll() as Usuario[];
        var usersDTO: UsuarioDTO[] = [];
        users.forEach(user => {
            usersDTO.push(UsuarioDTO.usuarioToDTO(user));
        });
        return usersDTO;
    }

    findById(id: number): UsuarioDTO {
        const user = this.repo.findById(id) as Usuario;
        if (!user) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }

    save(entity: UsuarioDTO): UsuarioDTO {
        this.validaUsuario(entity, true);
        const user = UsuarioDTO.dtoToUsuario(entity);
        const savedUser = this.repo.save(user) as Usuario;
        return UsuarioDTO.usuarioToDTO(savedUser);
    }
    update(entity: UsuarioDTO): UsuarioDTO {
        this.validaUsuario(entity, false);
        const user = UsuarioDTO.dtoToUsuario(entity);
        const updatedUser = this.repo.update(entity) as Usuario;
        return UsuarioDTO.usuarioToDTO(updatedUser);
    }
    delete(id: number): boolean {
        return this.repo.delete(id);
    }

    private validaUsuario(entity: UsuarioDTO, save: boolean){
        if (entity.nome.length <= 0 || entity.nome == undefined) throw new InvalidAttributeException("Nome inválido");
        if (entity.email.length <=0 || entity.email == undefined) throw new InvalidAttributeException("e-mail inválido");
        if (entity.cpf.length <=0 || entity.cpf == undefined) throw new InvalidAttributeException("CPF inválido");
        if (save && entity.id >0) throw new NotAllowedException("Novo usuário não pode te id informada");
        if (save && this.repo.findByCpf(entity.cpf)) throw new NotAllowedException("CPF já cadastrado");
        if (save && this.repo.findByEmail(entity.email)) throw new NotAllowedException("e-mail informado já está em uso");
        if (!save && entity.id<=0) throw new NotAllowedException("Tentativa de atualização de usuário com id inválida");
    }

}