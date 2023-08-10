import { Usuario } from "../../model/Usuario";
import { UsuarioRepositoryInterface } from "../contracts/UsuarioRepositoryInterface";
import { NotAllowedException } from "../../error/NotAllowedException";

export class UsuarioRepository implements UsuarioRepositoryInterface{
    private static soleInstance: UsuarioRepository;
    private lista: Usuario[];

    private constructor(){
        this.lista = [];
    }

    public static getInstance(): UsuarioRepository{
        if (!this.soleInstance){
            this.soleInstance = new UsuarioRepository();
        }
        return this.soleInstance;
    }

    private getNewId(): number{
        return this.lista.length + 1;
    }

    findByEmail(email: string): Usuario{        
        const user = this.lista.find(usuario => usuario.email === email) as Usuario;        
        return user;              
    }

    findByCpf(cpf: string): Usuario {
        return this.lista.find(usuario => usuario.cpf === cpf) as Usuario;
    }
    findAll(): Usuario[] {
        console.log("Quantidade de usuários cadastrados: " +this.lista.length);
        return this.lista;
    }
    findById(id: number): Usuario{
        return this.lista.find(usuario => usuario.id === id) as Usuario;
    }

    findByTitulo(titulo: string): Usuario {
        return this.findByNome(titulo);
    }

    findByNome(nome: string): Usuario {
        return this.lista.find(usuario => usuario.nome == nome) as Usuario;        
    }

    save(usuario: Usuario): Usuario {
        if (this.findByCpf(usuario.cpf)){
            throw new NotAllowedException("CPF já cadastrado");
        }
        if (this.findByEmail(usuario.email)){
            throw new NotAllowedException("E-mail já cadastrado");
        }
        usuario.id = this.getNewId();
        this.lista.push(usuario);
        return usuario;
    }

    update(usuario: Usuario): Usuario {
        const usuarioEmMemoria = this.findById(usuario.id);         
        usuario.cpf = usuarioEmMemoria.cpf;        
        if (usuarioEmMemoria.email != usuario.email){
            if (this.findByEmail(usuario.email)){
                throw new NotAllowedException("Novo e-mail já está em uso por outra conta");
            }
        }
        this.lista[this.lista.findIndex(usuario => usuario.id === usuario.id)] = usuario;
        return usuario;
    }

    delete(id: number): boolean {
        if (this.findById(id)){
            this.lista.splice(this.lista.findIndex(usuario => usuario.id === id), 1);
            return true;
        } 
        return false;
    }
}