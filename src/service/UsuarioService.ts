import { DomainObject } from "../model/DomainObject";
import { UsuarioServiceInterface } from "./contracts/UsuarioServiceInterface";
import { Usuario } from "../model/Usuario";
import { UsuarioRepositoryInterface } from "../repositories/contracts/UsuarioRepositoryInterface";
import { InvalidAttributeException } from "../error/InvalidAttributeException";
import { NotAllowedException } from "../error/NotAllowedException";
import { NotFoundException } from "../error/NotFoundException";
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import auth from '../server';

export class UsuarioDTO extends DomainObject {
    private _nome: string;
    private _email: string;
    private _senha: string;
    private _cpf: string;
    private _token: string;
    private _tipo: string;
   
        
    constructor(nome: string, email: string, senha: string, cpf: string) {
        super();
        this._nome = nome;
        this._email = email;
        this._senha = senha;
        this._cpf = cpf;
        this._token = "";
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
    public get token(): string {
        return this._token;
    }
    public set token(value: string) {
        this._token = value;
    }
    public get tipo(): string {
        return this._tipo;
    }
    public set tipo(value: string) {
        this._tipo = value;
    }

    static dtoToUsuario(dto: UsuarioDTO): Usuario {
        var user = new Usuario(dto.nome, dto.email, dto.senha, dto.cpf);
        user.id = dto.id;
        return user;
    }

    static usuarioToDTO(usuario: Usuario): UsuarioDTO {
        var dto = new UsuarioDTO(usuario.nome, usuario.email, "", "");
        dto.id = usuario.id; 
        dto.tipo = usuario.tipo;
        return dto;
    }

    static usuarioToDTOComToken(usuario: Usuario): UsuarioDTO {
        var dto = new UsuarioDTO(usuario.nome, usuario.email, "", "");
        dto.id = usuario.id;
        dto.tipo = usuario.tipo;
        dto.token = usuario.token;
        return dto;
    }
}

export class UsuarioService implements UsuarioServiceInterface<UsuarioDTO>{
    private repo: UsuarioRepositoryInterface;

    constructor(repo: UsuarioRepositoryInterface) {
        this.repo = repo;
    }

    async findByEmail(email: string): Promise<UsuarioDTO> {
        const user = this.repo.findByEmail(email) as Usuario;
        if (user == undefined || user == null) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }

    async findByCpf(cpf: string): Promise<UsuarioDTO> {
        const user = this.repo.findByCpf(cpf) as Usuario;
        if (!user) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }
    async findAll(): Promise<UsuarioDTO[]> {
        const users = this.repo.findAll() as Usuario[];
        var usersDTO: UsuarioDTO[] = [];
        users.forEach(user => {
            usersDTO.push(UsuarioDTO.usuarioToDTO(user));
        });
        return usersDTO;
    }

    async findById(id: number): Promise<UsuarioDTO> {
        const user = this.repo.findById(id) as Usuario;
        if (user == undefined || user == null) throw new NotFoundException("Usuário não encontrado");
        return UsuarioDTO.usuarioToDTO(user);
    }
    async save(entity: UsuarioDTO): Promise<UsuarioDTO> {
        this.validaUsuario(entity, true);
        const user = UsuarioDTO.dtoToUsuario(entity);
        const saltRounds = 10;
        user.senha = await bcrypt.hash(user.senha, saltRounds);
        const savedUser = this.repo.save(user) as Usuario;
        return UsuarioDTO.usuarioToDTO(savedUser);
    }
    async update(entity: UsuarioDTO): Promise<UsuarioDTO> {
        this.validaUsuario(entity, false);
        const updatedUser = this.repo.update(entity) as Usuario;
        return UsuarioDTO.usuarioToDTO(updatedUser);
    }
    async delete(id: number): Promise<boolean> {
        return this.repo.delete(id);
    }

    private validaUsuario(entity: UsuarioDTO, save: boolean) {
        if (entity.nome.length <= 0 || entity.nome == undefined) throw new InvalidAttributeException("Nome inválido");
        if (entity.email.length <= 0 || entity.email == undefined) throw new InvalidAttributeException("e-mail inválido");
        if (save) {
            if (entity.senha.length <= 0 || entity.senha == undefined) throw new InvalidAttributeException("Senha inválida");
            if (entity.cpf.length <= 0 || entity.cpf == undefined) throw new InvalidAttributeException("CPF inválido");
            if (entity.id > 0) throw new NotAllowedException("Novo usuário não pode te id informada");
            if (this.repo.findByCpf(entity.cpf)) throw new NotAllowedException("CPF já cadastrado");
            if (this.repo.findByEmail(entity.email)) throw new NotAllowedException("e-mail informado já está em uso");
        } else if (entity.id <= 0) throw new NotAllowedException("Tentativa de atualização de usuário com id inválida");
    }

    async login(email: string, senha: string): Promise<UsuarioDTO> {
        const user = this.repo.findByEmail(email) as Usuario;
        if (user == undefined || user == null) throw new NotFoundException("Usuário não encontrado");
        console.log("Senha bd: " + user.senha + " Senha informada: " + senha);
        if (bcrypt.compareSync(senha, user.senha)) {
            user.token = (await this.gerarToken(user)).token;
            return UsuarioDTO.usuarioToDTOComToken(user);
        } else {
            throw new NotAllowedException("Senha inválida");
        }
    }

    private async gerarToken(user: Usuario): Promise<{ token: string }> {
        const auth = {
            secret: String(process.env.SECRET),
            expires: '24h',
          };
        const token = await sign(
            {
                id: user.id,
                agora: Date.now(),
                name: user.cpf,
            },
            auth.secret,
            {
                expiresIn: auth.expires,
            }
        );    
        return { token }; 
    }
    

    
}