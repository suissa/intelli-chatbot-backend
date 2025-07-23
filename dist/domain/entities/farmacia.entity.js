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
exports.Farmacia = void 0;
const typeorm_1 = require("typeorm");
let Farmacia = class Farmacia {
    isAtiva() {
        return this.ativo;
    }
    ativar() {
        this.ativo = true;
    }
    desativar() {
        this.ativo = false;
    }
    alterarHorarioFuncionamento(horario) {
        this.horario_funcionamento = horario;
    }
    getHorarioPorDia(dia) {
        return this.horario_funcionamento[dia];
    }
    validarDados() {
        return !!(this.nome && this.telefone && this.endereco && this.cidade &&
            this.estado && this.cep && this.cnpj && this.email);
    }
    validarCNPJ() {
        return this.cnpj.length === 18;
    }
    validarCEP() {
        return this.cep.length === 8;
    }
};
exports.Farmacia = Farmacia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Farmacia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "cidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "cep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 18, nullable: false, unique: true }),
    __metadata("design:type", String)
], Farmacia.prototype, "cnpj", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Farmacia.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Farmacia.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Farmacia.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Farmacia.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: false }),
    __metadata("design:type", Object)
], Farmacia.prototype, "horario_funcionamento", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Farmacia.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Farmacia.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Atendente', 'farmacia'),
    __metadata("design:type", Array)
], Farmacia.prototype, "atendentes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Remedio', 'farmacia'),
    __metadata("design:type", Array)
], Farmacia.prototype, "remedios", void 0);
exports.Farmacia = Farmacia = __decorate([
    (0, typeorm_1.Entity)('farmacias')
], Farmacia);
//# sourceMappingURL=farmacia.entity.js.map