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
exports.PharmacyRepository = void 0;
const inversify_1 = require("inversify");
let PharmacyRepository = class PharmacyRepository {
    constructor() {
        this.repository = {};
    }
    async getAllPharmacies() {
        try {
            return await this.repository.find({
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching all pharmacies:', error);
            throw new Error('Failed to fetch pharmacies');
        }
    }
    async getPharmacyById(id) {
        try {
            return await this.repository.findOne({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error fetching pharmacy by ID:', error);
            throw new Error('Failed to fetch pharmacy');
        }
    }
    async getPharmacyByCNPJ(cnpj) {
        try {
            return await this.repository.findOne({
                where: { cnpj }
            });
        }
        catch (error) {
            console.error('Error fetching pharmacy by CNPJ:', error);
            throw new Error('Failed to fetch pharmacy by CNPJ');
        }
    }
    async getActivePharmacies() {
        try {
            return await this.repository.find({
                where: { ativo: true },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching active pharmacies:', error);
            throw new Error('Failed to fetch active pharmacies');
        }
    }
    async getPharmaciesByCity(city) {
        try {
            return await this.repository.find({
                where: { cidade: city },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching pharmacies by city:', error);
            throw new Error('Failed to fetch pharmacies by city');
        }
    }
    async getPharmaciesByState(state) {
        try {
            return await this.repository.find({
                where: { estado: state },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching pharmacies by state:', error);
            throw new Error('Failed to fetch pharmacies by state');
        }
    }
    async searchPharmacies(term) {
        try {
            return await this.repository
                .createQueryBuilder('pharmacy')
                .where('pharmacy.nome ILIKE :term', { term: `%${term}%` })
                .orWhere('pharmacy.cidade ILIKE :term', { term: `%${term}%` })
                .orWhere('pharmacy.estado ILIKE :term', { term: `%${term}%` })
                .orderBy('pharmacy.created_at', 'DESC')
                .getMany();
        }
        catch (error) {
            console.error('Error searching pharmacies:', error);
            throw new Error('Failed to search pharmacies');
        }
    }
    async createPharmacy(pharmacy) {
        try {
            const newPharmacy = this.repository.create(pharmacy);
            return await this.repository.save(newPharmacy);
        }
        catch (error) {
            console.error('Error creating pharmacy:', error);
            throw new Error('Failed to create pharmacy');
        }
    }
    async updatePharmacy(id, updates) {
        try {
            const result = await this.repository.update(id, updates);
            if (result.affected === 0) {
                return null;
            }
            return await this.getPharmacyById(id);
        }
        catch (error) {
            console.error('Error updating pharmacy:', error);
            throw new Error('Failed to update pharmacy');
        }
    }
    async deletePharmacy(id) {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error deleting pharmacy:', error);
            throw new Error('Failed to delete pharmacy');
        }
    }
    async activatePharmacy(id) {
        try {
            const result = await this.repository.update(id, { ativo: true });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error activating pharmacy:', error);
            throw new Error('Failed to activate pharmacy');
        }
    }
    async deactivatePharmacy(id) {
        try {
            const result = await this.repository.update(id, { ativo: false });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error deactivating pharmacy:', error);
            throw new Error('Failed to deactivate pharmacy');
        }
    }
};
exports.PharmacyRepository = PharmacyRepository;
exports.PharmacyRepository = PharmacyRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PharmacyRepository);
//# sourceMappingURL=pharmacy.repository.js.map