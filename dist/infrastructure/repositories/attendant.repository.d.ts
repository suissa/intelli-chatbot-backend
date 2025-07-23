import { Atendente, VozAtendente, PerfilAtendente } from '../../domain/entities';
export interface AttendantRepository {
    getAllAttendants(): Promise<Atendente[]>;
    getAttendantById(id: string): Promise<Atendente | null>;
    getAttendantsByPharmacy(pharmacyId: string): Promise<Atendente[]>;
    getActiveAttendants(): Promise<Atendente[]>;
    getAttendantsByVoice(voice: VozAtendente): Promise<Atendente[]>;
    getAttendantsByProfile(profile: PerfilAtendente): Promise<Atendente[]>;
    createAttendant(attendant: Partial<Atendente>): Promise<Atendente>;
    updateAttendant(id: string, updates: Partial<Atendente>): Promise<Atendente | null>;
    deleteAttendant(id: string): Promise<boolean>;
    activateAttendant(id: string): Promise<boolean>;
    deactivateAttendant(id: string): Promise<boolean>;
}
export declare class AttendantRepository implements AttendantRepository {
    private repository;
    constructor();
    getAllAttendants(): Promise<Atendente[]>;
    getAttendantById(id: string): Promise<Atendente | null>;
    getAttendantsByPharmacy(pharmacyId: string): Promise<Atendente[]>;
    getActiveAttendants(): Promise<Atendente[]>;
    getAttendantsByVoice(voice: VozAtendente): Promise<Atendente[]>;
    getAttendantsByProfile(profile: PerfilAtendente): Promise<Atendente[]>;
    createAttendant(attendant: Partial<Atendente>): Promise<Atendente>;
    updateAttendant(id: string, updates: Partial<Atendente>): Promise<Atendente | null>;
    deleteAttendant(id: string): Promise<boolean>;
    activateAttendant(id: string): Promise<boolean>;
    deactivateAttendant(id: string): Promise<boolean>;
}
//# sourceMappingURL=attendant.repository.d.ts.map