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
exports.DrugImageProcessorServiceImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
const ocr_1 = require("./ocr");
const openai_service_1 = require("./openai.service");
let DrugImageProcessorServiceImpl = class DrugImageProcessorServiceImpl {
    constructor(drugsRepository, ocrService, openaiService) {
        this.drugsRepository = drugsRepository;
        this.ocrService = ocrService;
        this.openaiService = openaiService;
    }
    async processDrugImage(imagePath) {
        try {
            console.log('🔍 Processando imagem de remédio...');
            const extractedText = await this.ocrService.reconhecerTexto(imagePath);
            console.log('📝 Texto extraído:', extractedText);
            if (!extractedText || extractedText.trim().length < 5) {
                return {
                    success: false,
                    error: 'Não foi possível extrair texto suficiente da imagem'
                };
            }
            const drugs = await this.drugsRepository.searchDrugs(extractedText);
            console.log(`🔍 Encontrados ${drugs.length} remédios relacionados`);
            if (drugs.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum remédio encontrado com base no texto extraído da imagem'
                };
            }
            const drugInfo = drugs[0];
            if (!drugInfo) {
                return {
                    success: false,
                    error: 'Nenhum remédio encontrado'
                };
            }
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
            console.error('❌ Erro ao processar imagem:', error);
            return {
                success: false,
                error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
        }
    }
    async processDrugImageBuffer(imageBuffer) {
        try {
            console.log('🔍 Processando imagem de remédio do buffer...');
            const extractedText = await this.ocrService.reconhecerTextoFromBuffer(imageBuffer);
            console.log('📝 Texto extraído:', extractedText);
            if (!extractedText || extractedText.trim().length < 5) {
                return {
                    success: false,
                    error: 'Não foi possível extrair texto suficiente da imagem'
                };
            }
            console.log('🤖 Enviando texto para extração de informações com OpenAI...');
            const drugsInformation = await this.openaiService.extractDrugInformation(extractedText);
            if (!drugsInformation) {
                return {
                    success: false,
                    error: 'Não foi possível extrair informações do remédio'
                };
            }
            console.log('💊 Informações extraídas:', drugsInformation);
            const nomeComercial = (drugsInformation.match(/\*\*Nome Comercial:\*\*\s*([^\r\n]+)/i) || [, ''])[1].trim();
            const nomeGenerico = (drugsInformation.match(/\*\*Nome Genérico:\*\*\s*([^\r\n]+)/i) || [, ''])[1].trim();
            let nomeRemedio = nomeComercial;
            if (!nomeGenerico.toLowerCase().includes('não especificado') && !nomeGenerico.toLowerCase().includes('não informado')) {
                nomeRemedio = nomeGenerico;
            }
            const drugs = await this.drugsRepository.searchDrugs(nomeRemedio);
            console.log(`🔍 Encontrados ${drugs.length} remédios relacionados`);
            if (drugs.length > 0) {
                console.log('💊 Remédio encontrado no banco:', drugs[0]?.nome);
            }
            else {
                console.log('💊 Usando informações extraídas da IA');
            }
            const presentation = await this.openaiService.generateDrugPresentation(drugs[0]);
            console.log('✨ Apresentação gerada com sucesso');
            return {
                success: true,
                drugInfo: {
                    ...drugs[0],
                    extractedInformation: drugsInformation
                },
                presentation
            };
        }
        catch (error) {
            console.error('❌ Erro ao processar imagem do buffer:', error);
            return {
                success: false,
                error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
        }
    }
};
exports.DrugImageProcessorServiceImpl = DrugImageProcessorServiceImpl;
exports.DrugImageProcessorServiceImpl = DrugImageProcessorServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DrugsRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OCRService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.OpenAIService)),
    __metadata("design:paramtypes", [Object, ocr_1.OCRService,
        openai_service_1.OpenAIService])
], DrugImageProcessorServiceImpl);
//# sourceMappingURL=drug-image-processor.service.js.map