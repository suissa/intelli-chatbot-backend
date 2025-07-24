import { injectable, inject } from 'inversify';
import { TYPES } from '../../shared/types';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { OpenAIService } from './openai.service';

export interface ITextProcessorService {
  extractDrugFromText(text: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }>;
}

@injectable()
export class TextProcessorService implements ITextProcessorService {
  constructor(
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository,
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService
  ) {}

  async extractDrugFromText(text: string): Promise<{
    success: boolean;
    drugInfo?: any;
    presentation?: string;
    error?: string;
  }> {
    try {
      console.log('🔍 Processando texto para extrair informações de remédio...');
      console.log('📝 Texto recebido:', text);
      
      if (!text || text.trim().length < 3) {
        return {
          success: false,
          error: 'Texto muito curto para análise'
        };
      }

      // 1. Extrair possíveis nomes de remédios do texto
      const drugNames = this.extractPossibleDrugNames(text);
      console.log('💊 Possíveis nomes de remédios encontrados:', drugNames);
      
      if (drugNames.length === 0) {
        return {
          success: false,
          error: 'Nenhum nome de remédio identificado no texto'
        };
      }

      // 2. Buscar remédios no banco de dados
      let foundDrugs: any[] = [];
      
      for (const drugName of drugNames) {
        const drugs = await this.drugsRepository.searchDrugs(drugName);
        foundDrugs = foundDrugs.concat(drugs);
      }

      // Remover duplicatas
      foundDrugs = foundDrugs.filter((drug, index, self) => 
        index === self.findIndex(d => d.id === drug.id)
      );

      console.log(`🔍 Encontrados ${foundDrugs.length} remédios relacionados`);
      
      if (foundDrugs.length === 0) {
        return {
          success: false,
          error: 'Nenhum remédio encontrado no banco de dados com base no texto fornecido'
        };
      }

      // 3. Pegar o primeiro resultado (mais relevante)
      const drugInfo = foundDrugs[0];
      console.log('💊 Remédio encontrado:', drugInfo.nome);

      // 4. Gerar apresentação com OpenAI
      const presentation = await this.openaiService.generateDrugPresentation(drugInfo);
      console.log('✨ Apresentação gerada com sucesso');

      return {
        success: true,
        drugInfo,
        presentation
      };

    } catch (error) {
      console.error('❌ Erro ao processar texto:', error);
      return {
        success: false,
        error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  private extractPossibleDrugNames(text: string): string[] {
    const drugNames: string[] = [];
    
    // Converter para minúsculas para melhor comparação
    const lowerText = text.toLowerCase();
    
    // Padrões comuns para identificar nomes de remédios
    const patterns = [
      // Palavras que podem indicar nomes de remédios
      /\b(paracetamol|dipirona|ibuprofeno|aspirina|omeprazol|loratadina|dramin|dorflex|tylenol|advil|benegrip|resfenol|vick|neosaldina|buscofem|dorflex|tylenol|advil|benegrip|resfenol|vick|neosaldina|buscofem)\b/gi,
      
      // Padrões com sufixos comuns de medicamentos
      /\b\w+(ol|il|ina|am|il|ol|ide|ate|ine|one|azole|mycin|cillin|profen|fen|dol|pam|lam|pril|sartan|statin|zolam|azepam|oxetine|amine|azole|mycin|cillin|profen|fen|dol|pam|lam|pril|sartan|statin|zolam|azepam|oxetine|amine)\b/gi,
      
      // Palavras que começam com maiúscula (possíveis nomes próprios de medicamentos)
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
    ];

    // Extrair palavras que correspondem aos padrões
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        drugNames.push(...matches);
      }
    });

    // Filtrar palavras muito comuns que não são remédios
    const commonWords = [
      'para', 'com', 'sem', 'por', 'que', 'uma', 'uma', 'este', 'esta', 'isso', 'isso',
      'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'sim', 'não', 'não', 'sim',
      'hoje', 'ontem', 'amanhã', 'agora', 'depois', 'antes', 'sempre', 'nunca'
    ];

    const filteredNames = drugNames.filter(name => 
      name.length > 2 && 
      !commonWords.includes(name.toLowerCase()) &&
      !/^\d+$/.test(name) // Não é apenas números
    );

    // Remover duplicatas e retornar
    return [...new Set(filteredNames)];
  }
} 