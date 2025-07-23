import { IsString, IsEmail, IsUrl, IsBoolean, IsOptional, ValidateNested, IsNumber, Length, Matches } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { HorarioFuncionamento } from '../../domain/entities';

export class HorarioFuncionamentoDto implements HorarioFuncionamento {
  @IsString({ message: 'segunda deve ser uma string' })
  @Length(1, 50, { message: 'segunda deve ter entre 1 e 50 caracteres' })
  segunda!: string;

  @IsString({ message: 'terca deve ser uma string' })
  @Length(1, 50, { message: 'terca deve ter entre 1 e 50 caracteres' })
  terca!: string;

  @IsString({ message: 'quarta deve ser uma string' })
  @Length(1, 50, { message: 'quarta deve ter entre 1 e 50 caracteres' })
  quarta!: string;

  @IsString({ message: 'quinta deve ser uma string' })
  @Length(1, 50, { message: 'quinta deve ter entre 1 e 50 caracteres' })
  quinta!: string;

  @IsString({ message: 'sexta deve ser uma string' })
  @Length(1, 50, { message: 'sexta deve ter entre 1 e 50 caracteres' })
  sexta!: string;

  @IsString({ message: 'sabado deve ser uma string' })
  @Length(1, 50, { message: 'sabado deve ter entre 1 e 50 caracteres' })
  sabado!: string;

  @IsString({ message: 'domingo deve ser uma string' })
  @Length(1, 50, { message: 'domingo deve ter entre 1 e 50 caracteres' })
  domingo!: string;
}

export class CreateFarmaciaDto {
  @IsString({ message: 'nome deve ser uma string' })
  @Length(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' })
  nome!: string;

  @IsString({ message: 'telefone deve ser uma string' })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Length(10, 11, { message: 'telefone deve ter entre 10 e 11 dígitos' })
  telefone!: string;

  @IsString({ message: 'endereco deve ser uma string' })
  @Length(5, 500, { message: 'endereco deve ter entre 5 e 500 caracteres' })
  endereco!: string;

  @IsString({ message: 'cidade deve ser uma string' })
  @Length(2, 100, { message: 'cidade deve ter entre 2 e 100 caracteres' })
  cidade!: string;

  @IsString({ message: 'estado deve ser uma string' })
  @Length(2, 2, { message: 'estado deve ter exatamente 2 caracteres' })
  estado!: string;

  @IsString({ message: 'cep deve ser uma string' })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Length(8, 8, { message: 'cep deve ter exatamente 8 dígitos' })
  cep!: string;

  @IsString({ message: 'cnpj deve ser uma string' })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Length(14, 14, { message: 'cnpj deve ter exatamente 14 dígitos' })
  cnpj!: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  email!: string;

  @IsUrl({}, { message: 'website deve ser uma URL válida' })
  @IsOptional()
  website?: string;

  @IsString({ message: 'descricao deve ser uma string' })
  @IsOptional()
  @Length(0, 1000, { message: 'descricao deve ter no máximo 1000 caracteres' })
  descricao?: string;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean = true;

  @ValidateNested({ message: 'horario_funcionamento deve ser um objeto válido' })
  @Type(() => HorarioFuncionamentoDto)
  horario_funcionamento!: HorarioFuncionamentoDto;
}

export class UpdateFarmaciaDto {
  @IsString({ message: 'nome deve ser uma string' })
  @IsOptional()
  @Length(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' })
  nome?: string;

  @IsString({ message: 'telefone deve ser uma string' })
  @IsOptional()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Length(10, 11, { message: 'telefone deve ter entre 10 e 11 dígitos' })
  telefone?: string;

  @IsString({ message: 'endereco deve ser uma string' })
  @IsOptional()
  @Length(5, 500, { message: 'endereco deve ter entre 5 e 500 caracteres' })
  endereco?: string;

  @IsString({ message: 'cidade deve ser uma string' })
  @IsOptional()
  @Length(2, 100, { message: 'cidade deve ter entre 2 e 100 caracteres' })
  cidade?: string;

  @IsString({ message: 'estado deve ser uma string' })
  @IsOptional()
  @Length(2, 2, { message: 'estado deve ter exatamente 2 caracteres' })
  estado?: string;

  @IsString({ message: 'cep deve ser uma string' })
  @IsOptional()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @Length(8, 8, { message: 'cep deve ter exatamente 8 dígitos' })
  cep?: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsOptional()
  email?: string;

  @IsUrl({}, { message: 'website deve ser uma URL válida' })
  @IsOptional()
  website?: string;

  @IsString({ message: 'descricao deve ser uma string' })
  @IsOptional()
  @Length(0, 1000, { message: 'descricao deve ter no máximo 1000 caracteres' })
  descricao?: string;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean;

  @ValidateNested({ message: 'horario_funcionamento deve ser um objeto válido' })
  @IsOptional()
  @Type(() => HorarioFuncionamentoDto)
  horario_funcionamento?: HorarioFuncionamentoDto;
} 