import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Atendimento, TipoAtendimento, StatusAtendimento } from '../../domain/entities';

export interface IAttendanceRepository {
  getAllAttendances(): Promise<Atendimento[]>;
  getAttendanceById(id: string): Promise<Atendimento | null>;
  getAttendancesByPharmacy(pharmacyId: string): Promise<Atendimento[]>;
  getAttendancesByAttendant(attendantId: string): Promise<Atendimento[]>;
  getAttendancesByStatus(status: StatusAtendimento): Promise<Atendimento[]>;
  getAttendancesByType(type: TipoAtendimento): Promise<Atendimento[]>;
  getPendingAttendances(): Promise<Atendimento[]>;
  getActiveAttendances(): Promise<Atendimento[]>;
  getCompletedAttendances(): Promise<Atendimento[]>;
  getAttendancesByDateRange(startDate: Date, endDate: Date): Promise<Atendimento[]>;
  createAttendance(attendance: Partial<Atendimento>): Promise<Atendimento>;
  updateAttendance(id: string, updates: Partial<Atendimento>): Promise<Atendimento | null>;
  deleteAttendance(id: string): Promise<boolean>;
  startAttendance(id: string): Promise<boolean>;
  completeAttendance(id: string, response?: string): Promise<boolean>;
  cancelAttendance(id: string): Promise<boolean>;
}

@injectable()
export class AttendanceRepository implements IAttendanceRepository {
  private repository: Repository<Atendimento>;

  constructor() {
    // TODO: Inject DataSource and get repository
    this.repository = {} as Repository<Atendimento>;
  }

  async getAllAttendances(): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching all attendances:', error);
      throw new Error('Failed to fetch attendances');
    }
  }

  async getAttendanceById(id: string): Promise<Atendimento | null> {
    try {
      return await this.repository.findOne({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching attendance by ID:', error);
      throw new Error('Failed to fetch attendance');
    }
  }

  async getAttendancesByPharmacy(pharmacyId: string): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { farmacia_id: pharmacyId },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendances by pharmacy:', error);
      throw new Error('Failed to fetch pharmacy attendances');
    }
  }

  async getAttendancesByAttendant(attendantId: string): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { atendente_id: attendantId },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendances by attendant:', error);
      throw new Error('Failed to fetch attendant attendances');
    }
  }

  async getAttendancesByStatus(status: StatusAtendimento): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { status },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendances by status:', error);
      throw new Error('Failed to fetch attendances by status');
    }
  }

  async getAttendancesByType(type: TipoAtendimento): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { tipo: type },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching attendances by type:', error);
      throw new Error('Failed to fetch attendances by type');
    }
  }

  async getPendingAttendances(): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { status: StatusAtendimento.PENDENTE },
        order: { created_at: 'ASC' }
      });
    } catch (error) {
      console.error('Error fetching pending attendances:', error);
      throw new Error('Failed to fetch pending attendances');
    }
  }

  async getActiveAttendances(): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { status: StatusAtendimento.EM_ANDAMENTO },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching active attendances:', error);
      throw new Error('Failed to fetch active attendances');
    }
  }

  async getCompletedAttendances(): Promise<Atendimento[]> {
    try {
      return await this.repository.find({
        where: { status: StatusAtendimento.FINALIZADO },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching completed attendances:', error);
      throw new Error('Failed to fetch completed attendances');
    }
  }

  async getAttendancesByDateRange(startDate: Date, endDate: Date): Promise<Atendimento[]> {
    try {
      return await this.repository
        .createQueryBuilder('attendance')
        .where('attendance.data_hora >= :startDate', { startDate })
        .andWhere('attendance.data_hora <= :endDate', { endDate })
        .orderBy('attendance.data_hora', 'DESC')
        .getMany();
    } catch (error) {
      console.error('Error fetching attendances by date range:', error);
      throw new Error('Failed to fetch attendances by date range');
    }
  }

  async createAttendance(attendance: Partial<Atendimento>): Promise<Atendimento> {
    try {
      const newAttendance = this.repository.create(attendance);
      return await this.repository.save(newAttendance);
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw new Error('Failed to create attendance');
    }
  }

  async updateAttendance(id: string, updates: Partial<Atendimento>): Promise<Atendimento | null> {
    try {
      const result = await this.repository.update(id, updates);
      if (result.affected === 0) {
        return null;
      }
      return await this.getAttendanceById(id);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw new Error('Failed to update attendance');
    }
  }

  async deleteAttendance(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw new Error('Failed to delete attendance');
    }
  }

  async startAttendance(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { 
        status: StatusAtendimento.EM_ANDAMENTO 
      });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error starting attendance:', error);
      throw new Error('Failed to start attendance');
    }
  }

  async completeAttendance(id: string, response?: string): Promise<boolean> {
    try {
      const updates: Partial<Atendimento> = { 
        status: StatusAtendimento.FINALIZADO 
      };
      if (response) {
        updates.resposta = response;
      }
      const result = await this.repository.update(id, updates);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error completing attendance:', error);
      throw new Error('Failed to complete attendance');
    }
  }

  async cancelAttendance(id: string): Promise<boolean> {
    try {
      const result = await this.repository.update(id, { 
        status: StatusAtendimento.CANCELADO 
      });
      return result.affected !== 0;
    } catch (error) {
      console.error('Error canceling attendance:', error);
      throw new Error('Failed to cancel attendance');
    }
  }
} 