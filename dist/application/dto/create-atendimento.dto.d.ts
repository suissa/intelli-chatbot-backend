import { TipoAtendimento, StatusAtendimento } from '../../domain/entities';
export declare class CreateAtendimentoDto {
    nome: string;
    telefone_cliente: string;
    telefone_farmacia: string;
    data_hora: string;
    tipo?: TipoAtendimento;
    pergunta: string;
    farmacia_id?: string;
    atendente_id?: string;
}
export declare class UpdateAtendimentoDto {
    resposta?: string;
    status?: StatusAtendimento;
    atendente_id?: string;
}
export declare class FinalizarAtendimentoDto {
    resposta: string;
}
//# sourceMappingURL=create-atendimento.dto.d.ts.map