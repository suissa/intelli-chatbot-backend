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
exports.Remedio = void 0;
const typeorm_1 = require("typeorm");
let Remedio = class Remedio {
    isAtivo() {
        return this.ativo;
    }
    ativar() {
        this.ativo = true;
    }
    desativar() {
        this.ativo = false;
    }
    alterarPreco(novoPreco) {
        if (novoPreco >= 0) {
            this.preco = novoPreco;
        }
    }
    getPrecoFormatado() {
        return `R$ ${this.preco.toFixed(2)}`;
    }
    validarDados() {
        return this.nome.length > 0 && this.preco >= 0;
    }
    matchesSearch(termo) {
        return this.nome.toLowerCase().includes(termo.toLowerCase());
    }
    getInfoResumida() {
        return {
            id: this.id || 0,
            nome: this.nome || '',
            preco: this.preco || 0,
            ativo: this.ativo
        };
    }
};
exports.Remedio = Remedio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Remedio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Remedio.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Remedio.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Remedio.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'produtos_correlacionados', nullable: true }),
    __metadata("design:type", Array)
], Remedio.prototype, "produtosCorrelacionados", void 0);
exports.Remedio = Remedio = __decorate([
    (0, typeorm_1.Entity)('remedios')
], Remedio);
//# sourceMappingURL=remedio.entity.js.map