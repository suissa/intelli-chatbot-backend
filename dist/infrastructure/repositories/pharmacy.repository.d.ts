import { Farmacia } from '../../domain/entities';
export interface IPharmacyRepository {
    getAllPharmacies(): Promise<Farmacia[]>;
    getPharmacyById(id: string): Promise<Farmacia | null>;
    getPharmacyByCNPJ(cnpj: string): Promise<Farmacia | null>;
    getActivePharmacies(): Promise<Farmacia[]>;
    getPharmaciesByCity(city: string): Promise<Farmacia[]>;
    getPharmaciesByState(state: string): Promise<Farmacia[]>;
    searchPharmacies(term: string): Promise<Farmacia[]>;
    createPharmacy(pharmacy: Partial<Farmacia>): Promise<Farmacia>;
    updatePharmacy(id: string, updates: Partial<Farmacia>): Promise<Farmacia | null>;
    deletePharmacy(id: string): Promise<boolean>;
    activatePharmacy(id: string): Promise<boolean>;
    deactivatePharmacy(id: string): Promise<boolean>;
}
export declare class PharmacyRepository implements IPharmacyRepository {
    private repository;
    constructor();
    getAllPharmacies(): Promise<Farmacia[]>;
    getPharmacyById(id: string): Promise<Farmacia | null>;
    getPharmacyByCNPJ(cnpj: string): Promise<Farmacia | null>;
    getActivePharmacies(): Promise<Farmacia[]>;
    getPharmaciesByCity(city: string): Promise<Farmacia[]>;
    getPharmaciesByState(state: string): Promise<Farmacia[]>;
    searchPharmacies(term: string): Promise<Farmacia[]>;
    createPharmacy(pharmacy: Partial<Farmacia>): Promise<Farmacia>;
    updatePharmacy(id: string, updates: Partial<Farmacia>): Promise<Farmacia | null>;
    deletePharmacy(id: string): Promise<boolean>;
    activatePharmacy(id: string): Promise<boolean>;
    deactivatePharmacy(id: string): Promise<boolean>;
}
//# sourceMappingURL=pharmacy.repository.d.ts.map