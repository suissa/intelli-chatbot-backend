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
exports.AttendanceRepository = void 0;
const inversify_1 = require("inversify");
const entities_1 = require("../../domain/entities");
let AttendanceRepository = class AttendanceRepository {
    constructor() {
        this.repository = {};
    }
    async getAllAttendances() {
        try {
            return await this.repository.find({
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching all attendances:', error);
            throw new Error('Failed to fetch attendances');
        }
    }
    async getAttendanceById(id) {
        try {
            return await this.repository.findOne({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error fetching attendance by ID:', error);
            throw new Error('Failed to fetch attendance');
        }
    }
    async getAttendancesByPharmacy(pharmacyId) {
        try {
            return await this.repository.find({
                where: { farmacia_id: pharmacyId },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendances by pharmacy:', error);
            throw new Error('Failed to fetch pharmacy attendances');
        }
    }
    async getAttendancesByAttendant(attendantId) {
        try {
            return await this.repository.find({
                where: { atendente_id: attendantId },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendances by attendant:', error);
            throw new Error('Failed to fetch attendant attendances');
        }
    }
    async getAttendancesByStatus(status) {
        try {
            return await this.repository.find({
                where: { status },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendances by status:', error);
            throw new Error('Failed to fetch attendances by status');
        }
    }
    async getAttendancesByType(type) {
        try {
            return await this.repository.find({
                where: { tipo: type },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching attendances by type:', error);
            throw new Error('Failed to fetch attendances by type');
        }
    }
    async getPendingAttendances() {
        try {
            return await this.repository.find({
                where: { status: entities_1.StatusAtendimento.PENDENTE },
                order: { created_at: 'ASC' }
            });
        }
        catch (error) {
            console.error('Error fetching pending attendances:', error);
            throw new Error('Failed to fetch pending attendances');
        }
    }
    async getActiveAttendances() {
        try {
            return await this.repository.find({
                where: { status: entities_1.StatusAtendimento.EM_ANDAMENTO },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching active attendances:', error);
            throw new Error('Failed to fetch active attendances');
        }
    }
    async getCompletedAttendances() {
        try {
            return await this.repository.find({
                where: { status: entities_1.StatusAtendimento.FINALIZADO },
                order: { created_at: 'DESC' }
            });
        }
        catch (error) {
            console.error('Error fetching completed attendances:', error);
            throw new Error('Failed to fetch completed attendances');
        }
    }
    async getAttendancesByDateRange(startDate, endDate) {
        try {
            return await this.repository
                .createQueryBuilder('attendance')
                .where('attendance.data_hora >= :startDate', { startDate })
                .andWhere('attendance.data_hora <= :endDate', { endDate })
                .orderBy('attendance.data_hora', 'DESC')
                .getMany();
        }
        catch (error) {
            console.error('Error fetching attendances by date range:', error);
            throw new Error('Failed to fetch attendances by date range');
        }
    }
    async createAttendance(attendance) {
        try {
            const newAttendance = this.repository.create(attendance);
            return await this.repository.save(newAttendance);
        }
        catch (error) {
            console.error('Error creating attendance:', error);
            throw new Error('Failed to create attendance');
        }
    }
    async updateAttendance(id, updates) {
        try {
            const result = await this.repository.update(id, updates);
            if (result.affected === 0) {
                return null;
            }
            return await this.getAttendanceById(id);
        }
        catch (error) {
            console.error('Error updating attendance:', error);
            throw new Error('Failed to update attendance');
        }
    }
    async deleteAttendance(id) {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error deleting attendance:', error);
            throw new Error('Failed to delete attendance');
        }
    }
    async startAttendance(id) {
        try {
            const result = await this.repository.update(id, {
                status: entities_1.StatusAtendimento.EM_ANDAMENTO
            });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error starting attendance:', error);
            throw new Error('Failed to start attendance');
        }
    }
    async completeAttendance(id, response) {
        try {
            const updates = {
                status: entities_1.StatusAtendimento.FINALIZADO
            };
            if (response) {
                updates.resposta = response;
            }
            const result = await this.repository.update(id, updates);
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error completing attendance:', error);
            throw new Error('Failed to complete attendance');
        }
    }
    async cancelAttendance(id) {
        try {
            const result = await this.repository.update(id, {
                status: entities_1.StatusAtendimento.CANCELADO
            });
            return result.affected !== 0;
        }
        catch (error) {
            console.error('Error canceling attendance:', error);
            throw new Error('Failed to cancel attendance');
        }
    }
};
exports.AttendanceRepository = AttendanceRepository;
exports.AttendanceRepository = AttendanceRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AttendanceRepository);
//# sourceMappingURL=attendance.repository.js.map