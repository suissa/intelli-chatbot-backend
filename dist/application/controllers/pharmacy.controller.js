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
exports.PharmacyControllerImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
const pharmacy_repository_1 = require("../../infrastructure/repositories/pharmacy.repository");
const evolution_api_sdk_1 = require("evolution-api-sdk");
const client = new evolution_api_sdk_1.EvolutionClient({
    serverUrl: "http://193.203.183.175:8080/",
    token: "429683C4C977415CAAFCCE10F7D57E1",
    instance: "suisseba",
});
let PharmacyControllerImpl = class PharmacyControllerImpl {
    constructor(pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }
    async setWebhook(request, reply) {
        try {
            await client.webhook.set({
                url: "http://195.35.19.148:3000/api/pharmacies/webhook",
                webhook_by_events: false,
                events: [
                    "MESSAGES_UPSERT",
                    "MESSAGES_UPDATE",
                    "CONNECTION_UPDATE",
                    "CONTACTS_UPSERT",
                ],
                enabled: true,
            });
        }
        catch (error) {
            console.error('Error setting webhook:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to set webhook'
            });
        }
    }
    async getAllPharmacies(request, reply) {
        try {
            const pharmacies = await this.pharmacyRepository.getAllPharmacies();
            reply.send({
                success: true,
                data: pharmacies,
                count: pharmacies.length,
                message: 'Pharmacies retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching all pharmacies:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacies'
            });
        }
    }
    async getPharmacyById(request, reply) {
        try {
            const { id } = request.params;
            const pharmacy = await this.pharmacyRepository.getPharmacyById(id);
            if (!pharmacy) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with ID ${id} not found`
                });
                return;
            }
            reply.send({
                success: true,
                data: pharmacy,
                message: 'Pharmacy found successfully'
            });
        }
        catch (error) {
            console.error('Error fetching pharmacy by ID:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacy'
            });
        }
    }
    async webhook(request, reply) {
        try {
            console.log(request.body);
        }
        catch (error) {
            console.error('Error fetching pharmacy by CNPJ:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacy'
            });
        }
    }
    async getPharmacyByCNPJ(request, reply) {
        try {
            const { cnpj } = request.params;
            const pharmacy = await this.pharmacyRepository.getPharmacyByCNPJ(cnpj);
            if (!pharmacy) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with CNPJ ${cnpj} not found`
                });
                return;
            }
            reply.send({
                success: true,
                data: pharmacy,
                message: 'Pharmacy found successfully'
            });
        }
        catch (error) {
            console.error('Error fetching pharmacy by CNPJ:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacy'
            });
        }
    }
    async getActivePharmacies(request, reply) {
        try {
            const pharmacies = await this.pharmacyRepository.getActivePharmacies();
            reply.send({
                success: true,
                data: pharmacies,
                count: pharmacies.length,
                message: 'Active pharmacies retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching active pharmacies:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch active pharmacies'
            });
        }
    }
    async getPharmaciesByCity(request, reply) {
        try {
            const { city } = request.params;
            const pharmacies = await this.pharmacyRepository.getPharmaciesByCity(city);
            reply.send({
                success: true,
                data: pharmacies,
                count: pharmacies.length,
                city,
                message: `Found ${pharmacies.length} pharmacies in ${city}`
            });
        }
        catch (error) {
            console.error('Error fetching pharmacies by city:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacies by city'
            });
        }
    }
    async getPharmaciesByState(request, reply) {
        try {
            const { state } = request.params;
            const pharmacies = await this.pharmacyRepository.getPharmaciesByState(state);
            reply.send({
                success: true,
                data: pharmacies,
                count: pharmacies.length,
                state,
                message: `Found ${pharmacies.length} pharmacies in ${state}`
            });
        }
        catch (error) {
            console.error('Error fetching pharmacies by state:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacies by state'
            });
        }
    }
    async searchPharmacies(request, reply) {
        try {
            const { q } = request.query;
            if (!q || q.trim().length === 0) {
                reply.status(400).send({
                    success: false,
                    error: 'Search term required',
                    message: 'Please provide a search term'
                });
                return;
            }
            const pharmacies = await this.pharmacyRepository.searchPharmacies(q);
            reply.send({
                success: true,
                data: pharmacies,
                count: pharmacies.length,
                searchTerm: q,
                message: `Found ${pharmacies.length} pharmacies matching "${q}"`
            });
        }
        catch (error) {
            console.error('Error searching pharmacies:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to search pharmacies'
            });
        }
    }
    async createPharmacy(request, reply) {
        try {
            const pharmacyData = request.body;
            const pharmacy = await this.pharmacyRepository.createPharmacy(pharmacyData);
            reply.status(201).send({
                success: true,
                data: pharmacy,
                message: 'Pharmacy created successfully'
            });
        }
        catch (error) {
            console.error('Error creating pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to create pharmacy'
            });
        }
    }
    async updatePharmacy(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;
            const pharmacy = await this.pharmacyRepository.updatePharmacy(id, updates);
            if (!pharmacy) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with ID ${id} not found`
                });
                return;
            }
            reply.send({
                success: true,
                data: pharmacy,
                message: 'Pharmacy updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update pharmacy'
            });
        }
    }
    async deletePharmacy(request, reply) {
        try {
            const { id } = request.params;
            const deleted = await this.pharmacyRepository.deletePharmacy(id);
            if (!deleted) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with ID ${id} not found`
                });
                return;
            }
            reply.send({
                success: true,
                message: 'Pharmacy deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete pharmacy'
            });
        }
    }
    async activatePharmacy(request, reply) {
        try {
            const { id } = request.params;
            const activated = await this.pharmacyRepository.activatePharmacy(id);
            if (!activated) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with ID ${id} not found`
                });
                return;
            }
            reply.send({
                success: true,
                message: 'Pharmacy activated successfully'
            });
        }
        catch (error) {
            console.error('Error activating pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to activate pharmacy'
            });
        }
    }
    async deactivatePharmacy(request, reply) {
        try {
            const { id } = request.params;
            const deactivated = await this.pharmacyRepository.deactivatePharmacy(id);
            if (!deactivated) {
                reply.status(404).send({
                    success: false,
                    error: 'Pharmacy not found',
                    message: `Pharmacy with ID ${id} not found`
                });
                return;
            }
            reply.send({
                success: true,
                message: 'Pharmacy deactivated successfully'
            });
        }
        catch (error) {
            console.error('Error deactivating pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to deactivate pharmacy'
            });
        }
    }
};
exports.PharmacyControllerImpl = PharmacyControllerImpl;
exports.PharmacyControllerImpl = PharmacyControllerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PharmacyRepository)),
    __metadata("design:paramtypes", [pharmacy_repository_1.PharmacyRepository])
], PharmacyControllerImpl);
//# sourceMappingURL=pharmacy.controller.js.map