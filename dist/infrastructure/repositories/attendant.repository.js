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
exports.AttendantRepository = void 0;
const inversify_1 = require("inversify");
let AttendantRepository = class AttendantRepository {
    constructor() {
        this.repository = {};
    }
    async getAllAttendants() {
        try {
            return await this.repository.find({
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching all attendants:', error);
            throw new Error('Failed to fetch attendants');
        }
    }
    async getAttendantById(id) {
        try {
            return await this.repository.findOne({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error fetching attendant by ID:', error);
            throw new Error('Failed to fetch attendant');
        }
    }
    async getAttendantsByPharmacy(pharmacyId) {
        try {
            return await this.repository.find({
                where: { farmacia_id: pharmacyId },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendants by pharmacy:', error);
            throw new Error('Failed to fetch pharmacy attendants');
        }
    }
    async getActiveAttendants() {
        try {
            return await this.repository.find({
                where: { ativo: true },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching active attendants:', error);
            throw new Error('Failed to fetch active attendants');
        }
    }
    async getAttendantsByVoice(voice) {
        try {
            return await this.repository.find({
                where: { voz: voice },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendants by voice:', error);
            throw new Error('Failed to fetch attendants by voice');
        }
    }
    async getAttendantsByProfile(profile) {
        try {
            return await this.repository.find({
                where: { perfil: profile },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendants by profile:', error);
            throw new Error('Failed to fetch attendants by profile');
        }
    }
    async createAttendant(attendant) {
        try {
            const newAttendant = this.repository.create(attendant);
            return await this.repository.save(newAttendant);
        }
        catch (error) {
            console.error('Error creating attendant:', error);
            throw new Error('Failed to create attendant');
        }
    }
    async updateAttendant(id, updates) {
        try {
            const result = await this.repository.update(id, updates);
            if (result.affected === 0) {
                return null;
            }
            return await this.getAttendantById(id);
        }
        catch (error) {
            console.error('Error updating attendant:', error);
            throw new Error('Failed to update attendant');
        }
    }
    async deleteAttendant(id) {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error deleting attendant:', error);
            throw new Error('Failed to delete attendant');
        }
    }
    async activateAttendant(id) {
        try {
            const result = await this.repository.update(id, { ativo: true });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error activating attendant:', error);
            throw new Error('Failed to activate attendant');
        }
    }
    async deactivateAttendant(id) {
        try {
            const result = await this.repository.update(id, { ativo: false });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error deactivating attendant:', error);
            throw new Error('Failed to deactivate attendant');
        }
    }
};
exports.AttendantRepository = AttendantRepository;
exports.AttendantRepository = AttendantRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AttendantRepository);
//# sourceMappingURL=attendant.repository.js.map