import { FastifyRequest, FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';

export interface DrugsController {
  getAllDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getDrugById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  searchDrugs(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply): Promise<void>;
  getActiveDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

@injectable()
export class DrugsControllerImpl implements DrugsController {
  constructor(
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository
  ) {}

  async getAllDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const drugs = await this.drugsRepository.getAllDrugs();
      
      reply.send({
        success: true,
        data: drugs,
        count: drugs.length,
        message: 'Remédios recuperados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar todos os remédios:', error);
      reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar os remédios'
      });
    }
  }

  async getDrugById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const drugId = parseInt(id);
      
      if (isNaN(drugId)) {
        reply.status(400).send({
          success: false,
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
        return;
      }

      const drug = await this.drugsRepository.getDrugById(drugId);
      
      if (!drug) {
        reply.status(404).send({
          success: false,
          error: 'Remédio não encontrado',
          message: `Remédio com ID ${id} não foi encontrado`
        });
        return;
      }

      reply.send({
        success: true,
        data: drug,
        message: 'Remédio encontrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar remédio por ID:', error);
      reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar o remédio'
      });
    }
  }

  async searchDrugs(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { q } = request.query;
      
      if (!q || q.trim().length === 0) {
        reply.status(400).send({
          success: false,
          error: 'Termo de busca inválido',
          message: 'O termo de busca é obrigatório'
        });
        return;
      }

      const drugs = await this.drugsRepository.searchDrugs(q.trim());
      
      reply.send({
        success: true,
        data: drugs,
        count: drugs.length,
        searchTerm: q,
        message: `Encontrados ${drugs.length} remédios para "${q}"`
      });
    } catch (error) {
      console.error('Erro ao buscar remédios:', error);
      reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar os remédios'
      });
    }
  }

  async getActiveDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const drugs = await this.drugsRepository.getActiveDrugs();
      
      reply.send({
        success: true,
        data: drugs,
        count: drugs.length,
        message: 'Remédios ativos recuperados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar remédios ativos:', error);
      reply.status(500).send({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar os remédios ativos'
      });
    }
  }
} 