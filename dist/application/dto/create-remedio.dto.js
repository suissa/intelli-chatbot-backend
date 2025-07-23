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
exports.AtualizarEstoqueDto = exports.UpdateRemedioDto = exports.CreateRemedioDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRemedioDto {
    constructor() {
        this.ativo = true;
    }
}
exports.CreateRemedioDto = CreateRemedioDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'categoria deve ser uma string' }),
    (0, class_validator_1.Length)(1, 100, { message: 'categoria deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'laboratorio deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'laboratorio deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "laboratorio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'preco deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'preco deve ser maior ou igual a 0' }),
    (0, class_validator_1.Max)(999999.99, { message: 'preco deve ser menor que 1.000.000' }),
    __metadata("design:type", Number)
], CreateRemedioDto.prototype, "preco", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'estoque deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'estoque deve ser maior ou igual a 0' }),
    (0, class_validator_1.Max)(999999, { message: 'estoque deve ser menor que 1.000.000' }),
    __metadata("design:type", Number)
], CreateRemedioDto.prototype, "estoque", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'concentracao deve ser uma string' }),
    (0, class_validator_1.Length)(1, 100, { message: 'concentracao deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "concentracao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'forma_farmaceutica deve ser uma string' }),
    (0, class_validator_1.Length)(1, 100, { message: 'forma_farmaceutica deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "forma_farmaceutica", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'data_fabricacao deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "data_fabricacao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'data_validade deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "data_validade", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'requer_receita deve ser um valor booleano' }),
    __metadata("design:type", Boolean)
], CreateRemedioDto.prototype, "requer_receita", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRemedioDto.prototype, "ativo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'principio_ativo deve ser uma string' }),
    (0, class_validator_1.Length)(2, 255, { message: 'principio_ativo deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "principio_ativo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'efeitos_colaterais deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'efeitos_colaterais deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "efeitos_colaterais", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'contraindicacoes deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'contraindicacoes deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "contraindicacoes", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'usos deve ser uma string' }),
    (0, class_validator_1.Length)(1, 1000, { message: 'usos deve ter entre 1 e 1000 caracteres' }),
    __metadata("design:type", String)
], CreateRemedioDto.prototype, "usos", void 0);
class UpdateRemedioDto {
}
exports.UpdateRemedioDto = UpdateRemedioDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'nome deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'categoria deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 100, { message: 'categoria deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'laboratorio deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 255, { message: 'laboratorio deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "laboratorio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'preco deve ser um número' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'preco deve ser maior ou igual a 0' }),
    (0, class_validator_1.Max)(999999.99, { message: 'preco deve ser menor que 1.000.000' }),
    __metadata("design:type", Number)
], UpdateRemedioDto.prototype, "preco", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'estoque deve ser um número' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'estoque deve ser maior ou igual a 0' }),
    (0, class_validator_1.Max)(999999, { message: 'estoque deve ser menor que 1.000.000' }),
    __metadata("design:type", Number)
], UpdateRemedioDto.prototype, "estoque", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'concentracao deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 100, { message: 'concentracao deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "concentracao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'forma_farmaceutica deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 100, { message: 'forma_farmaceutica deve ter entre 1 e 100 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "forma_farmaceutica", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'data_fabricacao deve ser uma data válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "data_fabricacao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'data_validade deve ser uma data válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "data_validade", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'requer_receita deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRemedioDto.prototype, "requer_receita", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'ativo deve ser um valor booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRemedioDto.prototype, "ativo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'principio_ativo deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 255, { message: 'principio_ativo deve ter entre 2 e 255 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "principio_ativo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'efeitos_colaterais deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'efeitos_colaterais deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "efeitos_colaterais", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'contraindicacoes deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'contraindicacoes deve ter no máximo 2000 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "contraindicacoes", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'usos deve ser uma string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 1000, { message: 'usos deve ter entre 1 e 1000 caracteres' }),
    __metadata("design:type", String)
], UpdateRemedioDto.prototype, "usos", void 0);
class AtualizarEstoqueDto {
}
exports.AtualizarEstoqueDto = AtualizarEstoqueDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'quantidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'quantidade deve ser maior que 0' }),
    __metadata("design:type", Number)
], AtualizarEstoqueDto.prototype, "quantidade", void 0);
//# sourceMappingURL=create-remedio.dto.js.map