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
exports.Atendimento = exports.StatusAtendimento = exports.TipoAtendimento = void 0;
const typeorm_1 = require("typeorm");
var TipoAtendimento;
(function (TipoAtendimento) {
    TipoAtendimento["IA"] = "ia";
    TipoAtendimento["HUMANO"] = "humano";
})(TipoAtendimento || (exports.TipoAtendimento = TipoAtendimento = {}));
var StatusAtendimento;
(function (StatusAtendimento) {
    StatusAtendimento["PENDENTE"] = "pendente";
    StatusAtendimento["EM_ANDAMENTO"] = "em_andamento";
    StatusAtendimento["FINALIZADO"] = "finalizado";
    StatusAtendimento["CANCELADO"] = "cancelado";
})(StatusAtendimento || (exports.StatusAtendimento = StatusAtendimento = {}));
let Atendimento = class Atendimento {
    isPendente() {
        return this.status === StatusAtendimento.PENDENTE;
    }
    isEmAndamento() {
        return this.status === StatusAtendimento.EM_ANDAMENTO;
    }
    isFinalizado() {
        return this.status === StatusAtendimento.FINALIZADO;
    }
    isCancelado() {
        return this.status === StatusAtendimento.CANCELADO;
    }
    iniciarAtendimento() {
        if (this.isPendente()) {
            this.status = StatusAtendimento.EM_ANDAMENTO;
        }
    }
    finalizarAtendimento(resposta) {
        if (this.isEmAndamento()) {
            this.status = StatusAtendimento.FINALIZADO;
            if (resposta) {
                this.resposta = resposta;
            }
        }
    }
    cancelarAtendimento() {
        if (!this.isFinalizado()) {
            this.status = StatusAtendimento.CANCELADO;
        }
    }
    adicionarRemedioEncontrado(remedio) {
        if (!this.remedios_encontrados) {
            this.remedios_encontrados = [];
        }
        this.remedios_encontrados.push(remedio);
    }
    validarDados() {
        return !!(this.nome && this.telefone_cliente && this.telefone_farmacia &&
            this.data_hora && this.pergunta);
    }
    podeSerFinalizado() {
        return this.isEmAndamento() && !!this.resposta;
    }
    getDuracaoAtendimento() {
        if (this.isFinalizado() || this.isCancelado()) {
            return this.updated_at.getTime() - this.created_at.getTime();
        }
        return Date.now() - this.created_at.getTime();
    }
};
exports.Atendimento = Atendimento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Atendimento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Atendimento.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Atendimento.prototype, "telefone_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Atendimento.prototype, "telefone_farmacia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Atendimento.prototype, "data_hora", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoAtendimento,
        default: TipoAtendimento.IA
    }),
    __metadata("design:type", String)
], Atendimento.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Atendimento.prototype, "pergunta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Atendimento.prototype, "resposta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Atendimento.prototype, "remedios_encontrados", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatusAtendimento,
        default: StatusAtendimento.PENDENTE
    }),
    __metadata("design:type", String)
], Atendimento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Atendimento.prototype, "farmacia_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Atendimento.prototype, "atendente_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Atendimento.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Atendimento.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Farmacia', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'farmacia_id' }),
    __metadata("design:type", Object)
], Atendimento.prototype, "farmacia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Atendente', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'atendente_id' }),
    __metadata("design:type", Object)
], Atendimento.prototype, "atendente", void 0);
exports.Atendimento = Atendimento = __decorate([
    (0, typeorm_1.Entity)('atendimentos')
], Atendimento);
//# sourceMappingURL=atendimento.entity.js.map