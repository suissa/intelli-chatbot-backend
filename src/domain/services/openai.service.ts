import { inject, injectable } from 'inversify';
import OpenAI from 'openai';
import { z } from 'zod';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { TYPES } from '../../shared/types';
import { Remedio } from '../entities/remedio.entity';

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
  constructor(
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository
  ) {
    console.log('🔑 OPENAI_API_KEY utilizada:', process.env.OPENAI_API_KEY); 
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here',
    });
    // this.drugsRepository = drugsRepository;
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

  

  async searchProductAndCorrelations(productName: string): Promise<any> {
    console.log("searchProductAndCorrelations productName", productName);
    const prompt = `

      Você é um excelente vendedor de farmácia.

      Produto pesquisado: ${productName}

      🛑 IMPORTANTE:
      - Os itens devem ser **complementares reais** do produto pesquisado, **não da mesma categoria**.
      - Liste exatamente **20 produtos complementares**, no formato:
        Nome - R$ preço - Categoria
      - Não use números no nome do produto.
      - Não use bullet ou numeração no nome.
      ---

      **PRODUTOS CORRELACIONADOS:**
      [Nome] - [Preço] - [Categoria]
      `.trim();
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um vendedor de farmácia que sugere produtos complementares úteis e não semelhantes ao produto principal."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
      });
  

      
      const content = response.choices[0]?.message?.content || '';
      console.log("searchProductAndCorrelations content", content);
  
      const encontrados = await this.searchMultipleDrugsFromString(content);
      console.log("searchMultipleDrugsFromString encontrados", encontrados);
      if (!encontrados || encontrados.length === 0) {
        return { textoDeVenda: `❌ Nenhum produto complementar disponível em estoque.` };
      }
      const principal = (await this.drugsRepository.searchDrugs(productName))[0];
      const complementar = encontrados[0];
  
      const precoPrincipal = principal?.preco || 0;
      const precoComplementar = complementar?.preco || 0;
      const precoTotal = (precoPrincipal + precoComplementar) * 0.9;
      
      // Chamar novo prompt para gerar texto de venda
      const textoDeVenda = await this.gerarTextoVendaPersuasiva(
        principal ? principal.nome : productName,
        precoPrincipal,
        complementar ? complementar.nome : '',
        complementar ? precoComplementar : 0,
        precoTotal
      );
  
      return {
        produtoPrincipal: principal,
        produtoComplementar: complementar,
        textoDeVenda
      };
    } catch (error) {
      console.error('❌ Erro ao buscar produtos correlacionados:', error);
      throw error;
    }

  }

  gerarRespostaConfirmacao({
    medicamento,
    precoMedicamento,
    correlato,
    precoCorrelato,
  }: {
    medicamento: string;
    precoMedicamento: number;
    correlato: string;
    precoCorrelato: number;
  }): string {
    const respostas = {
      tecnico: `
  Perfeito! Anotado: vamos seguir apenas com a ${medicamento} — R$ ${precoMedicamento.toFixed(2)}.
  
  Apenas informando: o item complementar sugerido, ${correlato}, também está disponível em estoque por R$ ${precoCorrelato.toFixed(2)}, caso deseje incluí-lo mais tarde.
  
  Confirma a compra somente de ${medicamento}? 💳
      `.trim(),
  
      caloroso: `
  Tudo bem! 😊 Vamos de ${medicamento} então, que está saindo por R$ ${precoMedicamento.toFixed(2)}.
  
  Só para lembrar: o ${correlato} também está disponível (R$ ${precoCorrelato.toFixed(2)}) e foi pensado especialmente para complementar seu cuidado. Mas claro, você escolhe o que for melhor pra você. 💕
  
  Posso seguir com ${medicamento} para você?
      `.trim(),
  
      direto: `
  Entendido. Só ${medicamento}, por R$ ${precoMedicamento.toFixed(2)}, certo?
  
  O ${correlato} também está disponível (R$ ${precoCorrelato.toFixed(2)}), mas não será incluído.
  
  Confirmo o pedido de ${medicamento}?
      `.trim(),
    };
  
    const estilos = Object.keys(respostas);
    const escolhido = estilos[Math.floor(Math.random() * estilos.length)] as keyof typeof respostas;
    return respostas[escolhido];
  }

  
  generateSingleItemResponseFromHistory(
    userMessage: string,
    history: ChatCompletionMessageParam[]
  ): { trigger: boolean; medicamento?: string } {
    const negativeTrigger = /(não|só|apenas|prefiro só|quero só|vou querer só|não quero|nem quero|nem preciso)/i.test(userMessage);

    
    const lastAssistantMessage = [...history].reverse().find(m => m.role === 'assistant');

    const isLastMsgOfertaCombo = lastAssistantMessage?.content
      ?.toString()
      .toLowerCase()
      .startsWith('pensando especialmente');

      if (negativeTrigger && isLastMsgOfertaCombo) {
        // busca a mensagem do user anterior à última do assistant
        const lastAssistantIndex = history.lastIndexOf(lastAssistantMessage!);
        const previousUserMessage = [...history.slice(0, lastAssistantIndex)].reverse().find(m => m.role === 'user');
    
        if (previousUserMessage?.content) {
          return {
            trigger: true,
            medicamento: previousUserMessage.content.toString().trim()
          };
        }
      }

    return { trigger: false };
  }

  gerarRespostaSomentePrincipal(medicamento: string, preco: number): string {
    const respostas = {
      tecnico: `Anotado: seguiremos com ${medicamento} — R$ ${preco.toFixed(2)}. Compra registrada com sucesso.`,
      caloroso: `Claro! Vamos só de ${medicamento} então, por R$ ${preco.toFixed(2)}. Qualquer coisa estou aqui! 😊`,
      direto: `OK! ${medicamento} por R$ ${preco.toFixed(2)}. Pedido confirmado.`
    };
  
    const estilos = Object.keys(respostas);
    const escolhido = estilos[Math.floor(Math.random() * estilos.length)] as keyof typeof respostas;
    return respostas[escolhido];
  }

  async firstDrugFound(produtos: string[]): Promise<Remedio[] | null> {
    for (const remedio of produtos) {
      const resultado = await this.drugsRepository.searchDrugs(remedio);
      console.log(`🔍 Encontrados ${resultado.length} remédios para o termo "${remedio}"`);
      if (resultado.length > 0) {
        return resultado; // retorna o primeiro que tem algo
      }
    }
    return null;
  }

  async searchMultipleDrugsFromString(input: string): Promise<any | null> {
    const results: any[] = [];
    console.log("searchMultipleDrugsFromString input", input);
    // const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    const cleanWords = [
      "com", "sem", "para", "de", "do", "da", "dos", "das",
      "extra", "super", "premium", "intenso", "leve", "forte",
      "ação", "uso", "adulto", "infantil", "natural", "vegano",
      "gel", "sabor", "aroma", "tipo", "versão", "creme", "gel", "gelatina", 
      "cream", "essencia"
      ];
    function limparNomeProduto(nome: string): string {
      const palavras = nome
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^\w\s]/g, "") // remove pontuação
        .split(" ")
        .filter(palavra => !cleanWords.includes(palavra) && palavra.length > 1)
    
      return palavras.join(" ");
    }

    const linhasBrutas = input
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const produtosLimpos = linhasBrutas.map(linha => {
      const [raw] = linha.split('-');
      return limparNomeProduto(raw || '');
    });

    const produtosCorrelacionadosArray = await this.firstDrugFound(produtosLimpos);

    console.log("produtosCorrelacionadosArray", produtosCorrelacionadosArray);
    console.log("produtosLimpos", produtosLimpos);
    // console.log("linhasBrutas", linhasBrutas);
    return produtosCorrelacionadosArray;
  }

  async queryProduct(userMessage: string, history: ChatCompletionMessageParam[] = []) {
    const flatHistory = history
      .map((msg) => `${msg.role === 'user' ? 'Cliente' : 'Atendente'}: ${msg.content}`)
      .join('\n');

    console.log("flatHistory", flatHistory);
    const singleItemCheck = this.generateSingleItemResponseFromHistory(userMessage, history);

    if (singleItemCheck.trigger) {
      const remedio = singleItemCheck.medicamento!;
      const produts = await this.drugsRepository.searchDrugs(remedio);
    
      if (produts.length > 0) {
        const produto = produts[0];
        console.log("produto", produto);
        if (produto?.nome) {
          const resposta = this.gerarRespostaSomentePrincipal(produto?.nome || '', produto?.preco || 0);
          return {
            role: 'assistant',
            name: 'assistant',
            content: resposta,
          } satisfies ChatCompletionMessageParam;
        }
      }
    }
      
    const systemPrompt: ChatCompletionMessageParam = {
      role: 'system',
      name: 'system',
      content: `
Você é um vendedor sênior de farmácia atendendo clientes por WhatsApp. Seu objetivo é entender o que o cliente precisa, sugerir medicamentos apropriados e concluir a venda de forma simpática e eficiente.

Siga este fluxo de atendimento com atenção:

---

1. 🗨️ **Saudações iniciais**  
   - Se a mensagem for uma saudação ou genérica (ex: "oi", "olá", "tudo bem"), cumprimente de volta e se coloque à disposição.

2. 💊 **Quando o cliente menciona apenas um sintoma**  
   Se o cliente disser algo como "estou com dor de cabeça", "tenho febre", etc., utilize o seguinte mapeamento para oferecer sugestões:

   - **dor de cabeça** → paracetamol, dipirona, ibuprofeno  
   - **dor de garganta** → benzetacil, nimesulida, cetaril  
   - **febre** → dipirona, paracetamol, ibuprofeno  
   - **alergia / rinite** → loratadina, desloratadina, polaramine  
   - **gripe / resfriado** → benegrip, multigrip, neosoro  
   - **dor no ouvido** → otosporin, ciprofloxacino, neomicina  

   📌 Pergunte ao cliente:  
   “Deseja que eu verifique o estoque de algum desses medicamentos?”

3. 🔍 **Se já houve sugestão anterior**  
   - Verifique se já existe no histórico um nome de medicamento sugerido anteriormente.
   - ✅ Se sim, reutilize esse nome para continuar a conversa.
   - ⚠️ Se não, pergunte gentilmente:  
     “Você já usou algum medicamento para isso ou lembra o nome de algum?”

4. 🧠 **Se o cliente mencionar diretamente o nome de um medicamento (mesmo com erro)**  
   - Corrija o nome se necessário  
   - Chame a função \`check_inventory\` com o nome correto

5. 🚫 **Se o medicamento não estiver em estoque**, responda:  
   “❌ Desculpe, não temos {medicamento} em estoque.”

6. ✅ **Se o medicamento estiver disponível**:
   - Busque até 3 produtos relacionados ao medicamento principal (usados juntos ou substitutos), com nomes e preços estimados
   - Gere uma resposta no estilo:  
     “Temos {medicamento} por R$ {preco}. Também recomendamos:  
     {rel1} por R$ {preco1}, {rel2} por R$ {preco2}.  
     Na compra em conjunto, você ganha 10% de desconto.  
     Deseja seguir com o combo ou apenas {medicamento}?”

7. 💰 **Se o cliente confirmar a compra (ex: "quero esse", "sim", "ok")**  
   - Gere a resposta final com a chave PIX:  
     “Perfeito! Para concluir sua compra, use a chave PIX: 123456.”

---

⚠️ **REGRAS ESSENCIAIS**:

- ❌ Nunca chame \`check_inventory\` com nomes genéricos como:  
  “remédio”, “analgésico”, “remedinho”, “dor”, “medicamento”

- ❌ Nunca chame \`check_inventory\` se o nome do medicamento não for claro ou não puder ser inferido com confiança

- 🧠 Sempre analise o histórico da conversa e reutilize medicamentos mencionados anteriormente

- ✅ Se o cliente disser "não", "não lembro", "não sei", etc.:  
  - Entenda como resposta à sua pergunta  
  - Não reinicie o atendimento  
  - Em vez disso, ofereça sugestões como:  
    “Sem problemas, posso te sugerir alguns medicamentos comuns para isso, tudo bem?”

- ❌ Nunca diga frases genéricas como “Como posso ajudar você hoje?” se o atendimento já começou

- 🕊️ Só use saudações no **primeiro contato**

---

Responda à próxima mensagem do cliente com base no histórico da conversa.
`.trim()
    };
  
    // Monta o histórico completo
    const promptMessages: ChatCompletionMessageParam[] = [
      systemPrompt,
      ...history,
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
      const nomeLower = nomeRemedio.toLowerCase();
    
      const termosBanidos = ['analgésico', 'remédio', 'dor', 'medicamento', 'remedinho'];
      if (!nomeRemedio || termosBanidos.some(t => nomeLower.includes(t))) {
        return {
          role: 'assistant',
          name: 'assistant',
          content: `🤔 Poderia me informar o nome de algum medicamento que você já usou ou conhece? Assim posso verificar o estoque pra você.`,
        } satisfies ChatCompletionMessageParam;
      }
    
      const products = await this.drugsRepository.searchDrugs(nomeRemedio);
      console.log("searchDrugs products", products[0]);
    
      if (products.length === 0) {
        return {
          role: 'assistant',
          name: 'assistant',
          content: `❌ Desculpe, não temos ${nomeRemedio} em estoque.`
        } satisfies ChatCompletionMessageParam;
      }
    
      const lastAssistantMessage = history.reverse().find(msg => msg.role === 'assistant')?.content || '';
    
      const jaListouProdutos = lastAssistantMessage.toString().includes("Possuímos os seguintes produtos em estoque");
    
      // 🟢 SE já mostramos a lista antes, agora podemos sugerir a venda do combo
      if (jaListouProdutos) {
        const produto = products[0];
        const productsCorrelacionados = await this.searchProductAndCorrelations(produto?.nome || '');
    
        const textoVenda = productsCorrelacionados.textoDeVenda;
        console.log("VENDA textoVenda FINAL:", textoVenda);
    
        return {
          role: 'assistant',
          name: 'assistant',
          content: textoVenda,
          produto,
          found: true
        };
      }
    
      // 🟡 CASO CONTRÁRIO: exibir lista e pedir confirmação para prosseguir depois
      const listaProdutos = products
        .map((p) => `• ${p.nome} – R$ ${p.preco.toFixed(2).replace('.', ',')}`)
        .join('\n');
    
      const retornoListaProdutos = `
    📦 Possuímos os seguintes produtos em estoque:
    ${listaProdutos}
    
    Se você ainda não encontrou o que procura, posso te sugerir alguns medicamentos que costumam ajudar bastante nesse caso, tudo bem? 😊
    
    Agora, se você já encontrou, poderia me enviar o nome completo do produto copiando e colando aqui? Assim consigo verificar direitinho pra você.
    `.trim();
    
      return {
        role: 'assistant',
        name: 'assistant',
        content: retornoListaProdutos,
      } satisfies ChatCompletionMessageParam;
    }
    
    return response?.choices[0]?.message;
  }

  mapSintomaParaSugestoes(sintoma: string): { sintomaDetectado: string; sugestoes: string[] } | null {
    const base = [
      {
        keywords: ['dor de cabeça', 'enxaqueca', 'cefaleia'],
        sugestoes: ['paracetamol', 'dipirona', 'ibuprofeno'],
        sintoma: 'dor de cabeça'
      },
      {
        keywords: ['dor de garganta', 'garganta inflamada'],
        sugestoes: ['benzetacil', 'nimesulida', 'cetaril'],
        sintoma: 'dor de garganta'
      },
      {
        keywords: ['febre'],
        sugestoes: ['dipirona', 'paracetamol', 'ibuprofeno'],
        sintoma: 'febre'
      },
      {
        keywords: ['alergia', 'coceira', 'rinite'],
        sugestoes: ['loratadina', 'desloratadina', 'polaramine'],
        sintoma: 'alergia'
      },
      {
        keywords: ['resfriado', 'gripe', 'congestão nasal'],
        sugestoes: ['benegrip', 'neosoro', 'multigrip'],
        sintoma: 'gripe e resfriado'
      },
      {
        keywords: ['dor no ouvido', 'ouvido inflamado'],
        sugestoes: ['otosporin', 'ciprofloxacino', 'neomicina'],
        sintoma: 'dor no ouvido'
      }
    ];
  
    const texto = sintoma.toLowerCase();
  
    for (const item of base) {
      if (item.keywords.some(k => texto.includes(k))) {
        return { sintomaDetectado: item.sintoma, sugestoes: item.sugestoes };
      }
    }
  
    return null;
  }
  

  async gerarTextoVendaPersuasiva(
    nomePrincipal: string,
    precoPrincipal: number,
    nomeComplementar: string,
    precoComplementar: number,
    precoTotal: number
  ): Promise<string> {
    const prompt = `
  Produto principal: ${nomePrincipal} (R$ ${precoPrincipal.toFixed(2).replace('.', ',')})  
  Complementar: ${nomeComplementar} (R$ ${precoComplementar.toFixed(2).replace('.', ',')})  
  Preço com desconto: R$ ${precoTotal.toFixed(2).replace('.', ',')}

  ---

  **TEXTO DE VENDA:**

  Pensando especialmente em você criei essa oferta única:  
  que tal levar o ${nomePrincipal} (R$ ${precoPrincipal.toFixed(2).replace('.', ',')}) junto com o ${nomeComplementar} (R$ ${precoComplementar.toFixed(2).replace('.', ',')})?

  Eles se complementam perfeitamente e ajudam a acelerar seu bem-estar!  
  💡 Essa combinação foi escolhida a dedo com carinho só pra você.  
  [Explique qual o benefício da combinação entre eles]  
  💰 E o melhor: levando os dois agora, você ganha **10% de desconto no total**.

  Você gostaria de aproveitar essa promoção exclusiva e levar o ${nomePrincipal} + ${nomeComplementar}, totalizando R$ ${precoTotal.toFixed(2).replace('.', ',')}?  
  *Essa condição é exclusiva para essa conversa.*
    `.trim();

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um vendedor de farmácia especialista em escrever textos de venda persuasivos e carismáticos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content?.trim() || '⚠️ Não foi possível gerar o texto de venda.';
  }
  
} 