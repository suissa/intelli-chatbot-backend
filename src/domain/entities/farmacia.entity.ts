import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export interface HorarioFuncionamento {
  segunda: string;
  terca: string;
  quarta: string;
  quinta: string;
  sexta: string;
  sabado: string;
  domingo: string;
}

@Entity('farmacias')
export class Farmacia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  telefone!: string;

  @Column({ type: 'text', nullable: false })
  endereco!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cidade!: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  estado!: string;

  @Column({ type: 'varchar', length: 8, nullable: false })
  cep!: string;

  @Column({ type: 'varchar', length: 18, nullable: false, unique: true })
  cnpj!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @Column({ type: 'jsonb', nullable: false })
  horario_funcionamento!: HorarioFuncionamento;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relacionamentos
  @OneToMany('Atendente', 'farmacia')
  atendentes?: any[];

  @OneToMany('Remedio', 'farmacia')
  remedios?: any[];

  // Métodos de negócio
  isAtiva(): boolean {
    return this.ativo;
  }

  ativar(): void {
    this.ativo = true;
  }

  desativar(): void {
    this.ativo = false;
  }

  alterarHorarioFuncionamento(horario: HorarioFuncionamento): void {
    this.horario_funcionamento = horario;
  }

  getHorarioPorDia(dia: keyof HorarioFuncionamento): string {
    return this.horario_funcionamento[dia];
  }

  // Validações de negócio
  validarDados(): boolean {
    return !!(this.nome && this.telefone && this.endereco && this.cidade && 
              this.estado && this.cep && this.cnpj && this.email);
  }

  validarCNPJ(): boolean {
    // Implementar validação de CNPJ
    return this.cnpj.length === 18;
  }

  validarCEP(): boolean {
    // Implementar validação de CEP
    return this.cep.length === 8;
  }
} 