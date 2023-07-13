export interface CommonServiceInterface <DTO> {
    findAll(): DTO[];
    findById(id: number): DTO;   
    save(entity: DTO): DTO;
    update(entity: DTO): DTO;
    delete(id: number): boolean;  
}