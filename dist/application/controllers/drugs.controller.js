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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugsControllerImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
let DrugsControllerImpl = class DrugsControllerImpl {
    constructor(drugsRepository) {
        this.drugsRepository = drugsRepository;
    }
    async getAllDrugs(request, reply) {
        try {
            const drugs = await this.drugsRepository.getAllDrugs();
            reply.send({
                success: true,
                data: drugs,
                count: drugs.length,
                message: 'Remédios recuperados com sucesso'
            });
        }
        catch (error) {
            console.error('Erro ao buscar todos os remédios:', error);
            reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Não foi possível buscar os remédios'
            });
        }
    }
    async getDrugById(request, reply) {
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
        }
        catch (error) {
            console.error('Erro ao buscar remédio por ID:', error);
            reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Não foi possível buscar o remédio'
            });
        }
    }
    async searchDrugs(request, reply) {
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
        }
        catch (error) {
            console.error('Erro ao buscar remédios:', error);
            reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Não foi possível buscar os remédios'
            });
        }
    }
    async getActiveDrugs(request, reply) {
        try {
            const drugs = await this.drugsRepository.getActiveDrugs();
            reply.send({
                success: true,
                data: drugs,
                count: drugs.length,
                message: 'Remédios ativos recuperados com sucesso'
            });
        }
        catch (error) {
            console.error('Erro ao buscar remédios ativos:', error);
            reply.status(500).send({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Não foi possível buscar os remédios ativos'
            });
        }
    }
};
exports.DrugsControllerImpl = DrugsControllerImpl;
exports.DrugsControllerImpl = DrugsControllerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DrugsRepository)),
    __metadata("design:paramtypes", [Object])
], DrugsControllerImpl);
//# sourceMappingURL=drugs.controller.js.map