import { IsString, IsEnum, IsOptional, IsUUID, IsDateString, Length } from 'class-validator';
import { TipoAtendimento, StatusAtendimento } from '../../domain/entities';

export class CreateAtendimentoDto {
  @IsString({ message: 'nome deve ser uma string' })
  @Length(2, 255, { message: 'nome deve ter entre 2 e 255 caracteres' })
  nome!: string;

  @IsString({ message: 'telefone_cliente deve ser uma string' })
  @Length(10, 11, { message: 'telefone_cliente deve ter entre 10 e 11 dígitos' })
  telefone_cliente!: string;

  @IsString({ message: 'telefone_farmacia deve ser uma string' })
  @Length(10, 11, { message: 'telefone_farmacia deve ter entre 10 e 11 dígitos' })
  telefone_farmacia!: string;

  @IsDateString({}, { message: 'data_hora deve ser uma data válida' })
  data_hora!: string;

  @IsEnum(TipoAtendimento, { message: 'tipo deve ser um valor válido' })
  @IsOptional()
  tipo?: TipoAtendimento = TipoAtendimento.IA;

  @IsString({ message: 'pergunta deve ser uma string' })
  @Length(1, 2000, { message: 'pergunta deve ter entre 1 e 2000 caracteres' })
  pergunta!: string;

  @IsUUID('4', { message: 'farmacia_id deve ser um UUID válido' })
  @IsOptional()
  farmacia_id?: string;

  @IsUUID('4', { message: 'atendente_id deve ser um UUID válido' })
  @IsOptional()
  atendente_id?: string;
}

export class UpdateAtendimentoDto {
  @IsString({ message: 'resposta deve ser uma string' })
  @IsOptional()
  @Length(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' })
  resposta?: string;

  @IsEnum(StatusAtendimento, { message: 'status deve ser um valor válido' })
  @IsOptional()
  status?: StatusAtendimento;

  @IsUUID('4', { message: 'atendente_id deve ser um UUID válido' })
  @IsOptional()
  atendente_id?: string;
}

export class FinalizarAtendimentoDto {
  @IsString({ message: 'resposta deve ser uma string' })
  @Length(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' })
  resposta!: string;
} 