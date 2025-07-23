export declare class OCRService {
    reconhecerTexto(caminhoImagem: string): Promise<string>;
    reconhecerTextoFromBuffer(imageBuffer: Buffer): Promise<string>;
    private preprocessarImagem;
    private preprocessarImagemFromBuffer;
}
//# sourceMappingURL=ocr.d.ts.map