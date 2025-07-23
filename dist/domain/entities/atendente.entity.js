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
exports.Atendente = exports.PerfilAtendente = exports.VozAtendente = void 0;
const typeorm_1 = require("typeorm");
var VozAtendente;
(function (VozAtendente) {
    VozAtendente["MASCULINA"] = "masculina";
    VozAtendente["FEMININA"] = "feminina";
    VozAtendente["NEUTRA"] = "neutra";
})(VozAtendente || (exports.VozAtendente = VozAtendente = {}));
var PerfilAtendente;
(function (PerfilAtendente) {
    PerfilAtendente["FORMAL"] = "formal";
    PerfilAtendente["INFORMAL"] = "informal";
    PerfilAtendente["AMIGAVEL"] = "amigavel";
    PerfilAtendente["PROFISSIONAL"] = "profissional";
})(PerfilAtendente || (exports.PerfilAtendente = PerfilAtendente = {}));
let Atendente = class Atendente {
    isAtivo() {
        return this.ativo;
    }
    ativar() {
        this.ativo = true;
    }
    desativar() {
        this.ativo = false;
    }
    alterarVoz(novaVoz) {
        this.voz = novaVoz;
    }
    alterarPerfil(novoPerfil) {
        this.perfil = novoPerfil;
    }
    getConfiguracaoVoz() {
        return `${this.voz}_${this.perfil}`;
    }
    validarConfiguracao() {
        return !!(this.farmacia_id && this.voz && this.perfil);
    }
    clonarConfiguracao() {
        return {
            voz: this.voz,
            perfil: this.perfil,
            ativo: this.ativo
        };
    }
};
exports.Atendente = Atendente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Atendente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Atendente.prototype, "farmacia_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VozAtendente,
        nullable: false,
        default: VozAtendente.FEMININA
    }),
    __metadata("design:type", String)
], Atendente.prototype, "voz", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PerfilAtendente,
        default: PerfilAtendente.PROFISSIONAL
    }),
    __metadata("design:type", String)
], Atendente.prototype, "perfil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Atendente.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Atendente.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Atendente.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Farmacia', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'farmacia_id' }),
    __metadata("design:type", Object)
], Atendente.prototype, "farmacia", void 0);
exports.Atendente = Atendente = __decorate([
    (0, typeorm_1.Entity)('atendentes')
], Atendente);
//# sourceMappingURL=atendente.entity.js.map