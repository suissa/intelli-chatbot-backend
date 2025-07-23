import { injectable } from 'inversify';
import OpenAI from 'openai';
import { z } from 'zod';

// Schema Zod para extração de informações de remédios
const DrugsInformationExtraction = z.object({
  comercialName: z.string(),
  genericName: z.array(z.string()),
  manufacturer: z.string(),
  indication: z.string(),
  dosage: z.string(),
  contraindication: z.string(),
  interaction: z.string(),
  modeOfUse: z.string(),
  durationOfEffect: z.string(),
  category: z.string(),
  observations: z.string(),
});

@injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here',
    });
  }

  normalize(raw: string): string {
    return raw
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")        // acentos
      .replace(/[^a-zA-Z0-9]+/g, "")          // tudo que não é letra/num
      .toLowerCase();
  }
  
  async extractDrugInformation(extractedText: string): Promise<any> {
    const prompt = `me de as informações desse remédio: '${this.normalize(extractedText)}', com as seguintes informações: NomeComercial, NomeGenérico, Fabricante, Indicação, Dosagem, Contraindicação, Interação, ModoDeUso, DuraçãoDoEfeito, Categoria, Observações.
            Monte a resposta como se estivesse vendendo-o e ao final pergunte se é realmente o remédio que o cliente deseja. Utilize vários emojis para tornar a resposta mais atrativa.
            Limite a resposta a 200-300 palavras.
            `
    console.log('🔍 Prompt:', prompt);
    try {
      console.log('🔍 Extraindo informações de remédio com OpenAI...');
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.0,
        top_p: 0.0,
        messages: [
          {
            role: "system",
            content: "você é um especialista em extração de informações de remédios e um atendente de farmácia"
          },
          {
            role: "user",
            content: prompt	
          }
        ],
        // response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.1,
      });

      const responseContent = response.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Resposta vazia da OpenAI');
      }

      // Parsear o JSON da resposta
      // const parsedResponse = JSON.parse(responseContent);
      
      // Validar com o schema Zod
      // const drugs_information = DrugsInformationExtraction.parse(parsedResponse);
      
      console.log('✅ Informações extraídas com sucesso:', responseContent  );
      
      return responseContent;
      
    } catch (error) {
      console.error('❌ Erro ao extrair informações com OpenAI:', error);
      throw error;
    }
  }

  async generateDrugPresentation(drugInfo: any): Promise<string> {
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
    } catch (error) {
      console.error('Erro ao gerar apresentação com OpenAI:', error);
      return 'Desculpe, não foi possível gerar a apresentação no momento.';
    }
  }
} 