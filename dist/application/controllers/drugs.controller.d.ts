import { FastifyRequest, FastifyReply } from 'fastify';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
export interface DrugsController {
    getAllDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getDrugById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    searchDrugs(request: FastifyRequest<{
        Querystring: {
            q: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActiveDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
export declare class DrugsControllerImpl implements DrugsController {
    private drugsRepository;
    constructor(drugsRepository: DrugsRepository);
    getAllDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getDrugById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    searchDrugs(request: FastifyRequest<{
        Querystring: {
            q: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActiveDrugs(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=drugs.controller.d.ts.map