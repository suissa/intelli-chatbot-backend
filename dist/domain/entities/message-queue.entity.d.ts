export interface MessageQueuePayload {
    message: string;
    type: string;
    timestamp: string;
    pharmacy_phone: string;
    consumer_phone: string;
}
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    AUDIO = "audio"
}
export declare enum TipoMensagem {
    IA = "ia",
    STORAGE = "storage"
}
export declare enum StatusMensagem {
    PENDENTE = "pendente",
    PROCESSANDO = "processando",
    CONCLUIDO = "concluido",
    ERRO = "erro"
}
export declare class MessageQueue {
    id: string;
    tipo: TipoMensagem;
    status: StatusMensagem;
    telefone_farmacia: string;
    telefone_cliente: string;
    nome_cliente: string;
    pergunta?: string;
    acao?: string;
    dados?: any;
    resposta?: string;
    remedios_encontrados?: any[];
    erro?: string;
    tentativas: number;
    max_tentativas: number;
    created_at: Date;
    updated_at: Date;
    processed_at?: Date;
    podeTentarNovamente(): boolean;
    incrementarTentativa(): void;
    marcarComoProcessando(): void;
    marcarComoConcluido(resposta?: string, remedios?: any[]): void;
    marcarComoErro(erro: string): void;
    toResponseMessage(): any;
    validarDados(): boolean;
    isProcessavel(): boolean;
    getTempoProcessamento(): number;
}
//# sourceMappingURL=message-queue.entity.d.ts.map