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
exports.UpdateAtendenteDto = exports.CreateAtendenteDto = void 0;
const class_validator_1 = require("class-validator");
const entities_1 = require("../../domain/entities");
class CreateAtendenteDto {
    constructor() {
        this.voz = entities_1.VozAtendente.FEMININA;
        this.perfil = entities_1.PerfilAtendente.PROFISSIONAL;
        this.ativo = true;
    }
}
exports.CreateAtendenteDto = CreateAtendenteDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'farmacia_id deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateAtendenteDto.prototype, "farmacia_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.VozAtendente, { message: 'voz deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAtendenteDto.prototype, "voz", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.PerfilAtendente, { message: 'perfil deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAtendenteDto.prototype, "perfil", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAtendenteDto.prototype, "ativo", void 0);
class UpdateAtendenteDto {
}
exports.UpdateAtendenteDto = UpdateAtendenteDto;
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.VozAtendente, { message: 'voz deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAtendenteDto.prototype, "voz", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.PerfilAtendente, { message: 'perfil deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAtendenteDto.prototype, "perfil", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateAtendenteDto.prototype, "ativo", void 0);
//# sourceMappingURL=create-atendente.dto.js.map