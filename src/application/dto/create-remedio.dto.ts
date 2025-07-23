import { IsString, IsNumber, IsOptional, IsUUID, IsBoolean, Length, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRemedioDto {
  @IsString({ message: 'nome deve ser uma string' })
  @Length(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' })
  nome!: string;

  @IsString({ message: 'categoria deve ser uma string' })
  @Length(1, 100, { message: 'categoria deve ter entre 1 e 100 caracteres' })
  categoria!: string;

  @IsString({ message: 'laboratorio deve ser uma string' })
  @Length(2, 255, { message: 'laboratorio deve ter entre 2 e 255 caracteres' })
  laboratorio!: string;

  @IsNumber({}, { message: 'preco deve ser um número' })
  @Min(0, { message: 'preco deve ser maior ou igual a 0' })
  @Max(999999.99, { message: 'preco deve ser menor que 1.000.000' })
  preco!: number;

  @IsNumber({}, { message: 'estoque deve ser um número' })
  @Min(0, { message: 'estoque deve ser maior ou igual a 0' })
  @Max(999999, { message: 'estoque deve ser menor que 1.000.000' })
  estoque!: number;

  @IsString({ message: 'concentracao deve ser uma string' })
  @Length(1, 100, { message: 'concentracao deve ter entre 1 e 100 caracteres' })
  concentracao!: string;

  @IsString({ message: 'forma_farmaceutica deve ser uma string' })
  @Length(1, 100, { message: 'forma_farmaceutica deve ter entre 1 e 100 caracteres' })
  forma_farmaceutica!: string;

  @IsString({ message: 'data_fabricacao deve ser uma data válida' })
  data_fabricacao!: string;

  @IsString({ message: 'data_validade deve ser uma data válida' })
  data_validade!: string;

  @IsBoolean({ message: 'requer_receita deve ser um valor booleano' })
  requer_receita!: boolean;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean = true;

  @IsString({ message: 'principio_ativo deve ser uma string' })
  @Length(2, 255, { message: 'principio_ativo deve ter entre 2 e 255 caracteres' })
  principio_ativo!: string;

  @IsString({ message: 'efeitos_colaterais deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'efeitos_colaterais deve ter no máximo 2000 caracteres' })
  efeitos_colaterais?: string;

  @IsString({ message: 'contraindicacoes deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'contraindicacoes deve ter no máximo 2000 caracteres' })
  contraindicacoes?: string;

  @IsString({ message: 'usos deve ser uma string' })
  @Length(1, 1000, { message: 'usos deve ter entre 1 e 1000 caracteres' })
  usos!: string;
}

export class UpdateRemedioDto {
  @IsString({ message: 'nome deve ser uma string' })
  @IsOptional()
  @Length(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' })
  nome?: string;

  @IsString({ message: 'categoria deve ser uma string' })
  @IsOptional()
  @Length(1, 100, { message: 'categoria deve ter entre 1 e 100 caracteres' })
  categoria?: string;

  @IsString({ message: 'laboratorio deve ser uma string' })
  @IsOptional()
  @Length(2, 255, { message: 'laboratorio deve ter entre 2 e 255 caracteres' })
  laboratorio?: string;

  @IsNumber({}, { message: 'preco deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'preco deve ser maior ou igual a 0' })
  @Max(999999.99, { message: 'preco deve ser menor que 1.000.000' })
  preco?: number;

  @IsNumber({}, { message: 'estoque deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'estoque deve ser maior ou igual a 0' })
  @Max(999999, { message: 'estoque deve ser menor que 1.000.000' })
  estoque?: number;

  @IsString({ message: 'concentracao deve ser uma string' })
  @IsOptional()
  @Length(1, 100, { message: 'concentracao deve ter entre 1 e 100 caracteres' })
  concentracao?: string;

  @IsString({ message: 'forma_farmaceutica deve ser uma string' })
  @IsOptional()
  @Length(1, 100, { message: 'forma_farmaceutica deve ter entre 1 e 100 caracteres' })
  forma_farmaceutica?: string;

  @IsString({ message: 'data_fabricacao deve ser uma data válida' })
  @IsOptional()
  data_fabricacao?: string;

  @IsString({ message: 'data_validade deve ser uma data válida' })
  @IsOptional()
  data_validade?: string;

  @IsBoolean({ message: 'requer_receita deve ser um valor booleano' })
  @IsOptional()
  requer_receita?: boolean;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean;

  @IsString({ message: 'principio_ativo deve ser uma string' })
  @IsOptional()
  @Length(2, 255, { message: 'principio_ativo deve ter entre 2 e 255 caracteres' })
  principio_ativo?: string;

  @IsString({ message: 'efeitos_colaterais deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'efeitos_colaterais deve ter no máximo 2000 caracteres' })
  efeitos_colaterais?: string;

  @IsString({ message: 'contraindicacoes deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'contraindicacoes deve ter no máximo 2000 caracteres' })
  contraindicacoes?: string;

  @IsString({ message: 'usos deve ser uma string' })
  @IsOptional()
  @Length(1, 1000, { message: 'usos deve ter entre 1 e 1000 caracteres' })
  usos?: string;
}

export class AtualizarEstoqueDto {
  @IsNumber({}, { message: 'quantidade deve ser um número' })
  @Min(1, { message: 'quantidade deve ser maior que 0' })
  quantidade!: number;
} 