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
exports.MessageQueue = exports.StatusMensagem = exports.TipoMensagem = exports.MessageType = void 0;
const typeorm_1 = require("typeorm");
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["AUDIO"] = "audio";
})(MessageType || (exports.MessageType = MessageType = {}));
var TipoMensagem;
(function (TipoMensagem) {
    TipoMensagem["IA"] = "ia";
    TipoMensagem["STORAGE"] = "storage";
})(TipoMensagem || (exports.TipoMensagem = TipoMensagem = {}));
var StatusMensagem;
(function (StatusMensagem) {
    StatusMensagem["PENDENTE"] = "pendente";
    StatusMensagem["PROCESSANDO"] = "processando";
    StatusMensagem["CONCLUIDO"] = "concluido";
    StatusMensagem["ERRO"] = "erro";
})(StatusMensagem || (exports.StatusMensagem = StatusMensagem = {}));
let MessageQueue = class MessageQueue {
    podeTentarNovamente() {
        return this.tentativas < this.max_tentativas;
    }
    incrementarTentativa() {
        this.tentativas++;
        this.updated_at = new Date();
    }
    marcarComoProcessando() {
        this.status = StatusMensagem.PROCESSANDO;
        this.updated_at = new Date();
    }
    marcarComoConcluido(resposta, remedios) {
        this.status = StatusMensagem.CONCLUIDO;
        this.resposta = resposta;
        this.remedios_encontrados = remedios;
        this.processed_at = new Date();
        this.updated_at = new Date();
    }
    marcarComoErro(erro) {
        this.status = StatusMensagem.ERRO;
        this.erro = erro;
        this.updated_at = new Date();
    }
    toResponseMessage() {
        return {
            id: this.id,
            timestamp: this.updated_at.toISOString(),
            telefone_farmacia: this.telefone_farmacia,
            telefone_cliente: this.telefone_cliente,
            sucesso: this.status === StatusMensagem.CONCLUIDO,
            resposta: this.resposta,
            remedios_encontrados: this.remedios_encontrados,
            erro: this.erro,
        };
    }
    validarDados() {
        return !!(this.telefone_farmacia && this.telefone_cliente && this.nome_cliente);
    }
    isProcessavel() {
        return this.status === StatusMensagem.PENDENTE ||
            (this.status === StatusMensagem.ERRO && this.podeTentarNovamente());
    }
    getTempoProcessamento() {
        if (this.processed_at) {
            return this.processed_at.getTime() - this.created_at.getTime();
        }
        return Date.now() - this.created_at.getTime();
    }
};
exports.MessageQueue = MessageQueue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageQueue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMensagem,
        default: TipoMensagem.IA
    }),
    __metadata("design:type", String)
], MessageQueue.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatusMensagem,
        default: StatusMensagem.PENDENTE
    }),
    __metadata("design:type", String)
], MessageQueue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], MessageQueue.prototype, "telefone_farmacia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], MessageQueue.prototype, "telefone_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], MessageQueue.prototype, "nome_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MessageQueue.prototype, "pergunta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], MessageQueue.prototype, "acao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], MessageQueue.prototype, "dados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MessageQueue.prototype, "resposta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MessageQueue.prototype, "remedios_encontrados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MessageQueue.prototype, "erro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MessageQueue.prototype, "tentativas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 3 }),
    __metadata("design:type", Number)
], MessageQueue.prototype, "max_tentativas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MessageQueue.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MessageQueue.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MessageQueue.prototype, "processed_at", void 0);
exports.MessageQueue = MessageQueue = __decorate([
    (0, typeorm_1.Entity)('message_queue')
], MessageQueue);
//# sourceMappingURL=message-queue.entity.js.map