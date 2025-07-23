import { injectable } from 'inversify';
import * as tesseract from 'node-tesseract-ocr'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp';

@injectable()
export class OCRService {
  async reconhecerTexto(caminhoImagem: string): Promise<string> {
    const imagemPreprocessada = await this.preprocessarImagem(caminhoImagem)

    const config: tesseract.Config = {
      lang: 'por', // ou 'eng+por' para misto
      oem: 1,
      psm: 3,
    }

    const texto = await tesseract.recognize(imagemPreprocessada, config)
    fs.unlinkSync(imagemPreprocessada) // remove imagem temporária

    return texto.trim()
  }

  async reconhecerTextoFromBuffer(imageBuffer: Buffer): Promise<string> {
    const imagemPreprocessada = await this.preprocessarImagemFromBuffer(imageBuffer)

    const config: tesseract.Config = {
      lang: 'por', // ou 'eng+por' para misto
      oem: 1,
      psm: 6,
    }

    const texto = await tesseract.recognize(imagemPreprocessada, config)
    fs.unlinkSync(imagemPreprocessada) // remove imagem temporária

    return texto.trim()
  }

  private async preprocessarImagem(caminhoImagem: string): Promise<string> {
    // Por enquanto, retornar o caminho original sem processamento
    return caminhoImagem;
  }

  private async preprocessarImagemFromBuffer(imageBuffer: Buffer): Promise<string> {
    try {
      const tempPath = path.join(__dirname, `temp-ocr-${Date.now()}.png`);
  
      const imagemProcessada = await sharp(imageBuffer)
        .grayscale()                 // remove cor
        .normalize()                 // aumenta contraste
        .threshold(160)              // binarização
        .toFormat('png')
        .toBuffer();
  
      fs.writeFileSync(tempPath, imagemProcessada);
  
      return tempPath;
    } catch (error) {
      console.error('❌ Erro ao processar imagem do buffer:', error);
      throw error;
    }
  }
}
