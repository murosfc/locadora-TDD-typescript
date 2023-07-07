export interface CommonRepositoryInterface{   
    findAll(): Object[];
    findById(id: number): Object; 
    findByTitulo(titulo: string): Object;   
    save(object: Object): Object;
    update(object: Object): Object;
    delete(id: number): boolean;     
}