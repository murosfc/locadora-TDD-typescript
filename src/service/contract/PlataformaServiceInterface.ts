export interface PlataformaServiceInterface <Plataforma>{
    findAll(): Plataforma[];
    findById(id: number): Plataforma;
    findByTitulo(titulo: string): Plataforma;
    save(plataforma: Plataforma): Plataforma;
    update(plataforma: Plataforma): Plataforma;
    delete(id: number): boolean;    
}