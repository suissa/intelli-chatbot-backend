import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Atendente, VozAtendente, PerfilAtendente } from '../../domain/entities';

export interface IAttendantRepository {
  getAllAttendants(): Promise<Atendente[]>;
  getAttendantById(id: string): Promise<Atendente | null>;
  getAttendantsByPharmacy(pharmacyId: string): Promise<Atendente[]>;
  getActiveAttendants(): Promise<Atendente[]>;
  getAttendantsByVoice(voice: VozAtendente): Promise<Atendente[]>;
  getAttendantsByProfile(profile: PerfilAtendente): Promise<Atendente[]>;
  createAttendant(attendant: Partial<Atendente>): Promise<Atendente>;
  updateAttendant(id: string, updates: Partial<Atendente>): Promise<Atendente | null>;
  deleteAttendant(id: string): Promise<boolean>;
  activateAttendant(id: string): Promise<boolean>;
  deactivateAttendant(id: string): Promise<boolean>;
}

@injectable()
export class AttendantRepository implements IAttendantRepository {
  private repository: Repository<Atendente>;

  constructor() {
    // TODO: Inject DataSource and get repository
    this.repository = {} as Repository<Atendente>;
  }

  async getAllAttendants(): Promise<Atendente[]> {
    try {
      return await this.repository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching all attendants:', error);
      throw new Error('Failed to fetch attendants');
    }
  }

  async getAttendantById(id: string): Promise<Atendente | null> {
    try {
      return await this.repository.findOne({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching attendant by ID:', error);
      throw new Error('Failed to fetch attendant');
    }
  }

  async getAttendantsByPharmacy(pharmacyId: string): Promise<Atendente[]> {
    try {
      return await this.repository.find({
        where: { farmacia_id: pharmacyId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendants by pharmacy:', error);
      throw new Error('Failed to fetch pharmacy attendants');
    }
  }

  async getActiveAttendants(): Promise<Atendente[]> {
    try {
      return await this.repository.find({
        where: { ativo: true },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching active attendants:', error);
      throw new Error('Failed to fetch active attendants');
    }
  }

  async getAttendantsByVoice(voice: VozAtendente): Promise<Atendente[]> {
    try {
      return await this.repository.find({
        where: { voz: voice },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendants by voice:', error);
      throw new Error('Failed to fetch attendants by voice');
    }
  }

  async getAttendantsByProfile(profile: PerfilAtendente): Promise<Atendente[]> {
    try {
      return await this.repository.find({
        where: { perfil: profile },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendants by profile:', error);
      throw new Error('Failed to fetch attendants by profile');
    }
  }

  async createAttendant(attendant: Partial<Atendente>): Promise<Atendente> {
    try {
      const newAttendant = this.repository.create(attendant);
      return await this.repository.save(newAttendant);
    } catch (error) {
      console.error('Error creating attendant:', error);
      throw new Error('Failed to create attendant');
    }
  }

  async updateAttendant(id: string, updates: Partial<Atendente>): Promise<Atendente | null> {
    try {
      const result = await this.repository.update(id, updates);
      if (result.affected === 0) {
        return null;
      }
      return await this.getAttendantById(id);
    } catch (error) {
      console.error('Error updating attendant:', error);
      throw new Error('Failed to update attendant');
    }
  }

  async deleteAttendant(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deleting attendant:', error);
      throw new Error('Failed to delete attendant');
    }
  }

  async activateAttendant(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { ativo: true });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error activating attendant:', error);
      throw new Error('Failed to activate attendant');
    }
  }

  async deactivateAttendant(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { ativo: false });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deactivating attendant:', error);
      throw new Error('Failed to deactivate attendant');
    }
  }
} 