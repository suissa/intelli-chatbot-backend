import { FastifyRequest, FastifyReply } from 'fastify';
import { PharmacyRepository } from '../../infrastructure/repositories/pharmacy.repository';
import { DrugImageProcessorService } from '../../domain/services/drug-image-processor.service';
import { TextProcessorService } from '../../domain/services/text-processor.service';
import { OpenAIService } from '../../domain/services/openai.service';
export interface PharmacyController {
    getAllPharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getPharmacyById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getPharmacyByCNPJ(request: FastifyRequest<{
        Params: {
            cnpj: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActivePharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getPharmaciesByCity(request: FastifyRequest<{
        Params: {
            city: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getPharmaciesByState(request: FastifyRequest<{
        Params: {
            state: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    searchPharmacies(request: FastifyRequest<{
        Querystring: {
            q: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createPharmacy(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deletePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    activatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deactivatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    setWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    webhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
export declare class PharmacyControllerImpl implements PharmacyController {
    private pharmacyRepository;
    private openaiService;
    private drugImageProcessorService;
    private textProcessorService;
    constructor(pharmacyRepository: PharmacyRepository, openaiService: OpenAIService, drugImageProcessorService: DrugImageProcessorService, textProcessorService: TextProcessorService);
    setWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAllPharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getPharmacyById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    webhook(request: FastifyRequest<{
        Body: Record<string, any>;
    }>, reply: FastifyReply): Promise<void>;
    getPharmacyByCNPJ(request: FastifyRequest<{
        Params: {
            cnpj: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActivePharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getPharmaciesByCity(request: FastifyRequest<{
        Params: {
            city: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getPharmaciesByState(request: FastifyRequest<{
        Params: {
            state: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    searchPharmacies(request: FastifyRequest<{
        Querystring: {
            q: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createPharmacy(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deletePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    activatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deactivatePharmacy(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=pharmacy.controller.d.ts.map