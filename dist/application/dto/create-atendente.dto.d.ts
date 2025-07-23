import { VozAtendente, PerfilAtendente } from '../../domain/entities';
export declare class CreateAtendenteDto {
    farmacia_id: string;
    voz?: VozAtendente;
    perfil?: PerfilAtendente;
    ativo?: boolean;
}
export declare class UpdateAtendenteDto {
    voz?: VozAtendente;
    perfil?: PerfilAtendente;
    ativo?: boolean;
}
//# sourceMappingURL=create-atendente.dto.d.ts.map