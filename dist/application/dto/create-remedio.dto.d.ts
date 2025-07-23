export declare class CreateRemedioDto {
    nome: string;
    categoria: string;
    laboratorio: string;
    preco: number;
    estoque: number;
    concentracao: string;
    forma_farmaceutica: string;
    data_fabricacao: string;
    data_validade: string;
    requer_receita: boolean;
    ativo?: boolean;
    principio_ativo: string;
    efeitos_colaterais?: string;
    contraindicacoes?: string;
    usos: string;
}
export declare class UpdateRemedioDto {
    nome?: string;
    categoria?: string;
    laboratorio?: string;
    preco?: number;
    estoque?: number;
    concentracao?: string;
    forma_farmaceutica?: string;
    data_fabricacao?: string;
    data_validade?: string;
    requer_receita?: boolean;
    ativo?: boolean;
    principio_ativo?: string;
    efeitos_colaterais?: string;
    contraindicacoes?: string;
    usos?: string;
}
export declare class AtualizarEstoqueDto {
    quantidade: number;
}
//# sourceMappingURL=create-remedio.dto.d.ts.map