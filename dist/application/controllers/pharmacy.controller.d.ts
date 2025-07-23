import { FastifyRequest, FastifyReply } from 'fastify';
import { PharmacyRepository } from '../../infrastructure/repositories/pharmacy.repository';
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
}
export declare class PharmacyControllerImpl implements PharmacyController {
    private pharmacyRepository;
    constructor(pharmacyRepository: PharmacyRepository);
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
}
//# sourceMappingURL=pharmacy.controller.d.ts.map