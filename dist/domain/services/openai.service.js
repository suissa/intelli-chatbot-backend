"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const zod_1 = require("zod");
const drugs_repository_1 = require("../../infrastructure/repositories/drugs.repository");
const DrugsInformationExtraction = zod_1.z.object({
    comercialName: zod_1.z.string(),
    genericName: zod_1.z.array(zod_1.z.string()),
    manufacturer: zod_1.z.string(),
    indication: zod_1.z.string(),
    dosage: zod_1.z.string(),
    contraindication: zod_1.z.string(),
    interaction: zod_1.z.string(),
    modeOfUse: zod_1.z.string(),
    durationOfEffect: zod_1.z.string(),
    category: zod_1.z.string(),
    observations: zod_1.z.string(),
});
let OpenAIService = class OpenAIService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here',
        });
        this.drugsRepository = new drugs_repository_1.DrugsRepository();
    }
    async searchProductAndCorrelations(productName) {
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
            const caracteristicasMatch = responseContent.match(/\*\*CARACTERÍSTICAS DO PRODUTO:\*\*\s*([\s\S]*?)(?=\*\*PRODUTOS CORRELACIONADOS:\*\*)/i);
            const produtosMatch = responseContent.match(/\*\*PRODUTOS CORRELACIONADOS:\*\*\s*([\s\S]*?)(?=\*\*TEXTO DE VENDA:\*\*)/i);
            const textoMatch = responseContent.match(/\*\*TEXTO DE VENDA:\*\*\s*([\s\S]*?)$/i);
            const caracteristicasDoProduto = caracteristicasMatch ? caracteristicasMatch[1].trim() : 'Não encontrado';
            const produtosCorrelacionados = produtosMatch ? produtosMatch[1].trim() : 'Não encontrado';
            const textoDeVenda = textoMatch ? textoMatch[1].trim() : 'Não encontrado';
            console.log('🔍 Características:', caracteristicasDoProduto);
            console.log('🔍 Produtos correlacionados:', produtosCorrelacionados);
            console.log('🔍 Texto de venda:', textoDeVenda);
            return {
                caracteristicasDoProduto,
                produtosCorrelacionados,
                textoDeVenda
            };
        }
        catch (error) {
            console.error('❌ Erro ao pesquisar produto e correlações:', error);
            throw error;
        }
    }
    normalize(raw) {
        return raw
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "")
            .toLowerCase();
    }
    async extractDrugInformation(extractedText) {
        const prompt = `me de as informações desse remédio: '${this.normalize(extractedText)}', com as seguintes informações: NomeComercial, NomeGenérico, Fabricante, Indicação, Dosagem, Contraindicação, Interação, ModoDeUso, DuraçãoDoEfeito, Categoria, Observações.
            Monte a resposta como se estivesse vendendo-o e ao final pergunte se é realmente o remédio que o cliente deseja. Utilize vários emojis para tornar a resposta mais atrativa.
            Limite a resposta a 200-300 palavras.
            `;
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
                max_tokens: 1000,
            });
            const responseContent = response.choices[0]?.message?.content;
            if (!responseContent) {
                throw new Error('Resposta vazia da OpenAI');
            }
            console.log('✅ Informações extraídas com sucesso:', responseContent);
            return responseContent;
        }
        catch (error) {
            console.error('❌ Erro ao extrair informações com OpenAI:', error);
            throw error;
        }
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
    async transcribeAudio(audioFilePath) {
        try {
            console.log('🎵 Iniciando transcrição de áudio...');
            console.log(`📁 Arquivo: ${audioFilePath}`);
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            if (!fs.existsSync(audioFilePath)) {
                throw new Error(`Arquivo de áudio não encontrado: ${audioFilePath}`);
            }
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
        }
        catch (error) {
            console.error('❌ Erro ao transcrever áudio:', error);
            throw error;
        }
    }
    async transcribeAudioBase64(audioFilePath) {
        try {
            console.log('🎵 Iniciando transcrição de áudio...');
            console.log(`📁 Arquivo: ${audioFilePath}`);
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            if (!fs.existsSync(audioFilePath)) {
                throw new Error(`Arquivo de áudio não encontrado: ${audioFilePath}`);
            }
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
        }
        catch (error) {
            console.error('❌ Erro ao transcrever áudio:', error);
            throw error;
        }
    }
    async transcribeAudioFromBuffer(audioBuffer, filename = 'audio.mp3') {
        try {
            console.log('🎵 Iniciando transcrição de áudio a partir do buffer...');
            console.log(`📁 Nome do arquivo: ${filename}`);
            console.log(`📊 Tamanho do buffer: ${audioBuffer.length} bytes`);
            const fileExtension = filename.split('.').pop()?.toLowerCase();
            if (fileExtension !== 'mp3' && fileExtension !== 'wav' && fileExtension !== 'm4a') {
                throw new Error(`Formato de arquivo não suportado: ${fileExtension}. Formatos suportados: mp3, wav, m4a`);
            }
            console.log('🔄 Enviando buffer para transcrição...');
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            const path = await Promise.resolve().then(() => __importStar(require('path')));
            const tempDir = path.join(process.cwd(), 'temp');
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
            }
            finally {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            }
        }
        catch (error) {
            console.error('❌ Erro ao transcrever áudio do buffer:', error);
            throw error;
        }
    }
    async queryProduct(userMessage) {
        const systemPrompt = `
Você é um vendedor sênior de farmácia. Siga este fluxo: 
1. Sempre que o cliente falar (saudação ou pergunta), responda adequadamente.
2. Se perguntar por um remédio, extraia o nome do medicamento.
3. Chame a função \`check_inventory\` para ver estoque e preço.
4. Se não tiver estoque, responda “Desculpe, não temos {medicamento} em estoque.” e termine.
5. Se tiver estoque:
   a) O modelo mesmo deve gerar 10 produtos relacionados, com nome e um preço estimado.
   b) Envie ao cliente: “Temos {medicamento} por R$ {preco}. Também recomendamos: {rel1} por R$ {preco1}, {rel2} por R$ {preco2}, … Na compra dos 2 (ou 3), oferecemos 10% de desconto. Deseja seguir com esse combo ou apenas {medicamento}?”
6. Aguarde a resposta do cliente.
7. Se o cliente confirmar a compra (combo ou item único), gere a chave PIX.
8. Retorne ao cliente a chave PIX 123456.
`.trim();
        const promptMessages = [
            { role: 'system', content: systemPrompt, name: 'system' },
            { role: 'user', content: userMessage, name: 'user' }
        ];
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
                    products[0].produtosCorrelacionados = productsCorrelacionados;
                    const produto = products[0];
                    const correlacionado = produto?.produtosCorrelacionados[0];
                    const textoVenda = await this.generateVendaPersuasiva(produto?.nome || '', correlacionado?.name || '', produto?.preco || 0, correlacionado?.price || 0);
                    console.log("VENHAA textoVenda", textoVenda);
                    return {
                        content: textoVenda,
                        produto,
                        found: true
                    };
                }
                return products;
            }
            return response?.choices[0]?.message;
        }
        return response?.choices[0]?.message;
    }
    async generateVendaPersuasiva(produto, correlacionado, preco, precoCorrelacionado) {
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
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map