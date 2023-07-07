export interface ServiceInterface <Entity>{
    findAll(): Entity[];
    findById(id: number): Entity;
    findByTitulo(titulo: string): Entity;
    save(entity: Entity): Entity;
    update(entity: Entity): Entity;
    delete(id: number): boolean;    
}