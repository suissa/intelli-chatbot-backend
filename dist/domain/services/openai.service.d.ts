export declare class OpenAIService {
    private openai;
    constructor();
    searchProductAndCorrelations(productName: string): Promise<any>;
    normalize(raw: string): string;
    extractDrugInformation(extractedText: string): Promise<any>;
    generateDrugPresentation(drugInfo: any): Promise<string>;
    transcribeAudio(audioFilePath: string): Promise<string>;
    transcribeAudioFromBuffer(audioBuffer: Buffer, filename?: string): Promise<string>;
}
//# sourceMappingURL=openai.service.d.ts.map