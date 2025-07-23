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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const inversify_1 = require("inversify");
const openai_1 = __importDefault(require("openai"));
let OpenAIService = class OpenAIService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here',
        });
    }
    async generateDrugPresentation(drugInfo) {
        try {
            const prompt = `
        Crie uma apresentação de venda atrativa para o seguinte remédio:
        
        Nome: ${drugInfo.nome}
        Categoria: ${drugInfo.categoria}
        Laboratório: ${drugInfo.laboratorio}
        Preço: R$ ${drugInfo.preco}
        Estoque: ${drugInfo.estoque} unidades
        Concentração: ${drugInfo.concentracao}
        Forma Farmacêutica: ${drugInfo.forma_farmaceutica}
        Princípio Ativo: ${drugInfo.principio_ativo}
        Usos: ${drugInfo.usos}
        Efeitos Colaterais: ${drugInfo.efeitos_colaterais}
        Contraindicações: ${drugInfo.contraindicacoes}
        Requer Receita: ${drugInfo.requer_receita ? 'Sim' : 'Não'}
        
        Instruções:
        1. Use muitos emojis relevantes para tornar o texto mais atrativo
        2. Destaque os benefícios do medicamento
        3. Seja persuasivo mas honesto
        4. No final, pergunte se é realmente o remédio que o cliente deseja
        5. Use linguagem amigável e acessível
        6. Limite a resposta a 200-300 palavras
      `;
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Você é um farmacêutico experiente e atencioso que ajuda clientes a encontrar o medicamento ideal."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
            });
            return completion.choices[0]?.message?.content || 'Erro ao gerar apresentação';
        }
        catch (error) {
            console.error('Erro ao gerar apresentação com OpenAI:', error);
            return 'Desculpe, não foi possível gerar a apresentação no momento.';
        }
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map