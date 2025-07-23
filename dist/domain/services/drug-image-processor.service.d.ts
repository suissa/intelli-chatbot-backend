import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { OCRService } from './ocr';
import { OpenAIService } from './openai.service';
export interface DrugImageProcessorService {
    processDrugImage(imagePath: string): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
    processDrugImageBuffer(imageBuffer: Buffer): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
}
export declare class DrugImageProcessorServiceImpl implements DrugImageProcessorService {
    private drugsRepository;
    private ocrService;
    private openaiService;
    constructor(drugsRepository: DrugsRepository, ocrService: OCRService, openaiService: OpenAIService);
    processDrugImage(imagePath: string): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
    processDrugImageBuffer(imageBuffer: Buffer): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
}
//# sourceMappingURL=drug-image-processor.service.d.ts.map