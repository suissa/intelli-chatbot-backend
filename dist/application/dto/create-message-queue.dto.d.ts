import { TipoMensagem, StatusMensagem } from '../../domain/entities';
export declare class CreateMessageQueueDto {
    tipo?: TipoMensagem;
    telefone_farmacia: string;
    telefone_cliente: string;
    nome_cliente: string;
    pergunta?: string;
    acao?: string;
    dados?: any;
    max_tentativas?: number;
}
export declare class UpdateMessageQueueDto {
    resposta?: string;
    remedios_encontrados?: any[];
    erro?: string;
    status?: StatusMensagem;
}
export declare class ProcessMessageDto {
    resposta: string;
    remedios_encontrados?: any[];
}
//# sourceMappingURL=create-message-queue.dto.d.ts.map