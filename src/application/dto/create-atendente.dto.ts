import { IsUUID, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { VozAtendente, PerfilAtendente } from '../../domain/entities';

export class CreateAtendenteDto {
  @IsUUID('4', { message: 'farmacia_id deve ser um UUID válido' })
  farmacia_id!: string;

  @IsEnum(VozAtendente, { message: 'voz deve ser um valor válido' })
  @IsOptional()
  voz?: VozAtendente = VozAtendente.FEMININA;

  @IsEnum(PerfilAtendente, { message: 'perfil deve ser um valor válido' })
  @IsOptional()
  perfil?: PerfilAtendente = PerfilAtendente.PROFISSIONAL;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean = true;
}

export class UpdateAtendenteDto {
  @IsEnum(VozAtendente, { message: 'voz deve ser um valor válido' })
  @IsOptional()
  voz?: VozAtendente;

  @IsEnum(PerfilAtendente, { message: 'perfil deve ser um valor válido' })
  @IsOptional()
  perfil?: PerfilAtendente;

  @IsBoolean({ message: 'ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean;
} 