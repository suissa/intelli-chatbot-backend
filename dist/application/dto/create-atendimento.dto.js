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
exports.FinalizarAtendimentoDto = exports.UpdateAtendimentoDto = exports.CreateAtendimentoDto = void 0;
const class_validator_1 = require("class-validator");
const entities_1 = require("../../domain/entities");
class CreateAtendimentoDto {
    constructor() {
        this.tipo = entities_1.TipoAtendimento.IA;
    }
}
exports.CreateAtendimentoDto = CreateAtendimentoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone_cliente deve ser uma string' }),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone_cliente deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "telefone_cliente", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone_farmacia deve ser uma string' }),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone_farmacia deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "telefone_farmacia", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'data_hora deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "data_hora", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.TipoAtendimento, { message: 'tipo deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'pergunta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 2000, { message: 'pergunta deve ter entre 1 e 2000 caracteres' }),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "pergunta", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'farmacia_id deve ser um UUID válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "farmacia_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'atendente_id deve ser um UUID válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAtendimentoDto.prototype, "atendente_id", void 0);
class UpdateAtendimentoDto {
}
exports.UpdateAtendimentoDto = UpdateAtendimentoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'resposta deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' }),
    __metadata("design:type", String)
], UpdateAtendimentoDto.prototype, "resposta", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.StatusAtendimento, { message: 'status deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAtendimentoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'atendente_id deve ser um UUID válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAtendimentoDto.prototype, "atendente_id", void 0);
class FinalizarAtendimentoDto {
}
exports.FinalizarAtendimentoDto = FinalizarAtendimentoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'resposta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' }),
    __metadata("design:type", String)
], FinalizarAtendimentoDto.prototype, "resposta", void 0);
//# sourceMappingURL=create-atendimento.dto.js.map