import { Remedio } from '../../domain/entities/remedio.entity';
export interface DrugsRepository {
    getAllDrugs(): Promise<Remedio[]>;
    getDrugById(id: number): Promise<Remedio | null>;
    searchDrugs(term: string): Promise<Remedio[]>;
    getActiveDrugs(): Promise<Remedio[]>;
}
export declare class DrugsRepositoryImpl implements DrugsRepository {
    private repository;
    constructor();
    getAllDrugs(): Promise<Remedio[]>;
    getDrugById(id: number): Promise<Remedio | null>;
    searchDrugs(term: string): Promise<Remedio[]>;
    getActiveDrugs(): Promise<Remedio[]>;
}
//# sourceMappingURL=drugs.repository.d.ts.map