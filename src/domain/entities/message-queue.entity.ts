import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoMensagem {
  IA = 'ia',
  STORAGE = 'storage'
}

export enum StatusMensagem {
  PENDENTE = 'pendente',
  PROCESSANDO = 'processando',
  CONCLUIDO = 'concluido',
  ERRO = 'erro'
}

@Entity('message_queue')
export class MessageQueue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TipoMensagem,
    default: TipoMensagem.IA
  })
  tipo!: TipoMensagem;

  @Column({
    type: 'enum',
    enum: StatusMensagem,
    default: StatusMensagem.PENDENTE
  })
  status!: StatusMensagem;

  @Column({ type: 'varchar', length: 20, nullable: false })
  telefone_farmacia!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  telefone_cliente!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome_cliente!: string;

  @Column({ type: 'text', nullable: true })
  pergunta?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  acao?: string;

  @Column({ type: 'jsonb', nullable: true })
  dados?: any;

  @Column({ type: 'text', nullable: true })
  resposta?: string;

  @Column({ type: 'jsonb', nullable: true })
  remedios_encontrados?: any[];

  @Column({ type: 'text', nullable: true })
  erro?: string;

  @Column({ type: 'int', default: 0 })
  tentativas!: number;

  @Column({ type: 'int', default: 3 })
  max_tentativas!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at?: Date;

  // Métodos de negócio
  podeTentarNovamente(): boolean {
    return this.tentativas < this.max_tentativas;
  }

  incrementarTentativa(): void {
    this.tentativas++;
    this.updated_at = new Date();
  }

  marcarComoProcessando(): void {
    this.status = StatusMensagem.PROCESSANDO;
    this.updated_at = new Date();
  }

  marcarComoConcluido(resposta?: string, remedios?: any[]): void {
    this.status = StatusMensagem.CONCLUIDO;
    this.resposta = resposta;
    this.remedios_encontrados = remedios;
    this.processed_at = new Date();
    this.updated_at = new Date();
  }

  marcarComoErro(erro: string): void {
    this.status = StatusMensagem.ERRO;
    this.erro = erro;
    this.updated_at = new Date();
  }

  toResponseMessage(): any {
    return {
      id: this.id,
      timestamp: this.updated_at.toISOString(),
      telefone_farmacia: this.telefone_farmacia,
      telefone_cliente: this.telefone_cliente,
      sucesso: this.status === StatusMensagem.CONCLUIDO,
      resposta: this.resposta,
      remedios_encontrados: this.remedios_encontrados,
      erro: this.erro,
    };
  }

  // Validações de negócio
  validarDados(): boolean {
    return !!(this.telefone_farmacia && this.telefone_cliente && this.nome_cliente);
  }

  isProcessavel(): boolean {
    return this.status === StatusMensagem.PENDENTE || 
           (this.status === StatusMensagem.ERRO && this.podeTentarNovamente());
  }

  getTempoProcessamento(): number {
    if (this.processed_at) {
      return this.processed_at.getTime() - this.created_at.getTime();
    }
    return Date.now() - this.created_at.getTime();
  }
} 