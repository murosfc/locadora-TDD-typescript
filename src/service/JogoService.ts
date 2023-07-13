import { Jogo } from "../model/Jogo";
import { JogoServiceInterface } from "./contract/JogoServiceInterface";
import { DomainObject } from "../model/DomainObject";
import { PlataformaDTO } from "./PlataformaService";
import { NotFoundException } from "../error/NotFoundException";
import { Plataforma } from "../model/Plataforma";
import { NotAllowedException } from "../error/NotAllowedException";
import { JogoRepositoryInterface } from "../repositories/contracts/JogoRepositoryInterface";
import { InvalidTitleException } from "../error/InvalidTitleException";

export class JogoDTO extends DomainObject{
    
    titulo: string;
    plataformas: PlataformaDTO[];
    valor: number;
    urlImagem: string;       
    DEFAULT_IMAGE_URL = 'https://www.ongames.com.br/imagens/default.jpg';
    
    constructor(titulo: string, plataformas: PlataformaDTO[], valor: number, urlImagem: string){ 
        super();
        this.titulo = titulo;
        this.plataformas = plataformas;
        this.valor = valor;
        this.urlImagem = urlImagem.length == 0 ? this.DEFAULT_IMAGE_URL : urlImagem;
    }

    static jogoToDTO(jogo: Jogo): JogoDTO {
        var jogoDTO = new JogoDTO(jogo.titulo, jogo.plataformas, jogo.valor, jogo.urlImagem);
        jogoDTO.id = jogo.id;
        return jogoDTO;
    }

    static dtoToJogo(jogoDTO: JogoDTO): Jogo {
        var plataformas: Plataforma[] =[];
        jogoDTO.plataformas.forEach(plat => {
            plataformas.push(PlataformaDTO.dtoToPlataforma(plat));
        });
        var jogo = new Jogo(jogoDTO.titulo, plataformas , jogoDTO.valor, jogoDTO.urlImagem);
        jogo.id = jogoDTO.id;
        return jogo;
    }
}

export class JogoService implements JogoServiceInterface<JogoDTO>{
    private repo: JogoRepositoryInterface;

    constructor(repo: JogoRepositoryInterface){
        this.repo = repo;   
    }

    findByPlataforma(plataforma: PlataformaDTO): JogoDTO[] {
        const plat = PlataformaDTO.dtoToPlataforma(PlataformaDTO.dtoToPlataforma(plataforma));
        const jogos = this.repo.findByPlataforma(plat) as Jogo[];        
        if(jogos.length === 0) throw new NotFoundException('Nenhum jogo encontrado para a plataforma informada');
        var jogosDTO: JogoDTO[] = [];
        jogos.forEach(jogo => {
            jogosDTO.push(JogoDTO.jogoToDTO(jogo));
        });
        return jogosDTO;
    }

    findByRangeValor(valorMin: number, valorMax: number): JogoDTO[] {
        const jogos = this.repo.findByRangeValor(valorMin, valorMax) as Jogo[];
        if(jogos.length === 0) throw new NotFoundException('Nenhum jogo encontrado para o range de valor informado');
        var jogosDTO: JogoDTO[] = [];
        jogos.forEach(jogo => {
            jogosDTO.push(JogoDTO.jogoToDTO(jogo));
        });
        return jogosDTO;
    }

    findAll(): JogoDTO[] {
        const jogos = this.repo.findAll() as Jogo[];        
        var jogosDTO: JogoDTO[] = [];
        jogos.forEach(jogo => {
            jogosDTO.push(JogoDTO.jogoToDTO(jogo));
        });
        return jogosDTO;
    }

    findById(id: number): JogoDTO {
        const jogo = this.repo.findById(id) as Jogo;
        if(!jogo) throw new NotFoundException('Jogo não encontrado');
        return JogoDTO.jogoToDTO(jogo);
    }

    findByTitulo(titulo: string): JogoDTO {
        const jogo = this.repo.findByTitulo(titulo) as Jogo;
        if(!jogo) throw new NotFoundException('Jogo não encontrado');
        return JogoDTO.jogoToDTO(jogo);
    }

    save(entity: JogoDTO): JogoDTO {
        this.validateJogo(entity, true); 
        const jogo = JogoDTO.dtoToJogo(entity);
        const jogoSalvo = this.repo.save(jogo) as Jogo;       
        return JogoDTO.jogoToDTO(jogoSalvo);
    }

    update(entity: JogoDTO): JogoDTO {
        this.validateJogo(entity, false);
        const jogo = JogoDTO.dtoToJogo(entity);
        const jogoAtualizado = this.repo.update(jogo) as Jogo;
        return JogoDTO.jogoToDTO(jogoAtualizado);      
    }

    delete(id: number): boolean {        
        return this.repo.delete(id);        
    }

    private validateJogo(entity: JogoDTO, save: boolean){
        if (entity.plataformas.length === 0) throw new NotAllowedException('Jogo deve ter pelo menos uma plataforma');
        if (entity.valor <= 0) throw new NotAllowedException('Valor deve ser maior que zero');
        if (entity.titulo.length === 0) throw new InvalidTitleException('Título inválido')
        if(save) {
            if (this.repo.findById(entity.id) || this.repo.findByTitulo(entity.titulo)) throw new NotAllowedException('Jogo já cadastrado');            
        } else { 
            if (!this.repo.findById(entity.id)) throw new NotFoundException('Jogo não encontrado');
        }         
    }

}