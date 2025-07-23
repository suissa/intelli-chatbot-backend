"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugsRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const remedio_entity_1 = require("../../domain/entities/remedio.entity");
const typeorm_config_1 = require("../database/typeorm.config");
let DrugsRepositoryImpl = class DrugsRepositoryImpl {
    constructor() {
        this.repository = typeorm_config_1.AppDataSource.getRepository(remedio_entity_1.Remedio);
        console.log('🔗 Inicializando repository TypeORM para Remédios...');
    }
    async getAllDrugs() {
        try {
            const remedios = await this.repository.find({
                order: { nome: 'ASC' }
            });
            console.log(`💊 Encontrados ${remedios.length} remédios no total`);
            return remedios;
        }
        catch (error) {
            console.error('Erro ao buscar todos os remédios:', error);
            throw new Error('Erro na conexão com o banco de dados');
        }
    }
    async getDrugById(id) {
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
        }
        catch (error) {
            console.error('Erro ao buscar remédio por ID:', error);
            throw new Error('Erro na conexão com o banco de dados');
        }
    }
    async searchDrugs(term) {
        try {
            const cleanTerm = term.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
            const remedios = await this.repository.find({
                where: { nome: (0, typeorm_1.Like)(`%${cleanTerm}%`) },
                order: { nome: 'ASC' },
                take: 10
            });
            console.log(`🔍 Encontrados ${remedios.length} remédios para o termo "${cleanTerm}"`);
            return remedios;
        }
        catch (error) {
            console.error('Erro ao buscar remédios:', error);
            throw new Error('Erro na conexão com o banco de dados');
        }
    }
    async getActiveDrugs() {
        try {
            const remedios = await this.repository.find({
                where: { ativo: true },
                order: { nome: 'ASC' }
            });
            console.log(`✅ Encontrados ${remedios.length} remédios ativos`);
            return remedios;
        }
        catch (error) {
            console.error('Erro ao buscar remédios ativos:', error);
            throw new Error('Erro na conexão com o banco de dados');
        }
    }
};
exports.DrugsRepositoryImpl = DrugsRepositoryImpl;
exports.DrugsRepositoryImpl = DrugsRepositoryImpl = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DrugsRepositoryImpl);
//# sourceMappingURL=drugs.repository.js.map