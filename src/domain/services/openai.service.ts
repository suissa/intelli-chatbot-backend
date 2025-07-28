import { injectable } from 'inversify';
import OpenAI from 'openai';
import { z } from 'zod';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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
  private drugsRepository: DrugsRepository;
  constructor() {
    console.log('🔑 OPENAI_API_KEY utilizada:', process.env.OPENAI_API_KEY); 
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here',
    });
    this.drugsRepository = new DrugsRepository();
  }

  async searchProductAndCorrelations(productName: string): Promise<any> {
    try {
      console.log('🔍 Pesquisando produto e correlações...');
      
      const prompt = `
        Você é um ótimo vendedor de farmácia, experiente e persuasivo. 
        
        Produto pesquisado: ${productName}
        
        
        Sua tarefa é:
        1. Analisar o produto pesquisado e listar suas características principais
        2. Identificar 3-5 produtos correlacionados que normalmente são comprados em conjunto (use seu conhecimento sobre farmácia)
        3. Criar um texto persuasivo de venda tentando vender um dos produtos correlacionados junto com o produto pesquisado
        
        Formato da resposta:
        **CARACTERÍSTICAS DO PRODUTO:**
        [Liste as características principais do produto pesquisado]
        
        **PRODUTOS CORRELACIONADOS:**
        [Liste 10 produtos que são comprados em conjunto, com nome, preço e categoria] na seguinte estrutura:
        [Nome] - [Preço] - [Categoria]
        no Nome retorne apenas o nome do produto sem ordem numerica
        
        **TEXTO DE VENDA:**
        [Crie um texto persuasivo tentando vender um produto correlacionado junto com o produto pesquisado. Seja um ótimo vendedor, use emojis, destaque benefícios, seja convincente mas honesto]
        
        Use muitos emojis relevantes e seja muito persuasivo como um excelente vendedor!
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um vendedor de farmácia experiente, persuasivo e muito bom em identificar necessidades dos clientes e sugerir produtos complementares."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
      });

      const responseContent = response.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Resposta vazia da OpenAI');
      }

            console.log('✅ Análise de produto e correlações gerada com sucesso');
      console.log('🔍 Resposta:', responseContent);
      
      // Extrair as seções da resposta usando regex
      const caracteristicasMatch = responseContent.match(/\*\*CARACTERÍSTICAS DO PRODUTO:\*\*\s*([\s\S]*?)(?=\*\*PRODUTOS CORRELACIONADOS:\*\*)/i);
      const produtosMatch = responseContent.match(/\*\*PRODUTOS CORRELACIONADOS:\*\*\s*([\s\S]*?)(?=\*\*TEXTO DE VENDA:\*\*)/i);
      const textoMatch = responseContent.match(/\*\*TEXTO DE VENDA:\*\*\s*([\s\S]*?)$/i);
      
      const caracteristicasDoProduto = caracteristicasMatch ? caracteristicasMatch[1]!.trim() : 'Não encontrado';
      const produtosCorrelacionados = produtosMatch ? produtosMatch[1]!.trim() : 'Não encontrado';
      const textoDeVenda = textoMatch ? textoMatch[1]!.trim() : 'Não encontrado';
      
      console.log('🔍 Características:', caracteristicasDoProduto);
      console.log('🔍 Produtos correlacionados:', produtosCorrelacionados);
      console.log('🔍 Texto de venda:', textoDeVenda);
      
      // Retornar como objeto estruturado (como em Python)
      return {
        caracteristicasDoProduto,
        produtosCorrelacionados,
        textoDeVenda
      };
      
    } catch (error) {
      console.error('❌ Erro ao pesquisar produto e correlações:', error);
      throw error;
    }
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

  async transcribeAudio(audioFilePath: string): Promise<string> {
    try {
      console.log('🎵 Iniciando transcrição de áudio...');
      console.log(`📁 Arquivo: ${audioFilePath}`);
      
      // Verificar se o arquivo existe
      const fs = await import('fs');
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Arquivo de áudio não encontrado: ${audioFilePath}`);
      }

      // Verificar extensão do arquivo
      const fileExtension = audioFilePath.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'mp3' && fileExtension !== 'wav' && fileExtension !== 'm4a') {
        throw new Error(`Formato de arquivo não suportado: ${fileExtension}. Formatos suportados: mp3, wav, m4a`);
      }

      console.log('🔄 Enviando arquivo para transcrição...');
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "gpt-4o-transcribe",
        language: "pt",
        response_format: "json",
      });
      console.log('🔍 Transcription:', transcription);
      const transcribedText = transcription.text;
      
      console.log('✅ Transcrição concluída com sucesso');
      console.log(`📝 Texto transcrito: ${transcribedText.substring(0, 100)}...`);
      
      return transcribedText;
    } catch (error) {
      console.error('❌ Erro ao transcrever áudio:', error);
      throw error;
    }
  }



  async transcribeAudioBase64(audioFilePath: string): Promise<string> {
    try {
      console.log('🎵 Iniciando transcrição de áudio...');
      console.log(`📁 Arquivo: ${audioFilePath}`);
      
      // Verificar se o arquivo existe
      const fs = await import('fs');
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Arquivo de áudio não encontrado: ${audioFilePath}`);
      }

      // Verificar extensão do arquivo
      const fileExtension = audioFilePath.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'mp3' && fileExtension !== 'wav' && fileExtension !== 'm4a') {
        throw new Error(`Formato de arquivo não suportado: ${fileExtension}. Formatos suportados: mp3, wav, m4a`);
      }

      console.log('🔄 Enviando arquivo para transcrição...');
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "gpt-4o-transcribe",
        language: "pt",
        response_format: "json",
      });
      console.log('🔍 Transcription:', transcription);
      const transcribedText = transcription.text;
      
      console.log('✅ Transcrição concluída com sucesso');
      console.log(`📝 Texto transcrito: ${transcribedText.substring(0, 100)}...`);
      
      return transcribedText;
    } catch (error) {
      console.error('❌ Erro ao transcrever áudio:', error);
      throw error;
    }
  }

  async transcribeAudioFromBuffer(audioBuffer: Buffer, filename: string = 'audio.mp3'): Promise<string> {
    try {
      console.log('🎵 Iniciando transcrição de áudio a partir do buffer...');
      console.log(`📁 Nome do arquivo: ${filename}`);
      console.log(`📊 Tamanho do buffer: ${audioBuffer.length} bytes`);
      
      // Verificar extensão do arquivo
      const fileExtension = filename.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'mp3' && fileExtension !== 'wav' && fileExtension !== 'm4a') {
        throw new Error(`Formato de arquivo não suportado: ${fileExtension}. Formatos suportados: mp3, wav, m4a`);
      }

      console.log('🔄 Enviando buffer para transcrição...');
      
      // Criar um arquivo temporário a partir do buffer
      const fs = await import('fs');
      const path = await import('path');
      const tempDir = path.join(process.cwd(), 'temp');
      
      // Criar diretório temp se não existir
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFilePath = path.join(tempDir, filename);
      fs.writeFileSync(tempFilePath, audioBuffer);
      
      try {
        const transcription = await this.openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: "gpt-4o-transcribe",
        });

        const transcribedText = transcription.text;
        
        console.log('✅ Transcrição concluída com sucesso');
        console.log(`📝 Texto transcrito: ${transcribedText.substring(0, 100)}...`);
        
        return transcribedText;
      } finally {
        // Limpar arquivo temporário
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao transcrever áudio do buffer:', error);
      throw error;
    }
  }

  async queryProduct(userMessage: string, history: ChatCompletionMessageParam[] = []) {
    const flatHistory = history
      .map((msg) => `${msg.role === 'user' ? 'Cliente' : 'Atendente'}: ${msg.content}`)
      .join('\n');

      console.log("flatHistory", flatHistory);
    const systemPrompt: ChatCompletionMessageParam = {
      role: 'system',
      name: 'system',
      content: `
  Você é um vendedor sênior de farmácia. Siga este fluxo: 
  Você deve lembrar dos medicamentos mencionados anteriormente mesmo se o cliente não repetir o nome.
  Se o cliente disser algo como "quero ele", use o último medicamento que você sugeriu.

  1. Sempre que o cliente falar (saudação ou pergunta), responda adequadamente.
  2. Se perguntar for um remédio, extraia o nome do medicamento.
  3. Se o cliente falar sobre um remédio, **mas não citar um nome claro**, pergunte "Você sabe o nome do medicamento ou já usou algum exemplo que possa me dizer?".
  Só chame a função \`check_inventory\` se tiver o nome real de um medicamento.
  4. Se não tiver estoque, responda “Desculpe, não temos {medicamento} em estoque.” e termine.
  5. Se tiver estoque:
     a) O modelo mesmo deve gerar 10 produtos relacionados que sejam usados em conjunto com o remédio, com nome e um preço estimado.
     b) Envie ao cliente: “Temos {medicamento} por R$ {preco}. 
     Também possuímos: {produto relacionado 1} por R$ {preco1}. Na compra dos 2, oferecemos 10% de desconto. Deseja seguir com esse combo ou apenas {medicamento}?”
  6. Aguarde a resposta do cliente.
  7. Se o cliente confirmar a compra (combo ou item único), gere a chave PIX.
  8. Retorne ao cliente a chave PIX 123456.
  Histórico da conversa até agora:
${flatHistory}

Agora responda à próxima mensagem do cliente, considerando o histórico acima.
`.trim()
    };
  
    // Monta o histórico completo
    const promptMessages: ChatCompletionMessageParam[] = [
      systemPrompt,
      { role: 'user', content: userMessage, name: 'user' }
    ];
    console.log("promptMessages", promptMessages);
    const functions = [
      {
        name: 'check_inventory',
        description: 'GET /api/drugs/search?q=… — retorna { success: boolean, data:{ medicamento: string, preco: number } }',
        parameters: {
          type: 'object',
          properties: {
            medicamento: { type: 'string' },
          },
          required: ['medicamento'],
        },
  
      },
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: promptMessages,
        functions,
      function_call: 'auto',
      max_tokens: 1000,
    });

    if (response?.choices[0]?.finish_reason === 'function_call') {
      const functionCall = response.choices[0]?.message?.function_call;
      const args = functionCall ? JSON.parse(functionCall.arguments) : {};
      const nomeRemedio = args.medicamento || '';

      const products = await this.drugsRepository.searchDrugs(nomeRemedio);

      
      if (products.length > 0) {
        if (products[0]?.produtosCorrelacionados == null) {
          const productsCorrelacionados = await this.searchProductAndCorrelations(response?.choices[0]?.message?.content || '');
          products[0]!.produtosCorrelacionados = productsCorrelacionados;
          const produto = products[0];
          const correlacionado = produto?.produtosCorrelacionados[0]; // Pega o primeiro correlacionado para o exemplo
          
          const textoVenda = await this.generateVendaPersuasiva(
            produto?.nome || '',
            correlacionado?.name || '',
            produto?.preco || 0,
            correlacionado?.price || 0
          );
          console.log("VENHAA textoVenda", textoVenda);
          // Agora envie textoVenda como resposta final ao usuário (ou inclua junto do seu objeto de retorno)
          return {
            content: textoVenda,
            produto,
            found: true
          };
        }
        return products;

      }
      const fallbackMessage = `❌ Desculpe, não temos ${nomeRemedio} em estoque.`;
  
      return {
        role: 'assistant',
        name: 'assistant',
        content: fallbackMessage
      } satisfies ChatCompletionMessageParam;
    }
    return response?.choices[0]?.message;
  }

  async generateVendaPersuasiva(produto: string, correlacionado: string, preco: number, precoCorrelacionado: number): Promise<string> {
    const prompt = `
    Você é um vendedor sênior de farmácia muito persuasivo e empático.
    Monte um texto curto e objetivo, incentivando o cliente a levar tanto ${produto} quanto ${correlacionado}, explicando rapidamente o benefício de cada um.
    Explique que, levando os dois, o cliente recebe 10% de desconto no valor total (R$ ${(preco + precoCorrelacionado).toFixed(2)}), e informe o preço já com desconto.
    Seja amigável, use alguns emojis e sempre termine perguntando: "Posso reservar esse combo para você?"
    `;
    
      const totalComDesconto = ((preco + precoCorrelacionado) * 0.9).toFixed(2);
    
      const openaiResp = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um vendedor de farmácia persuasivo, cordial e eficiente." },
          { role: "user", content: prompt + 
            `\nProduto principal: ${produto} (R$ ${preco.toFixed(2)})\nProduto correlacionado: ${correlacionado} (R$ ${precoCorrelacionado.toFixed(2)})\nValor total com desconto: R$ ${totalComDesconto}` 
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
    
      return openaiResp.choices[0]?.message?.content || 'Não consegui gerar o texto de venda.';
    }
  
} 