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
exports.ProcessMessageDto = exports.UpdateMessageQueueDto = exports.CreateMessageQueueDto = void 0;
const class_validator_1 = require("class-validator");
const entities_1 = require("../../domain/entities");
class CreateMessageQueueDto {
    constructor() {
        this.tipo = entities_1.TipoMensagem.IA;
        this.max_tentativas = 3;
    }
}
exports.CreateMessageQueueDto = CreateMessageQueueDto;
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.TipoMensagem, { message: 'tipo deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone_farmacia deve ser uma string' }),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone_farmacia deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "telefone_farmacia", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone_cliente deve ser uma string' }),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone_cliente deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "telefone_cliente", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome_cliente deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'nome_cliente deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "nome_cliente", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'pergunta deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'pergunta deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "pergunta", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'acao deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 100, { message: 'acao deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateMessageQueueDto.prototype, "acao", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMessageQueueDto.prototype, "dados", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'max_tentativas deve ser um número' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1, { message: 'max_tentativas deve ser maior que 0' }),
    (0, class_validator_1.Max)(10, { message: 'max_tentativas deve ser menor ou igual a 10' }),
    __metadata("design:type", Number)
], CreateMessageQueueDto.prototype, "max_tentativas", void 0);
class UpdateMessageQueueDto {
}
exports.UpdateMessageQueueDto = UpdateMessageQueueDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'resposta deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'resposta deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], UpdateMessageQueueDto.prototype, "resposta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateMessageQueueDto.prototype, "remedios_encontrados", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'erro deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 1000, { message: 'erro deve ter no máximo 1000 caracteres' }),
    __metadata("design:type", String)
], UpdateMessageQueueDto.prototype, "erro", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entities_1.StatusMensagem, { message: 'status deve ser um valor válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMessageQueueDto.prototype, "status", void 0);
class ProcessMessageDto {
}
exports.ProcessMessageDto = ProcessMessageDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'resposta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' }),
    __metadata("design:type", String)
], ProcessMessageDto.prototype, "resposta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ProcessMessageDto.prototype, "remedios_encontrados", void 0);
//# sourceMappingURL=create-message-queue.dto.js.map