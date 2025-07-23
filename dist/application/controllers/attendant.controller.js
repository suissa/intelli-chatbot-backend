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
exports.AttendantControllerImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
const attendant_repository_1 = require("../../infrastructure/repositories/attendant.repository");
const entities_1 = require("../../domain/entities");
let AttendantControllerImpl = class AttendantControllerImpl {
    constructor(attendantRepository) {
        this.attendantRepository = attendantRepository;
    }
    async getAllAttendants(request, reply) {
        try {
            const attendants = await this.attendantRepository.getAllAttendants();
            reply.send({
                success: true,
                data: attendants,
                count: attendants.length,
                message: 'Attendants retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching all attendants:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendants'
            });
        }
    }
    async getAttendantById(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendant by ID:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendant'
            });
        }
    }
    async getAttendantsByPharmacy(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendants by pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacy attendants'
            });
        }
    }
    async getActiveAttendants(request, reply) {
        try {
            const attendants = await this.attendantRepository.getActiveAttendants();
            reply.send({
                success: true,
                data: attendants,
                count: attendants.length,
                message: 'Active attendants retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching active attendants:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch active attendants'
            });
        }
    }
    async getAttendantsByVoice(request, reply) {
        try {
            const { voice } = request.params;
            if (!Object.values(entities_1.VozAtendente).includes(voice)) {
                reply.status(400).send({
                    success: false,
                    error: 'Invalid voice type',
                    message: 'Voice must be one of: masculina, feminina, neutra'
                });
                return;
            }
            const attendants = await this.attendantRepository.getAttendantsByVoice(voice);
            reply.send({
                success: true,
                data: attendants,
                count: attendants.length,
                voice,
                message: `Found ${attendants.length} attendants with voice type ${voice}`
            });
        }
        catch (error) {
            console.error('Error fetching attendants by voice:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendants by voice'
            });
        }
    }
    async getAttendantsByProfile(request, reply) {
        try {
            const { profile } = request.params;
            if (!Object.values(entities_1.PerfilAtendente).includes(profile)) {
                reply.status(400).send({
                    success: false,
                    error: 'Invalid profile type',
                    message: 'Profile must be one of: formal, informal, amigavel, profissional'
                });
                return;
            }
            const attendants = await this.attendantRepository.getAttendantsByProfile(profile);
            reply.send({
                success: true,
                data: attendants,
                count: attendants.length,
                profile,
                message: `Found ${attendants.length} attendants with profile ${profile}`
            });
        }
        catch (error) {
            console.error('Error fetching attendants by profile:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendants by profile'
            });
        }
    }
    async createAttendant(request, reply) {
        try {
            const attendantData = request.body;
            const attendant = await this.attendantRepository.createAttendant(attendantData);
            reply.status(201).send({
                success: true,
                data: attendant,
                message: 'Attendant created successfully'
            });
        }
        catch (error) {
            console.error('Error creating attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to create attendant'
            });
        }
    }
    async updateAttendant(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;
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
        }
        catch (error) {
            console.error('Error updating attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update attendant'
            });
        }
    }
    async deleteAttendant(request, reply) {
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
        }
        catch (error) {
            console.error('Error deleting attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete attendant'
            });
        }
    }
    async activateAttendant(request, reply) {
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
        }
        catch (error) {
            console.error('Error activating attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to activate attendant'
            });
        }
    }
    async deactivateAttendant(request, reply) {
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
        }
        catch (error) {
            console.error('Error deactivating attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to deactivate attendant'
            });
        }
    }
};
exports.AttendantControllerImpl = AttendantControllerImpl;
exports.AttendantControllerImpl = AttendantControllerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AttendantRepository)),
    __metadata("design:paramtypes", [attendant_repository_1.AttendantRepository])
], AttendantControllerImpl);
//# sourceMappingURL=attendant.controller.js.map