import { Atendimento, TipoAtendimento, StatusAtendimento } from '../../domain/entities';
export interface IAttendanceRepository {
    getAllAttendances(): Promise<Atendimento[]>;
    getAttendanceById(id: string): Promise<Atendimento | null>;
    getAttendancesByPharmacy(pharmacyId: string): Promise<Atendimento[]>;
    getAttendancesByAttendant(attendantId: string): Promise<Atendimento[]>;
    getAttendancesByStatus(status: StatusAtendimento): Promise<Atendimento[]>;
    getAttendancesByType(type: TipoAtendimento): Promise<Atendimento[]>;
    getPendingAttendances(): Promise<Atendimento[]>;
    getActiveAttendances(): Promise<Atendimento[]>;
    getCompletedAttendances(): Promise<Atendimento[]>;
    getAttendancesByDateRange(startDate: Date, endDate: Date): Promise<Atendimento[]>;
    createAttendance(attendance: Partial<Atendimento>): Promise<Atendimento>;
    updateAttendance(id: string, updates: Partial<Atendimento>): Promise<Atendimento | null>;
    deleteAttendance(id: string): Promise<boolean>;
    startAttendance(id: string): Promise<boolean>;
    completeAttendance(id: string, response?: string): Promise<boolean>;
    cancelAttendance(id: string): Promise<boolean>;
}
export declare class AttendanceRepository implements IAttendanceRepository {
    private repository;
    constructor();
    getAllAttendances(): Promise<Atendimento[]>;
    getAttendanceById(id: string): Promise<Atendimento | null>;
    getAttendancesByPharmacy(pharmacyId: string): Promise<Atendimento[]>;
    getAttendancesByAttendant(attendantId: string): Promise<Atendimento[]>;
    getAttendancesByStatus(status: StatusAtendimento): Promise<Atendimento[]>;
    getAttendancesByType(type: TipoAtendimento): Promise<Atendimento[]>;
    getPendingAttendances(): Promise<Atendimento[]>;
    getActiveAttendances(): Promise<Atendimento[]>;
    getCompletedAttendances(): Promise<Atendimento[]>;
    getAttendancesByDateRange(startDate: Date, endDate: Date): Promise<Atendimento[]>;
    createAttendance(attendance: Partial<Atendimento>): Promise<Atendimento>;
    updateAttendance(id: string, updates: Partial<Atendimento>): Promise<Atendimento | null>;
    deleteAttendance(id: string): Promise<boolean>;
    startAttendance(id: string): Promise<boolean>;
    completeAttendance(id: string, response?: string): Promise<boolean>;
    cancelAttendance(id: string): Promise<boolean>;
}
//# sourceMappingURL=attendance.repository.d.ts.map