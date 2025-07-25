import { FastifyRequest, FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { AttendantRepository } from '../../infrastructure/repositories/attendant.repository';
import { VozAtendente, PerfilAtendente } from '../../domain/entities';

export interface IAttendantController {
  getAllAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAttendantById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  getAttendantsByPharmacy(request: FastifyRequest<{ Params: { pharmacyId: string } }>, reply: FastifyReply): Promise<void>;
  getActiveAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAttendantsByVoice(request: FastifyRequest<{ Params: { voice: string } }>, reply: FastifyReply): Promise<void>;
  getAttendantsByProfile(request: FastifyRequest<{ Params: { profile: string } }>, reply: FastifyReply): Promise<void>;
  createAttendant(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  deleteAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  activateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  deactivateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
}

@injectable()
export class AttendantController implements IAttendantController {
  constructor(
    @inject(TYPES.AttendantRepository) private attendantRepository: AttendantRepository
  ) {}

  async getAllAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendants = await this.attendantRepository.getAllAttendants();
      
      reply.send({
        success: true,
        data: attendants,
        count: attendants.length,
        message: 'Attendants retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching all attendants:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendants'
      });
    }
  }

  async getAttendantById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const attendant = await this.attendantRepository.getAttendantById(id);
      
      if (!attendant) {
        reply.status(404).send({
          success: false,
          error: 'Attendant not found',
          message: `Attendant with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: attendant,
        message: 'Attendant found successfully'
      });
    } catch (error) {
      console.error('Error fetching attendant by ID:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendant'
      });
    }
  }

  async getAttendantsByPharmacy(request: FastifyRequest<{ Params: { pharmacyId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { pharmacyId } = request.params;
      const attendants = await this.attendantRepository.getAttendantsByPharmacy(pharmacyId);
      
      reply.send({
        success: true,
        data: attendants,
        count: attendants.length,
        pharmacyId,
        message: `Found ${attendants.length} attendants for pharmacy ${pharmacyId}`
      });
    } catch (error) {
      console.error('Error fetching attendants by pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacy attendants'
      });
    }
  }

  async getActiveAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendants = await this.attendantRepository.getActiveAttendants();
      
      reply.send({
        success: true,
        data: attendants,
        count: attendants.length,
        message: 'Active attendants retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active attendants:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch active attendants'
      });
    }
  }

  async getAttendantsByVoice(request: FastifyRequest<{ Params: { voice: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { voice } = request.params;
      
      if (!Object.values(VozAtendente).includes(voice as VozAtendente)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid voice type',
          message: 'Voice must be one of: masculina, feminina, neutra'
        });
        return;
      }

      const attendants = await this.attendantRepository.getAttendantsByVoice(voice as VozAtendente);
      
      reply.send({
        success: true,
        data: attendants,
        count: attendants.length,
        voice,
        message: `Found ${attendants.length} attendants with voice type ${voice}`
      });
    } catch (error) {
      console.error('Error fetching attendants by voice:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendants by voice'
      });
    }
  }

  async getAttendantsByProfile(request: FastifyRequest<{ Params: { profile: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { profile } = request.params;
      
      if (!Object.values(PerfilAtendente).includes(profile as PerfilAtendente)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid profile type',
          message: 'Profile must be one of: formal, informal, amigavel, profissional'
        });
        return;
      }

      const attendants = await this.attendantRepository.getAttendantsByProfile(profile as PerfilAtendente);
      
      reply.send({
        success: true,
        data: attendants,
        count: attendants.length,
        profile,
        message: `Found ${attendants.length} attendants with profile ${profile}`
      });
    } catch (error) {
      console.error('Error fetching attendants by profile:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendants by profile'
      });
    }
  }

  async createAttendant(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendantData = request.body as any;
      const attendant = await this.attendantRepository.createAttendant(attendantData);
      
      reply.status(201).send({
        success: true,
        data: attendant,
        message: 'Attendant created successfully'
      });
    } catch (error) {
      console.error('Error creating attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create attendant'
      });
    }
  }

  async updateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const updates = request.body as any;
      
      const attendant = await this.attendantRepository.updateAttendant(id, updates);
      
      if (!attendant) {
        reply.status(404).send({
          success: false,
          error: 'Attendant not found',
          message: `Attendant with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: attendant,
        message: 'Attendant updated successfully'
      });
    } catch (error) {
      console.error('Error updating attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update attendant'
      });
    }
  }

  async deleteAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const deleted = await this.attendantRepository.deleteAttendant(id);
      
      if (!deleted) {
        reply.status(404).send({
          success: false,
          error: 'Attendant not found',
          message: `Attendant with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendant deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete attendant'
      });
    }
  }

  async activateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const activated = await this.attendantRepository.activateAttendant(id);
      
      if (!activated) {
        reply.status(404).send({
          success: false,
          error: 'Attendant not found',
          message: `Attendant with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendant activated successfully'
      });
    } catch (error) {
      console.error('Error activating attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to activate attendant'
      });
    }
  }

  async deactivateAttendant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const deactivated = await this.attendantRepository.deactivateAttendant(id);
      
      if (!deactivated) {
        reply.status(404).send({
          success: false,
          error: 'Attendant not found',
          message: `Attendant with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendant deactivated successfully'
      });
    } catch (error) {
      console.error('Error deactivating attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to deactivate attendant'
      });
    }
  }
} 