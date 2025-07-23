import { injectable } from 'inversify';
import { Repository } from 'typeorm';
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

@injectable()
export class PharmacyRepository implements IPharmacyRepository {
  private repository: Repository<Farmacia>;

  constructor() {
    // TODO: Inject DataSource and get repository
    this.repository = {} as Repository<Farmacia>;
  }

  async getAllPharmacies(): Promise<Farmacia[]> {
    try {
      return await this.repository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching all pharmacies:', error);
      throw new Error('Failed to fetch pharmacies');
    }
  }

  async getPharmacyById(id: string): Promise<Farmacia | null> {
    try {
      return await this.repository.findOne({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching pharmacy by ID:', error);
      throw new Error('Failed to fetch pharmacy');
    }
  }

  async getPharmacyByCNPJ(cnpj: string): Promise<Farmacia | null> {
    try {
      return await this.repository.findOne({
        where: { cnpj }
      });
    } catch (error) {
      console.error('Error fetching pharmacy by CNPJ:', error);
      throw new Error('Failed to fetch pharmacy by CNPJ');
    }
  }

  async getActivePharmacies(): Promise<Farmacia[]> {
    try {
      return await this.repository.find({
        where: { ativo: true },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching active pharmacies:', error);
      throw new Error('Failed to fetch active pharmacies');
    }
  }

  async getPharmaciesByCity(city: string): Promise<Farmacia[]> {
    try {
      return await this.repository.find({
        where: { cidade: city },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching pharmacies by city:', error);
      throw new Error('Failed to fetch pharmacies by city');
    }
  }

  async getPharmaciesByState(state: string): Promise<Farmacia[]> {
    try {
      return await this.repository.find({
        where: { estado: state },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching pharmacies by state:', error);
      throw new Error('Failed to fetch pharmacies by state');
    }
  }

  async searchPharmacies(term: string): Promise<Farmacia[]> {
    try {
      return await this.repository
        .createQueryBuilder('pharmacy')
        .where('pharmacy.nome ILIKE :term', { term: `%${term}%` })
        .orWhere('pharmacy.cidade ILIKE :term', { term: `%${term}%` })
        .orWhere('pharmacy.estado ILIKE :term', { term: `%${term}%` })
        .orderBy('pharmacy.created_at', 'DESC')
        .getMany();
    } catch (error) {
      console.error('Error searching pharmacies:', error);
      throw new Error('Failed to search pharmacies');
    }
  }

  async createPharmacy(pharmacy: Partial<Farmacia>): Promise<Farmacia> {
    try {
      const newPharmacy = this.repository.create(pharmacy);
      return await this.repository.save(newPharmacy);
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      throw new Error('Failed to create pharmacy');
    }
  }

  async updatePharmacy(id: string, updates: Partial<Farmacia>): Promise<Farmacia | null> {
    try {
      const result = await this.repository.update(id, updates);
      if (result.affected === 0) {
        return null;
      }
      return await this.getPharmacyById(id);
    } catch (error) {
      console.error('Error updating pharmacy:', error);
      throw new Error('Failed to update pharmacy');
    }
  }

  async deletePharmacy(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
      throw new Error('Failed to delete pharmacy');
    }
  }

  async activatePharmacy(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { ativo: true });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error activating pharmacy:', error);
      throw new Error('Failed to activate pharmacy');
    }
  }

  async deactivatePharmacy(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { ativo: false });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deactivating pharmacy:', error);
      throw new Error('Failed to deactivate pharmacy');
    }
  }
} 