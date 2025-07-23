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
exports.UpdateFarmaciaDto = exports.CreateFarmaciaDto = exports.HorarioFuncionamentoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class HorarioFuncionamentoDto {
}
exports.HorarioFuncionamentoDto = HorarioFuncionamentoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'segunda deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'segunda deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "segunda", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'terca deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'terca deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "terca", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'quarta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'quarta deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "quarta", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'quinta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'quinta deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "quinta", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'sexta deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'sexta deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "sexta", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'sabado deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'sabado deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "sabado", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'domingo deve ser uma string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'domingo deve ter entre 1 e 50 caracteres' }),
    __metadata("design:type", String)
], HorarioFuncionamentoDto.prototype, "domingo", void 0);
class CreateFarmaciaDto {
    constructor() {
        this.ativo = true;
    }
}
exports.CreateFarmaciaDto = CreateFarmaciaDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone deve ser uma string' }),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\D/g, '')),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'endereco deve ser uma string' }),
    (0, class_validator_1.Length)(5, 500, { message: 'endereco deve ter entre 5 e 500 caracteres' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "endereco", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'cidade deve ser uma string' }),
    (0, class_validator_1.Length)(2, 100, { message: 'cidade deve ter entre 2 e 100 caracteres' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "cidade", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'estado deve ser uma string' }),
    (0, class_validator_1.Length)(2, 2, { message: 'estado deve ter exatamente 2 caracteres' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'cep deve ser uma string' }),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\D/g, '')),
    (0, class_validator_1.Length)(8, 8, { message: 'cep deve ter exatamente 8 dígitos' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'cnpj deve ser uma string' }),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\D/g, '')),
    (0, class_validator_1.Length)(14, 14, { message: 'cnpj deve ter exatamente 14 dígitos' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'email deve ser um email válido' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'website deve ser uma URL válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'descricao deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 1000, { message: 'descricao deve ter no máximo 1000 caracteres' }),
    __metadata("design:type", String)
], CreateFarmaciaDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateFarmaciaDto.prototype, "ativo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ message: 'horario_funcionamento deve ser um objeto válido' }),
    (0, class_transformer_1.Type)(() => HorarioFuncionamentoDto),
    __metadata("design:type", HorarioFuncionamentoDto)
], CreateFarmaciaDto.prototype, "horario_funcionamento", void 0);
class UpdateFarmaciaDto {
}
exports.UpdateFarmaciaDto = UpdateFarmaciaDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'telefone deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\D/g, '')),
    (0, class_validator_1.Length)(10, 11, { message: 'telefone deve ter entre 10 e 11 dígitos' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'endereco deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 500, { message: 'endereco deve ter entre 5 e 500 caracteres' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "endereco", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'cidade deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 100, { message: 'cidade deve ter entre 2 e 100 caracteres' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "cidade", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'estado deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 2, { message: 'estado deve ter exatamente 2 caracteres' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'cep deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\D/g, '')),
    (0, class_validator_1.Length)(8, 8, { message: 'cep deve ter exatamente 8 dígitos' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'email deve ser um email válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'website deve ser uma URL válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'descricao deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 1000, { message: 'descricao deve ter no máximo 1000 caracteres' }),
    __metadata("design:type", String)
], UpdateFarmaciaDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateFarmaciaDto.prototype, "ativo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ message: 'horario_funcionamento deve ser um objeto válido' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => HorarioFuncionamentoDto),
    __metadata("design:type", HorarioFuncionamentoDto)
], UpdateFarmaciaDto.prototype, "horario_funcionamento", void 0);
//# sourceMappingURL=create-farmacia.dto.js.map