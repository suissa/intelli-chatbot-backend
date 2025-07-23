export declare enum OutboxStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    RETRY = "retry"
}
export declare enum OutboxType {
    IA = "ia",
    STORAGE = "storage",
    RESPONSE = "response"
}
export declare class Outbox {
    id: string;
    type: OutboxType;
    status: OutboxStatus;
    payload: string;
    topic: string;
    queue?: string;
    retryCount: number;
    maxRetries: number;
    nextRetryAt?: Date;
    errorMessage?: string;
    correlationId?: string;
    createdAt: Date;
    updatedAt: Date;
    sentAt?: Date;
    markAsSent(): void;
    markAsFailed(error: string): void;
    shouldRetry(): boolean;
    incrementRetry(): void;
    canProcess(): boolean;
    getPayloadAsObject(): any;
    setPayloadFromObject(obj: any): void;
    validarDados(): boolean;
    isProcessavel(): boolean;
    getTempoAguardando(): number;
    getTempoProcessamento(): number;
}
//# sourceMappingURL=outbox.entity.d.ts.map