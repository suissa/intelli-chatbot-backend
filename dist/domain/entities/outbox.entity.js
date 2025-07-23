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
exports.Outbox = exports.OutboxType = exports.OutboxStatus = void 0;
const typeorm_1 = require("typeorm");
var OutboxStatus;
(function (OutboxStatus) {
    OutboxStatus["PENDING"] = "pending";
    OutboxStatus["SENT"] = "sent";
    OutboxStatus["FAILED"] = "failed";
    OutboxStatus["RETRY"] = "retry";
})(OutboxStatus || (exports.OutboxStatus = OutboxStatus = {}));
var OutboxType;
(function (OutboxType) {
    OutboxType["IA"] = "ia";
    OutboxType["STORAGE"] = "storage";
    OutboxType["RESPONSE"] = "response";
})(OutboxType || (exports.OutboxType = OutboxType = {}));
let Outbox = class Outbox {
    markAsSent() {
        this.status = OutboxStatus.SENT;
        this.sentAt = new Date();
    }
    markAsFailed(error) {
        this.status = OutboxStatus.FAILED;
        this.errorMessage = error;
    }
    shouldRetry() {
        return this.retryCount < this.maxRetries && this.status !== OutboxStatus.SENT;
    }
    incrementRetry() {
        this.retryCount++;
        this.status = OutboxStatus.RETRY;
        const delayMs = Math.pow(2, this.retryCount - 1) * 1000;
        this.nextRetryAt = new Date(Date.now() + delayMs);
    }
    canProcess() {
        if (this.status === OutboxStatus.SENT)
            return false;
        if (this.status === OutboxStatus.FAILED && !this.shouldRetry())
            return false;
        if (this.status === OutboxStatus.RETRY && this.nextRetryAt && this.nextRetryAt > new Date())
            return false;
        return true;
    }
    getPayloadAsObject() {
        try {
            return JSON.parse(this.payload);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro ao fazer parse do payload: ${errorMessage}`);
        }
    }
    setPayloadFromObject(obj) {
        this.payload = JSON.stringify(obj);
    }
    validarDados() {
        return !!(this.type && this.payload && this.topic);
    }
    isProcessavel() {
        return this.canProcess();
    }
    getTempoAguardando() {
        return Date.now() - this.createdAt.getTime();
    }
    getTempoProcessamento() {
        if (this.sentAt) {
            return this.sentAt.getTime() - this.createdAt.getTime();
        }
        return Date.now() - this.createdAt.getTime();
    }
};
exports.Outbox = Outbox;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Outbox.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OutboxType,
        nullable: false
    }),
    __metadata("design:type", String)
], Outbox.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OutboxStatus,
        default: OutboxStatus.PENDING
    }),
    __metadata("design:type", String)
], Outbox.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Outbox.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Outbox.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Outbox.prototype, "queue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Outbox.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 3 }),
    __metadata("design:type", Number)
], Outbox.prototype, "maxRetries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Outbox.prototype, "nextRetryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outbox.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Outbox.prototype, "correlationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Outbox.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Outbox.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Outbox.prototype, "sentAt", void 0);
exports.Outbox = Outbox = __decorate([
    (0, typeorm_1.Entity)('outbox')
], Outbox);
//# sourceMappingURL=outbox.entity.js.map