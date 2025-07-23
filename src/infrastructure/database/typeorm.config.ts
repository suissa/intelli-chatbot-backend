import { DataSource } from 'typeorm';
import { Remedio } from '../../domain/entities/remedio.entity';
import { Atendente } from '../../domain/entities/atendente.entity';
import { Farmacia } from '../../domain/entities/farmacia.entity';
import { Atendimento } from '../../domain/entities/atendimento.entity';
import { MessageQueue } from '../../domain/entities/message-queue.entity';
import { Outbox } from '../../domain/entities/outbox.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  synchronize: false, // Tabelas já existem
  logging: process.env.NODE_ENV === 'development',
  entities: [Remedio, Atendente, Farmacia, Atendimento, MessageQueue, Outbox],
  migrations: [],
  subscribers: [],
  extra: {
    family: 4,
  },
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ TypeORM DataSource inicializado com sucesso');
    console.log(`📊 Database: ${AppDataSource.options.database}`);
    console.log(`🏠 Host: ${(AppDataSource.options as any).host}:${(AppDataSource.options as any).port}`);
  } catch (error) {
    console.error('❌ Erro ao inicializar TypeORM DataSource:', error);
    throw error;
  }
}

export async function closeDatabase() {
  try {
    await AppDataSource.destroy();
    console.log('✅ TypeORM DataSource fechado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao fechar TypeORM DataSource:', error);
    throw error;
  }
} 