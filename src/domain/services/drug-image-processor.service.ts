import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/types';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { OCRService } from './ocr';
import { OpenAIService } from './openai.service';
import path from 'path';
import fs from 'fs';

export interface DrugImageProcessorService {
  processPixImage(imagePath: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }>;
  processDrugImage(imagePath: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }>;
  processDrugImageBuffer(imageBuffer: Buffer): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }>;
}

@injectable()
export class DrugImageProcessorServiceImpl implements DrugImageProcessorService {
  constructor(
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository,
    @inject(TYPES.OCRService) private ocrService: OCRService,
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService
  ) {}

  
  async processPixImage(imagePath: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }> {
    try {
      console.log('🔍 Processando imagem do pix...');
      
      // 1. Extrair texto da imagem usando OCR
      const extractedText = await this.ocrService.reconhecerTexto(imagePath);
      console.log('📝 Texto extraído:', extractedText);
      
      if (!extractedText || extractedText.trim().length < 5) {
        return {
          success: false,
          error: 'Não foi possível extrair texto suficiente da imagem'
        };
      }

      
      console.log('🤖 Enviando texto para extração de informações com OpenAI...');
      const drugName = await this.openaiService.extractPixInformation(extractedText);
      console.log('💊 Informações extraídas pix:', drugName);
      
      
      return {
        success: true,
        drugInfo: drugName,
        presentation: ''
      };

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  async processDrugImage(imagePath: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }> {
    try {
      console.log('🔍 Processando imagem de remédio...');
      
      // 1. Extrair texto da imagem usando OCR
      const extractedText = await this.ocrService.reconhecerTexto(imagePath);
      console.log('📝 Texto extraído:', extractedText);
      
      if (!extractedText || extractedText.trim().length < 5) {
        return {
          success: false,
          error: 'Não foi possível extrair texto suficiente da imagem'
        };
      }

      
      console.log('🤖 Enviando texto para extração de informações com OpenAI...');
      const drugName = await this.openaiService.extractDrugInformation(extractedText);
      console.log('💊 Informações extraídas drugName:', drugName);
      
      // 2. Buscar remédio no banco de dados
      const drugs = await this.drugsRepository.searchDrugs(drugName);
      console.log(`🔍 Encontrados ${drugs.length} remédios relacionados`);
      
      if (drugs.length === 0) {
        return {
          success: false,
          error: 'Nenhum remédio encontrado com base no texto extraído da imagem'
        };
      }

      // 3. Pegar o primeiro resultado (mais relevante)
      const drugInfo = drugs[0];
      if (!drugInfo) {
        return {
          success: false,
          error: 'Nenhum remédio encontrado'
        };
      }
      console.log('💊 Remédio encontrado:', drugInfo.nome);

      return {
        success: true,
        drugInfo: drugInfo.nome,
        presentation: ''
      };
      // 4. Gerar apresentação com OpenAI
      const presentation = await this.openaiService.generateDrugPresentation(drugInfo);
      console.log('✨ Apresentação gerada com sucesso');

      return {
        success: true,
        drugInfo,
        presentation
      };

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
  async processDrugImageCompleto(imagePath: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }> {
    try {
      console.log('🔍 Processando imagem de remédio...');
      
      // 1. Extrair texto da imagem usando OCR
      const extractedText = await this.ocrService.reconhecerTexto(imagePath);
      console.log('📝 Texto extraído:', extractedText);
      
      if (!extractedText || extractedText.trim().length < 5) {
        return {
          success: false,
          error: 'Não foi possível extrair texto suficiente da imagem'
        };
      }

      
      console.log('🤖 Enviando texto para extração de informações com OpenAI...');
      const drugsInformation = await this.openaiService.extractDrugInformation(extractedText);
      console.log('💊 Informações extraídas:', drugsInformation);
      const nomeComercial = (drugsInformation.match(/\*\*Nome Comercial:\*\*\s*([^\r\n]+)/i) || [,''])[1].trim();
      const nomeGenerico = (drugsInformation.match(/\*\*Nome Genérico:\*\*\s*([^\r\n]+)/i) || [,''])[1].trim();
      let nomeRemedio = nomeComercial;
      if (!nomeGenerico.toLowerCase().includes('não especificado') && !nomeGenerico.toLowerCase().includes('não informado')) {
        nomeRemedio = nomeGenerico;
      }
      // 2. Buscar remédio no banco de dados
      const drugs = await this.drugsRepository.searchDrugs(extractedText);
      console.log(`🔍 Encontrados ${drugs.length} remédios relacionados`);
      
      if (drugs.length === 0) {
        return {
          success: false,
          error: 'Nenhum remédio encontrado com base no texto extraído da imagem'
        };
      }

      // 3. Pegar o primeiro resultado (mais relevante)
      const drugInfo = drugs[0];
      if (!drugInfo) {
        return {
          success: false,
          error: 'Nenhum remédio encontrado'
        };
      }
      console.log('💊 Remédio encontrado:', drugInfo.nome);

      return {
        success: true,
        drugInfo: drugInfo.nome,
        presentation: ''
      };
      // 4. Gerar apresentação com OpenAI
      const presentation = await this.openaiService.generateDrugPresentation(drugInfo);
      console.log('✨ Apresentação gerada com sucesso');

      return {
        success: true,
        drugInfo,
        presentation
      };

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      return {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
  async processDrugImageBuffer(imageBuffer: Buffer): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }> {
    try {
      console.log('🔍 Processando imagem de remédio do buffer...');
      
      // 1. Extrair texto da imagem usando OCR do buffer
      const extractedText = await this.ocrService.reconhecerTextoFromBuffer(imageBuffer);
      console.log('📝 Texto extraído:', extractedText);
      
      if (!extractedText || extractedText.trim().length < 5) {
        return {
          success: false,
          error: 'Não foi possível extrair texto suficiente da imagem'
        };
      }

      // 2. Extrair informações do remédio usando OpenAI com schema Zod
      console.log('🤖 Enviando texto para extração de informações com OpenAI...');
      const drugsInformation = await this.openaiService.extractDrugInformation(extractedText);
      
      if (!drugsInformation) {
        return {
          success: false,
          error: 'Não foi possível extrair informações do remédio'
        };
      }

      console.log('💊 Informações extraídas:', drugsInformation);
      const nomeComercial = (drugsInformation.match(/\*\*Nome Comercial:\*\*\s*([^\r\n]+)/i) || [,''])[1].trim();
      const nomeGenerico = (drugsInformation.match(/\*\*Nome Genérico:\*\*\s*([^\r\n]+)/i) || [,''])[1].trim();
      let nomeRemedio = nomeComercial;
      if (!nomeGenerico.toLowerCase().includes('não especificado') && !nomeGenerico.toLowerCase().includes('não informado')) {
        nomeRemedio = nomeGenerico;
      }
      // 3. Buscar remédio no banco de dados usando o nome comercial
      const drugs = await this.drugsRepository.searchDrugs(nomeRemedio);
      console.log(`🔍 Encontrados ${drugs.length} remédios relacionados`);

      // Se não encontrar no banco, usar as informações extraídas
      // const drugInfo = drugs.length > 0 ? drugs[0]! : {
      //   nome: drugsInformation.comercialName,
      //   categoria: drugsInformation.category,
      //   laboratorio: drugsInformation.manufacturer,
      //   principio_ativo: drugsInformation.genericName.join(', '),
      //   usos: drugsInformation.indication,
      //   contraindicacoes: drugsInformation.contraindication,
      //   efeitos_colaterais: drugsInformation.interaction,
      //   modo_uso: drugsInformation.modeOfUse,
      //   observacoes: drugsInformation.observations,
      //   preco: 'Não informado',
      //   estoque: 'Não informado',
      //   concentracao: drugsInformation.dosage,
      //   forma_farmaceutica: 'Não informado',
      //   requer_receita: false
      // };

      if (drugs.length > 0) {
        console.log('💊 Remédio encontrado no banco:', drugs[0]?.nome);
      } else {
        console.log('💊 Usando informações extraídas da IA');
      }

      // 4. Gerar apresentação com OpenAI
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

    } catch (error) {
      console.error('❌ Erro ao processar imagem do buffer:', error);
      return {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
} 