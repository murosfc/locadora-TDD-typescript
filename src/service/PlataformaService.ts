import {PlataformaServiceInterface} from "./contracts/PlataformaServiceInterface";
import { Plataforma } from "../model/Plataforma";
import { PlataformaRepositoryInterface } from "src/repositories/contracts/PlataformaRepositoryInterface";
import { NotFoundException } from "../error/NotFoundException";
import { InvalidTitleException } from "../error/InvalidTitleException";
import { NotAllowedException } from "../error/NotAllowedException";
import { DomainObject } from "../model/DomainObject";

export class PlataformaDTO extends DomainObject{      
    titulo: string;    
    constructor(titulo: string){
        super();
        this.titulo = titulo;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    static plataformaToDTO(plataforma: Plataforma): PlataformaDTO{
        var dto = new PlataformaDTO(plataforma.titulo);
        dto.id = plataforma.id;
        return dto;
    }

    static dtoToPlataforma(plataformaDTO: PlataformaDTO): Plataforma{
        var plataforma = new Plataforma(plataformaDTO.titulo);
        plataforma.id = plataformaDTO.id;
        return plataforma;       
    }
}

export class PlataformaService implements PlataformaServiceInterface<PlataformaDTO>{
    private repo: PlataformaRepositoryInterface;

    constructor(repo: PlataformaRepositoryInterface){
        this.repo = repo;
    }

    findAll(): PlataformaDTO[] {        
        var allPlataformas =  this.repo.findAll() as Plataforma[];
        var allPlataformasDTO: PlataformaDTO[] = [];
        allPlataformas.forEach(plat => {
            allPlataformasDTO.push(PlataformaDTO.plataformaToDTO(plat));
        });
        return allPlataformasDTO;
    }

    findById(id: number): PlataformaDTO {
        const plat = this.repo.findById(id);
        if (plat instanceof Plataforma){
            return PlataformaDTO.plataformaToDTO(plat);
        }
        throw new NotFoundException("Plataforma não encontrada");
    }

    findByTitulo(titulo: string): PlataformaDTO{        
        const plat = this.repo.findByTitulo(titulo);
        if (plat instanceof Plataforma){
            return PlataformaDTO.plataformaToDTO(plat);;
        }
        throw new NotFoundException("Plataforma não encontrada");
    }

    save(entity: PlataformaDTO): PlataformaDTO {
        this.validaPlataforma(entity, true); 
        var plat = PlataformaDTO.dtoToPlataforma(entity);
        var platSaida = this.repo.save(plat) as Plataforma;      
        return PlataformaDTO.plataformaToDTO(platSaida);        
    }

    update(entity: PlataformaDTO): PlataformaDTO {
        this.validaPlataforma(entity, false);
        var plat = PlataformaDTO.dtoToPlataforma(entity);
        var platSaida = this.repo.update(plat) as Plataforma; 
        return PlataformaDTO.plataformaToDTO(platSaida);
    }

    delete(id: number): boolean {        
        return this.repo.delete(id);
    }  

    private validaPlataforma(entity: PlataformaDTO, save: boolean){        
        if (entity.titulo.length <=0 ) throw new InvalidTitleException("Título inválido");
        if (save) {
            if (this.repo.findByTitulo(entity.titulo) || this.repo.findById(entity.id)) throw new NotAllowedException("Plataforma já cadastrada");
        }
        else if (!this.repo.findById(entity.id)) throw new NotFoundException("Plataforma não encontrada");
    }    

}

