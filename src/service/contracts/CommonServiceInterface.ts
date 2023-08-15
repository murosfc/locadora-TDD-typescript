export interface CommonServiceInterface <DTO> {
    findAll(): DTO[];
    findById(id: number): DTO|Error;   
    save(entity: DTO): DTO|Error;
    update(entity: DTO): DTO|Error;
    delete(id: number): boolean;  
}