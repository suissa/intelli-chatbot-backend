import { Remedio } from '../../domain/entities/remedio.entity';
export interface IDrugsRepository {
    getAllDrugs(): Promise<Remedio[]>;
    getDrugById(id: number): Promise<Remedio | null>;
    searchDrugs(term: string): Promise<Remedio[]>;
    getActiveDrugs(): Promise<Remedio[]>;
    updateCorrelatedProducts(remedios: Remedio[], correlacionados: Array<{
        name: string;
        category: string;
        price: number;
    }>): Promise<void>;
}
export declare class DrugsRepository implements IDrugsRepository {
    private repository;
    constructor();
    getAllDrugs(): Promise<Remedio[]>;
    getDrugByName(name: string): Promise<Remedio[]>;
    getDrugById(id: number): Promise<Remedio | null>;
    searchDrugs(term: string): Promise<Remedio[]>;
    updateCorrelatedProducts(remedios: Remedio[], correlacionados: Array<{
        name: string;
        category: string;
        price: number;
    }>): Promise<void>;
    getActiveDrugs(): Promise<Remedio[]>;
}
//# sourceMappingURL=drugs.repository.d.ts.map