import { FastifyRequest, FastifyReply } from 'fastify';
import { AttendantRepository } from '../../infrastructure/repositories/attendant.repository';
export interface AttendantController {
    getAllAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendantById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendantsByPharmacy(request: FastifyRequest<{
        Params: {
            pharmacyId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActiveAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendantsByVoice(request: FastifyRequest<{
        Params: {
            voice: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendantsByProfile(request: FastifyRequest<{
        Params: {
            profile: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createAttendant(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deleteAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    activateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deactivateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
}
export declare class AttendantControllerImpl implements AttendantController {
    private attendantRepository;
    constructor(attendantRepository: AttendantRepository);
    getAllAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendantById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendantsByPharmacy(request: FastifyRequest<{
        Params: {
            pharmacyId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getActiveAttendants(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendantsByVoice(request: FastifyRequest<{
        Params: {
            voice: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendantsByProfile(request: FastifyRequest<{
        Params: {
            profile: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createAttendant(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deleteAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    activateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deactivateAttendant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=attendant.controller.d.ts.map