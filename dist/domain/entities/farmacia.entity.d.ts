export interface HorarioFuncionamento {
    segunda: string;
    terca: string;
    quarta: string;
    quinta: string;
    sexta: string;
    sabado: string;
    domingo: string;
}
export declare class Farmacia {
    id: string;
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
    ativo: boolean;
    horario_funcionamento: HorarioFuncionamento;
    created_at: Date;
    updated_at: Date;
    atendentes?: any[];
    remedios?: any[];
    isAtiva(): boolean;
    ativar(): void;
    desativar(): void;
    alterarHorarioFuncionamento(horario: HorarioFuncionamento): void;
    getHorarioPorDia(dia: keyof HorarioFuncionamento): string;
    validarDados(): boolean;
    validarCNPJ(): boolean;
    validarCEP(): boolean;
}
//# sourceMappingURL=farmacia.entity.d.ts.map