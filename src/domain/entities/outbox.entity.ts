import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OutboxStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  RETRY = 'retry'
}

export enum OutboxType {
  IA = 'ia',
  STORAGE = 'storage',
  RESPONSE = 'response'
}

@Entity('outbox')
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: OutboxType,
    nullable: false
  })
  type!: OutboxType;

  @Column({
    type: 'enum',
    enum: OutboxStatus,
    default: OutboxStatus.PENDING
  })
  status!: OutboxStatus;

  @Column({ type: 'text', nullable: false })
  payload!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  topic!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  queue?: string;

  @Column({ type: 'int', default: 0 })
  retryCount!: number;

  @Column({ type: 'int', default: 3 })
  maxRetries!: number;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt?: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correlationId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  // Métodos de negócio
  markAsSent(): void {
    this.status = OutboxStatus.SENT;
    this.sentAt = new Date();
  }

  markAsFailed(error: string): void {
    this.status = OutboxStatus.FAILED;
    this.errorMessage = error;
  }

  shouldRetry(): boolean {
    return this.retryCount < this.maxRetries && this.status !== OutboxStatus.SENT;
  }

  incrementRetry(): void {
    this.retryCount++;
    this.status = OutboxStatus.RETRY;
    // Backoff exponencial: 1s, 2s, 4s, 8s...
    const delayMs = Math.pow(2, this.retryCount - 1) * 1000;
    this.nextRetryAt = new Date(Date.now() + delayMs);
  }

  canProcess(): boolean {
    if (this.status === OutboxStatus.SENT) return false;
    if (this.status === OutboxStatus.FAILED && !this.shouldRetry()) return false;
    if (this.status === OutboxStatus.RETRY && this.nextRetryAt && this.nextRetryAt > new Date()) return false;
    return true;
  }

  getPayloadAsObject(): any {
    try {
      return JSON.parse(this.payload);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao fazer parse do payload: ${errorMessage}`);
    }
  }

  setPayloadFromObject(obj: any): void {
    this.payload = JSON.stringify(obj);
  }

  // Validações de negócio
  validarDados(): boolean {
    return !!(this.type && this.payload && this.topic);
  }

  isProcessavel(): boolean {
    return this.canProcess();
  }

  getTempoAguardando(): number {
    return Date.now() - this.createdAt.getTime();
  }

  getTempoProcessamento(): number {
    if (this.sentAt) {
      return this.sentAt.getTime() - this.createdAt.getTime();
    }
    return Date.now() - this.createdAt.getTime();
  }
} 