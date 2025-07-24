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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextProcessorServiceImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
const drugs_repository_1 = require("../../infrastructure/repositories/drugs.repository");
const openai_service_1 = require("./openai.service");
let TextProcessorServiceImpl = class TextProcessorServiceImpl {
    constructor(drugsRepository, openaiService) {
        this.drugsRepository = drugsRepository;
        this.openaiService = openaiService;
    }
    async extractDrugFromText(text) {
        try {
            console.log('🔍 Processando texto para extrair informações de remédio...');
            console.log('📝 Texto recebido:', text);
            if (!text || text.trim().length < 3) {
                return {
                    success: false,
                    error: 'Texto muito curto para análise'
                };
            }
            const drugNames = this.extractPossibleDrugNames(text);
            console.log('💊 Possíveis nomes de remédios encontrados:', drugNames);
            if (drugNames.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum nome de remédio identificado no texto'
                };
            }
            let foundDrugs = [];
            for (const drugName of drugNames) {
                const drugs = await this.drugsRepository.searchDrugs(drugName);
                foundDrugs = foundDrugs.concat(drugs);
            }
            foundDrugs = foundDrugs.filter((drug, index, self) => index === self.findIndex(d => d.id === drug.id));
            console.log(`🔍 Encontrados ${foundDrugs.length} remédios relacionados`);
            if (foundDrugs.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum remédio encontrado no banco de dados com base no texto fornecido'
                };
            }
            const drugInfo = foundDrugs[0];
            console.log('💊 Remédio encontrado:', drugInfo.nome);
            const presentation = await this.openaiService.generateDrugPresentation(drugInfo);
            console.log('✨ Apresentação gerada com sucesso');
            return {
                success: true,
                drugInfo,
                presentation
            };
        }
        catch (error) {
            console.error('❌ Erro ao processar texto:', error);
            return {
                success: false,
                error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
        }
    }
    extractPossibleDrugNames(text) {
        const drugNames = [];
        const lowerText = text.toLowerCase();
        const patterns = [
            /\b(paracetamol|dipirona|ibuprofeno|aspirina|omeprazol|loratadina|dramin|dorflex|tylenol|advil|benegrip|resfenol|vick|neosaldina|buscofem|dorflex|tylenol|advil|benegrip|resfenol|vick|neosaldina|buscofem)\b/gi,
            /\b\w+(ol|il|ina|am|il|ol|ide|ate|ine|one|azole|mycin|cillin|profen|fen|dol|pam|lam|pril|sartan|statin|zolam|azepam|oxetine|amine|azole|mycin|cillin|profen|fen|dol|pam|lam|pril|sartan|statin|zolam|azepam|oxetine|amine)\b/gi,
            /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
        ];
        patterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                drugNames.push(...matches);
            }
        });
        const commonWords = [
            'para', 'com', 'sem', 'por', 'que', 'uma', 'uma', 'este', 'esta', 'isso', 'isso',
            'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'sim', 'não', 'não', 'sim',
            'hoje', 'ontem', 'amanhã', 'agora', 'depois', 'antes', 'sempre', 'nunca'
        ];
        const filteredNames = drugNames.filter(name => name.length > 2 &&
            !commonWords.includes(name.toLowerCase()) &&
            !/^\d+$/.test(name));
        return [...new Set(filteredNames)];
    }
};
exports.TextProcessorServiceImpl = TextProcessorServiceImpl;
exports.TextProcessorServiceImpl = TextProcessorServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DrugsRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OpenAIService)),
    __metadata("design:paramtypes", [drugs_repository_1.DrugsRepository,
        openai_service_1.OpenAIService])
], TextProcessorServiceImpl);
//# sourceMappingURL=text-processor.service.js.map