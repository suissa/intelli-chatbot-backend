import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum TipoAtendimento {
  IA = 'ia',
  HUMANO = 'humano'
}

export enum StatusAtendimento {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado'
}

@Entity('atendimentos')
export class Atendimento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  telefone_cliente!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  telefone_farmacia!: string;

  @Column({ type: 'timestamp', nullable: false })
  data_hora!: Date;

  @Column({
    type: 'enum',
    enum: TipoAtendimento,
    default: TipoAtendimento.IA
  })
  tipo!: TipoAtendimento;

  @Column({ type: 'text', nullable: false })
  pergunta!: string;

  @Column({ type: 'text', nullable: true })
  resposta?: string;

  @Column({ type: 'jsonb', nullable: true })
  remedios_encontrados?: any[];

  @Column({
    type: 'enum',
    enum: StatusAtendimento,
    default: StatusAtendimento.PENDENTE
  })
  status!: StatusAtendimento;

  @Column({ type: 'uuid', nullable: true })
  farmacia_id?: string;

  @Column({ type: 'uuid', nullable: true })
  atendente_id?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relacionamentos
  @ManyToOne('Farmacia', { nullable: true })
  @JoinColumn({ name: 'farmacia_id' })
  farmacia?: any;

  @ManyToOne('Atendente', { nullable: true })
  @JoinColumn({ name: 'atendente_id' })
  atendente?: any;

  // Métodos de negócio
  isPendente(): boolean {
    return this.status === StatusAtendimento.PENDENTE;
  }

  isEmAndamento(): boolean {
    return this.status === StatusAtendimento.EM_ANDAMENTO;
  }

  isFinalizado(): boolean {
    return this.status === StatusAtendimento.FINALIZADO;
  }

  isCancelado(): boolean {
    return this.status === StatusAtendimento.CANCELADO;
  }

  iniciarAtendimento(): void {
    if (this.isPendente()) {
      this.status = StatusAtendimento.EM_ANDAMENTO;
    }
  }

  finalizarAtendimento(resposta?: string): void {
    if (this.isEmAndamento()) {
      this.status = StatusAtendimento.FINALIZADO;
      if (resposta) {
        this.resposta = resposta;
      }
    }
  }

  cancelarAtendimento(): void {
    if (!this.isFinalizado()) {
      this.status = StatusAtendimento.CANCELADO;
    }
  }

  adicionarRemedioEncontrado(remedio: any): void {
    if (!this.remedios_encontrados) {
      this.remedios_encontrados = [];
    }
    this.remedios_encontrados.push(remedio);
  }

  // Validações de negócio
  validarDados(): boolean {
    return !!(this.nome && this.telefone_cliente && this.telefone_farmacia && 
              this.data_hora && this.pergunta);
  }

  podeSerFinalizado(): boolean {
    return this.isEmAndamento() && !!this.resposta;
  }

  getDuracaoAtendimento(): number {
    if (this.isFinalizado() || this.isCancelado()) {
      return this.updated_at.getTime() - this.created_at.getTime();
    }
    return Date.now() - this.created_at.getTime();
  }
} 