import { IsString, IsEnum, IsOptional, IsNumber, Length, Min, Max } from 'class-validator';
import { TipoMensagem, StatusMensagem } from '../../domain/entities';

export class CreateMessageQueueDto {
  @IsEnum(TipoMensagem, { message: 'tipo deve ser um valor válido' })
  @IsOptional()
  tipo?: TipoMensagem = TipoMensagem.IA;

  @IsString({ message: 'telefone_farmacia deve ser uma string' })
  @Length(10, 11, { message: 'telefone_farmacia deve ter entre 10 e 11 dígitos' })
  telefone_farmacia!: string;

  @IsString({ message: 'telefone_cliente deve ser uma string' })
  @Length(10, 11, { message: 'telefone_cliente deve ter entre 10 e 11 dígitos' })
  telefone_cliente!: string;

  @IsString({ message: 'nome_cliente deve ser uma string' })
  @Length(2, 255, { message: 'nome_cliente deve ter entre 2 e 255 caracteres' })
  nome_cliente!: string;

  @IsString({ message: 'pergunta deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'pergunta deve ter no máximo 2000 caracteres' })
  pergunta?: string;

  @IsString({ message: 'acao deve ser uma string' })
  @IsOptional()
  @Length(0, 100, { message: 'acao deve ter no máximo 100 caracteres' })
  acao?: string;

  @IsOptional()
  dados?: any;

  @IsNumber({}, { message: 'max_tentativas deve ser um número' })
  @IsOptional()
  @Min(1, { message: 'max_tentativas deve ser maior que 0' })
  @Max(10, { message: 'max_tentativas deve ser menor ou igual a 10' })
  max_tentativas?: number = 3;
}

export class UpdateMessageQueueDto {
  @IsString({ message: 'resposta deve ser uma string' })
  @IsOptional()
  @Length(0, 2000, { message: 'resposta deve ter no máximo 2000 caracteres' })
  resposta?: string;

  @IsOptional()
  remedios_encontrados?: any[];

  @IsString({ message: 'erro deve ser uma string' })
  @IsOptional()
  @Length(0, 1000, { message: 'erro deve ter no máximo 1000 caracteres' })
  erro?: string;

  @IsEnum(StatusMensagem, { message: 'status deve ser um valor válido' })
  @IsOptional()
  status?: StatusMensagem;
}

export class ProcessMessageDto {
  @IsString({ message: 'resposta deve ser uma string' })
  @Length(1, 2000, { message: 'resposta deve ter entre 1 e 2000 caracteres' })
  resposta!: string;

  @IsOptional()
  remedios_encontrados?: any[];
} 