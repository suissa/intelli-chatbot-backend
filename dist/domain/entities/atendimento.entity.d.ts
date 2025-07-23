export declare enum TipoAtendimento {
    IA = "ia",
    HUMANO = "humano"
}
export declare enum StatusAtendimento {
    PENDENTE = "pendente",
    EM_ANDAMENTO = "em_andamento",
    FINALIZADO = "finalizado",
    CANCELADO = "cancelado"
}
export declare class Atendimento {
    id: string;
    nome: string;
    telefone_cliente: string;
    telefone_farmacia: string;
    data_hora: Date;
    tipo: TipoAtendimento;
    pergunta: string;
    resposta?: string;
    remedios_encontrados?: any[];
    status: StatusAtendimento;
    farmacia_id?: string;
    atendente_id?: string;
    created_at: Date;
    updated_at: Date;
    farmacia?: any;
    atendente?: any;
    isPendente(): boolean;
    isEmAndamento(): boolean;
    isFinalizado(): boolean;
    isCancelado(): boolean;
    iniciarAtendimento(): void;
    finalizarAtendimento(resposta?: string): void;
    cancelarAtendimento(): void;
    adicionarRemedioEncontrado(remedio: any): void;
    validarDados(): boolean;
    podeSerFinalizado(): boolean;
    getDuracaoAtendimento(): number;
}
//# sourceMappingURL=atendimento.entity.d.ts.map