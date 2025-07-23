"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
exports.initializeDatabase = initializeDatabase;
exports.closeDatabase = closeDatabase;
const typeorm_1 = require("typeorm");
const remedio_entity_1 = require("../../domain/entities/remedio.entity");
const atendente_entity_1 = require("../../domain/entities/atendente.entity");
const farmacia_entity_1 = require("../../domain/entities/farmacia.entity");
const atendimento_entity_1 = require("../../domain/entities/atendimento.entity");
const message_queue_entity_1 = require("../../domain/entities/message-queue.entity");
const outbox_entity_1 = require("../../domain/entities/outbox.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'postgres',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [remedio_entity_1.Remedio, atendente_entity_1.Atendente, farmacia_entity_1.Farmacia, atendimento_entity_1.Atendimento, message_queue_entity_1.MessageQueue, outbox_entity_1.Outbox],
    migrations: [],
    subscribers: [],
    extra: {
        family: 4,
    },
});
async function initializeDatabase() {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ TypeORM DataSource inicializado com sucesso');
        console.log(`📊 Database: ${exports.AppDataSource.options.database}`);
        console.log(`🏠 Host: ${exports.AppDataSource.options.host}:${exports.AppDataSource.options.port}`);
    }
    catch (error) {
        console.error('❌ Erro ao inicializar TypeORM DataSource:', error);
        throw error;
    }
}
async function closeDatabase() {
    try {
        await exports.AppDataSource.destroy();
        console.log('✅ TypeORM DataSource fechado com sucesso');
    }
    catch (error) {
        console.error('❌ Erro ao fechar TypeORM DataSource:', error);
        throw error;
    }
}
//# sourceMappingURL=typeorm.config.js.map