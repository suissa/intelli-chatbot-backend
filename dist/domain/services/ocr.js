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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRService = void 0;
const inversify_1 = require("inversify");
const tesseract = __importStar(require("node-tesseract-ocr"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let OCRService = class OCRService {
    async reconhecerTexto(caminhoImagem) {
        const imagemPreprocessada = await this.preprocessarImagem(caminhoImagem);
        const config = {
            lang: 'por',
            oem: 1,
            psm: 3,
        };
        const texto = await tesseract.recognize(imagemPreprocessada, config);
        fs_1.default.unlinkSync(imagemPreprocessada);
        return texto.trim();
    }
    async reconhecerTextoFromBuffer(imageBuffer) {
        const imagemPreprocessada = await this.preprocessarImagemFromBuffer(imageBuffer);
        const config = {
            lang: 'por',
            oem: 1,
            psm: 6,
        };
        const texto = await tesseract.recognize(imagemPreprocessada, config);
        fs_1.default.unlinkSync(imagemPreprocessada);
        return texto.trim();
    }
    async preprocessarImagem(caminhoImagem) {
        return caminhoImagem;
    }
    async preprocessarImagemFromBuffer(imageBuffer) {
        try {
            const tempPath = path_1.default.join(__dirname, `temp-ocr-${Date.now()}.png`);
            const sharp = await Promise.resolve().then(() => __importStar(require('sharp')));
            const imagemProcessada = await sharp.default(imageBuffer)
                .grayscale()
                .normalize()
                .threshold(160)
                .toFormat('png')
                .toBuffer();
            fs_1.default.writeFileSync(tempPath, imagemProcessada);
            return tempPath;
        }
        catch (error) {
            console.error('❌ Erro ao processar imagem do buffer:', error);
            throw error;
        }
    }
};
exports.OCRService = OCRService;
exports.OCRService = OCRService = __decorate([
    (0, inversify_1.injectable)()
], OCRService);
//# sourceMappingURL=ocr.js.map