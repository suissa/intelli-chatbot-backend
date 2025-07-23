import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum VozAtendente {
  MASCULINA = 'masculina',
  FEMININA = 'feminina',
  NEUTRA = 'neutra'
}

export enum PerfilAtendente {
  FORMAL = 'formal',
  INFORMAL = 'informal',
  AMIGAVEL = 'amigavel',
  PROFISSIONAL = 'profissional'
}

@Entity('atendentes')
export class Atendente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  farmacia_id!: string;

  @Column({
    type: 'enum',
    enum: VozAtendente,
    nullable: false,
    default: VozAtendente.FEMININA
  })
  voz!: VozAtendente;

  @Column({
    type: 'enum',
    enum: PerfilAtendente,
    default: PerfilAtendente.PROFISSIONAL
  })
  perfil!: PerfilAtendente;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamento com Farmacia (opcional, para referência)
  @ManyToOne('Farmacia', { nullable: true })
  @JoinColumn({ name: 'farmacia_id' })
  farmacia?: any;

  // Métodos de negócio
  isAtivo(): boolean {
    return this.ativo;
  }

  ativar(): void {
    this.ativo = true;
  }

  desativar(): void {
    this.ativo = false;
  }

  alterarVoz(novaVoz: VozAtendente): void {
    this.voz = novaVoz;
  }

  alterarPerfil(novoPerfil: PerfilAtendente): void {
    this.perfil = novoPerfil;
  }

  getConfiguracaoVoz(): string {
    return `${this.voz}_${this.perfil}`;
  }

  // Validações de negócio
  validarConfiguracao(): boolean {
    return !!(this.farmacia_id && this.voz && this.perfil);
  }

  // Método para clonar configuração
  clonarConfiguracao(): Partial<Atendente> {
    return {
      voz: this.voz,
      perfil: this.perfil,
      ativo: this.ativo
    };
  }
} 