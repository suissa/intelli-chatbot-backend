export declare class Remedio {
    id: number;
    nome: string;
    preco: number;
    ativo: boolean;
    isAtivo(): boolean;
    ativar(): void;
    desativar(): void;
    alterarPreco(novoPreco: number): void;
    getPrecoFormatado(): string;
    validarDados(): boolean;
    matchesSearch(termo: string): boolean;
    getInfoResumida(): any;
}
//# sourceMappingURL=remedio.entity.d.ts.map