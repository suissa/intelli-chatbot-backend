import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('remedios')
export class Remedio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco!: number;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

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

  alterarPreco(novoPreco: number): void {
    if (novoPreco >= 0) {
      this.preco = novoPreco;
    }
  }

  getPrecoFormatado(): string {
    return `R$ ${this.preco.toFixed(2)}`;
  }

  validarDados(): boolean {
    return this.nome.length > 0 && this.preco >= 0;
  }

  // Método para verificar se o remédio corresponde ao termo de busca
  matchesSearch(termo: string): boolean {
    return this.nome.toLowerCase().includes(termo.toLowerCase());
  }

  // Método para obter informações resumidas
  getInfoResumida(): any {
    return {
      id: this.id || 0,
      nome: this.nome || '',
      preco: this.preco || 0,
      ativo: this.ativo
    };
  }
} 