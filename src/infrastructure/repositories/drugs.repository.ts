import { injectable } from 'inversify';
import { Repository, Like, Raw } from 'typeorm';
import { Remedio } from '../../domain/entities/remedio.entity';
import { AppDataSource } from '../database/typeorm.config';

export interface IDrugsRepository {
  getAllDrugs(): Promise<Remedio[]>;
  getDrugById(id: number): Promise<Remedio | null>;
  searchDrugs(term: string): Promise<Remedio[]>;
  getActiveDrugs(): Promise<Remedio[]>;
  updateCorrelatedProducts(
    remedios: Remedio[],
    correlacionados: Array<{ name: string; category: string; price: number }>
  ): Promise<void>;
}

@injectable()
export class DrugsRepository implements IDrugsRepository {
  private repository: Repository<Remedio>;

  constructor() {
    this.repository = AppDataSource.getRepository(Remedio);
    console.log('🔗 Inicializando repository TypeORM para Remédios...');
  }

  async getAllDrugs(): Promise<Remedio[]> {
    try {
      const remedios = await this.repository.find({
        order: { nome: 'ASC' }
      });

      console.log(`💊 Encontrados ${remedios.length} remédios no total`);
      return remedios;
    } catch (error) {
      console.error('Erro ao buscar todos os remédios:', error);
      throw new Error('Erro na conexão com o banco de dados');
    }
  }
  
  async getDrugByName(name: string): Promise<Remedio[]> {
    const remedios = await this.repository.find({
      where: { nome: Raw(alias => `LOWER(${alias}) LIKE LOWER(:t)`, { t: `%${name.toLowerCase()}%` }) },
      order: { nome: 'ASC' }
    });
    return remedios || [];
  }

  async getDrugById(id: number): Promise<Remedio | null> {
    try {
      const remedio = await this.repository.findOne({
        where: { id }
      });

      if (!remedio) {
        console.log(`❌ Remédio com ID ${id} não encontrado`);
        return null;
      }

      console.log(`✅ Remédio encontrado: ${remedio.nome}`);
      return remedio;
    } catch (error) {
      console.error('Erro ao buscar remédio por ID:', error);
      throw new Error('Erro na conexão com o banco de dados');
    }
  }

  async searchDrugs(term: string): Promise<Remedio[]> {
    try {
      console.log('🔍 Buscando remédios para o termo:', term);
      // Limpar o termo de busca - remover quebras de linha e caracteres especiais
      const cleanTerm = String(term).replace(/[\n\r\t]/g, ' ').trim();
      
      // Buscar apenas na coluna nome
      const remedios = await this.repository.find({
        where: { nome: Raw(alias => `LOWER(${alias}) LIKE LOWER(:t)`, { t: `%${cleanTerm.toLowerCase()}%` }) },
        order: { nome: 'ASC' },
        take: 10 // Limitar a 10 resultados
      });

      console.log(`🔍 Encontrados ${remedios.length} remédios para o termo "${cleanTerm}"`);
      return remedios;
    } catch (error) {
      console.error('Erro ao buscar remédios:', error);
      throw new Error('Erro na conexão com o banco de dados');
    }
  }

  
  async updateCorrelatedProducts(
    remedios: Remedio[],
    correlacionados: Array<{ name: string; category: string; price: number }>
  ): Promise<void> {
    if (remedios.length === 0) {
      throw new Error('Nenhum remédio encontrado');
    }
    remedios.forEach(async (remedio) => {
      await this.repository.update(remedio.id, {
        produtosCorrelacionados: correlacionados
      });
    });
    console.log(`✅ Remédios atualizados com ${correlacionados.length} correlacionados`);
  }

  async getActiveDrugs(): Promise<Remedio[]> {
    try {
      const remedios = await this.repository.find({
        where: { ativo: true },
        order: { nome: 'ASC' }
      });

      console.log(`✅ Encontrados ${remedios.length} remédios ativos`);
      return remedios;
    } catch (error) {
      console.error('Erro ao buscar remédios ativos:', error);
      throw new Error('Erro na conexão com o banco de dados');
    }
  }
} 