import OpenAI from 'openai';
export declare class OpenAIService {
    private openai;
    private drugsRepository;
    constructor();
    searchProductAndCorrelations(productName: string): Promise<any>;
    normalize(raw: string): string;
    extractDrugInformation(extractedText: string): Promise<any>;
    generateDrugPresentation(drugInfo: any): Promise<string>;
    transcribeAudio(audioFilePath: string): Promise<string>;
    transcribeAudioBase64(audioFilePath: string): Promise<string>;
    transcribeAudioFromBuffer(audioBuffer: Buffer, filename?: string): Promise<string>;
    queryProduct(userMessage: string): Promise<import("../entities").Remedio[] | OpenAI.Chat.Completions.ChatCompletionMessage | {
        content: string;
        produto: import("../entities").Remedio | undefined;
        found: boolean;
    } | undefined>;
    generateVendaPersuasiva(produto: string, correlacionado: string, preco: number, precoCorrelacionado: number): Promise<string>;
}
//# sourceMappingURL=openai.service.d.ts.map