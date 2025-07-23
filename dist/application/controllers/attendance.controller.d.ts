import { FastifyRequest, FastifyReply } from 'fastify';
import { AttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { DrugImageProcessorService } from '../../domain/services/drug-image-processor.service';
import { TextProcessorService } from '../../domain/services/text-processor.service';
export interface AttendanceController {
    getAllAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendanceById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByPharmacy(request: FastifyRequest<{
        Params: {
            pharmacyId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByAttendant(request: FastifyRequest<{
        Params: {
            attendantId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByStatus(request: FastifyRequest<{
        Params: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByType(request: FastifyRequest<{
        Params: {
            type: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getPendingAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getActiveAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getCompletedAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendancesByDateRange(request: FastifyRequest<{
        Querystring: {
            startDate: string;
            endDate: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createAttendance(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deleteAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    startAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    completeAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    cancelAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    processDrugImage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
export declare class AttendanceControllerImpl implements AttendanceController {
    private attendanceRepository;
    private drugImageProcessorService;
    private textProcessorService;
    constructor(attendanceRepository: AttendanceRepository, drugImageProcessorService: DrugImageProcessorService, textProcessorService: TextProcessorService);
    getAllAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendanceById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByPharmacy(request: FastifyRequest<{
        Params: {
            pharmacyId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByAttendant(request: FastifyRequest<{
        Params: {
            attendantId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByStatus(request: FastifyRequest<{
        Params: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getAttendancesByType(request: FastifyRequest<{
        Params: {
            type: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    getPendingAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getActiveAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getCompletedAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAttendancesByDateRange(request: FastifyRequest<{
        Querystring: {
            startDate: string;
            endDate: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    createAttendance(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deleteAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    startAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    completeAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    cancelAttendance(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    processDrugImage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=attendance.controller.d.ts.map