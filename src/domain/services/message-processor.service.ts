import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { OpenAIService } from './openai.service';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';

export interface ProductAnalysisResult {
  name: string;
  caracteristicasDoProduto: string;
  produtosCorrelacionados: string;
  textoDeVenda: string;
}

export interface MessageProcessingResult {
  success: boolean;
  data?: {
    product: ProductAnalysisResult;
    analysis: string;
  };
  error?: string;
  message: string;
}

export interface IMessageProcessorService {
  processTextMessage(message: string): Promise<MessageProcessingResult>;
  searchProductAndCorrelations(productName: string): Promise<ProductAnalysisResult>;
}

@injectable()
export class MessageProcessorService implements IMessageProcessorService {
  constructor(
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService,
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository
  ) {}

  /**
   * Processa uma mensagem de texto e extrai informações sobre produtos
   */
  async processTextMessage(message: string): Promise<MessageProcessingResult> {
    try {
      console.log('📝 Processando mensagem de texto:', message);

      // Extrair nome do produto da mensagem
      const productName = this.extractProductNameFromMessage(message);
      
      if (!productName || productName.trim().length < 2) {
        return {
          success: false,
          error: 'Nome do produto não encontrado ou muito curto',
          message: 'Não foi possível identificar um produto válido na mensagem'
        };
      }

      console.log('🔍 Produto identificado:', productName);

      // Buscar produto e correlações
      const productAnalysis = await this.searchProductAndCorrelations(productName);

      return {
        success: true,
        data: {
          product: productAnalysis,
          analysis: productAnalysis.textoDeVenda
        },
        message: 'Análise de produto gerada com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro ao processar mensagem de texto:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Erro ao processar mensagem de texto'
      };
    }
  }

  /**
   * Busca produto e suas correlações usando OpenAI
   */
  async searchProductAndCorrelations(productName: string): Promise<ProductAnalysisResult> {
    try {
      console.log('🔍 Pesquisando produto e correlações:', productName);

      // Validar nome do produto
      if (!productName || productName.trim().length < 2) {
        throw new Error('Nome do produto é obrigatório e deve ter pelo menos 2 caracteres');
      }

      // Gerar análise com OpenAI
      const analysis = await this.openaiService.searchProductAndCorrelations(productName);
      console.log('✅ Análise de produto e correlações gerada com sucesso');

      console.log('🔍 Características do produto:', analysis.caracteristicasDoProduto);
      console.log('🔍 Produtos correlacionados:', analysis.produtosCorrelacionados);
      console.log('🔍 Texto de venda:', analysis.textoDeVenda);

      // Salvar produtos correlacionados
      await this.setCorrelatedProducts(productName, analysis.produtosCorrelacionados);

      const productAnalysis: ProductAnalysisResult = {
        name: productName,
        caracteristicasDoProduto: analysis.caracteristicasDoProduto,
        produtosCorrelacionados: analysis.produtosCorrelacionados,
        textoDeVenda: analysis.textoDeVenda
      };

      console.log('🔑 Análise final:', productAnalysis);
      return productAnalysis;

    } catch (error) {
      console.error('❌ Erro ao pesquisar produto e correlações:', error);
      throw error;
    }
  }

  /**
   * Extrai o nome do produto de uma mensagem de texto
   */
  private extractProductNameFromMessage(message: string): string {
    // Implementação básica - pode ser melhorada com NLP
    const words = message.toLowerCase().split(/\s+/);
    
    // Palavras-chave que indicam busca por produto
    const productKeywords = [
      'preciso', 'quero', 'busco', 'procuro', 'encontrei', 'achei',
      'medicamento', 'remedio', 'remédio', 'produto', 'medicina',
      'comprimido', 'cápsula', 'xarope', 'pomada', 'creme'
    ];

    // Procurar por palavras que podem ser nomes de produtos
    const potentialProducts = words.filter(word => 
      word.length > 2 && 
      !productKeywords.includes(word) &&
      !['de', 'da', 'do', 'para', 'com', 'sem', 'por', 'que', 'qual', 'como', 'onde', 'quando'].includes(word)
    );

    if (potentialProducts.length > 0 && potentialProducts[0]) {
      // Retornar a primeira palavra que parece ser um produto
      const firstProduct = potentialProducts[0];
      return firstProduct.charAt(0).toUpperCase() + firstProduct.slice(1);
    }

    // Se não encontrar, retornar a mensagem completa (limitada)
    return message.substring(0, 50).trim();
  }

  /**
   * Salva produtos correlacionados no banco de dados
   */
  private async setCorrelatedProducts(remedioName: string, rawText: string): Promise<void> {
    try {
      console.log('💾 Salvando produtos correlacionados para:', remedioName);
      
      // Extrair nomes de produtos do texto
      const productNames = this.extractProductNamesFromText(rawText);
      
      if (productNames.length === 0) {
        console.log('⚠️ Nenhum produto correlacionado encontrado');
        return;
      }

      console.log('📋 Produtos correlacionados encontrados:', productNames);

      // Salvar cada produto correlacionado
      for (const productName of productNames) {
        try {
          // Verificar se o produto já existe
          const existingDrugs = await this.drugsRepository.getDrugByName(productName);
          if (existingDrugs.length === 0) {
            console.log(`⚠️ Produto não encontrado no banco: ${productName}`);
          } else {
            console.log(`✅ Produto já existe no banco: ${productName}`);
          }
        } catch (error) {
          console.log(`⚠️ Erro ao verificar produto: ${productName}`);
        }
      }

    } catch (error) {
      console.error('❌ Erro ao salvar produtos correlacionados:', error);
    }
  }

  /**
   * Extrai nomes de produtos de um texto
   */
  private extractProductNamesFromText(text: string): string[] {
    // Implementação básica - pode ser melhorada
    const lines = text.split('\n');
    const productNames: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0 && trimmedLine.length < 100) {
        // Remover números e caracteres especiais no início
        const cleanName = trimmedLine.replace(/^[\d\-\.\s]+/, '').trim();
        if (cleanName.length > 2) {
          productNames.push(cleanName);
        }
      }
    }

    return productNames.slice(0, 10); // Limitar a 10 produtos
  }
} 