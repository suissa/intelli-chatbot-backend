import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { OpenAIService } from './openai.service';
export interface TextProcessorService {
    extractDrugFromText(text: string): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
}
export declare class TextProcessorServiceImpl implements TextProcessorService {
    private drugsRepository;
    private openaiService;
    constructor(drugsRepository: DrugsRepository, openaiService: OpenAIService);
    extractDrugFromText(text: string): Promise<{
        success: boolean;
        drugInfo?: any;
        presentation?: string;
        error?: string;
    }>;
    private extractPossibleDrugNames;
}
//# sourceMappingURL=text-processor.service.d.ts.map