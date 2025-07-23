import { HorarioFuncionamento } from '../../domain/entities';
export declare class HorarioFuncionamentoDto implements HorarioFuncionamento {
    segunda: string;
    terca: string;
    quarta: string;
    quinta: string;
    sexta: string;
    sabado: string;
    domingo: string;
}
export declare class CreateFarmaciaDto {
    nome: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    cnpj: string;
    email: string;
    website?: string;
    descricao?: string;
    ativo?: boolean;
    horario_funcionamento: HorarioFuncionamentoDto;
}
export declare class UpdateFarmaciaDto {
    nome?: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    email?: string;
    website?: string;
    descricao?: string;
    ativo?: boolean;
    horario_funcionamento?: HorarioFuncionamentoDto;
}
//# sourceMappingURL=create-farmacia.dto.d.ts.map