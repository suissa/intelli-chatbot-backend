export declare enum VozAtendente {
    MASCULINA = "masculina",
    FEMININA = "feminina",
    NEUTRA = "neutra"
}
export declare enum PerfilAtendente {
    FORMAL = "formal",
    INFORMAL = "informal",
    AMIGAVEL = "amigavel",
    PROFISSIONAL = "profissional"
}
export declare class Atendente {
    id: string;
    farmacia_id: string;
    voz: VozAtendente;
    perfil: PerfilAtendente;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
    farmacia?: any;
    isAtivo(): boolean;
    ativar(): void;
    desativar(): void;
    alterarVoz(novaVoz: VozAtendente): void;
    alterarPerfil(novoPerfil: PerfilAtendente): void;
    getConfiguracaoVoz(): string;
    validarConfiguracao(): boolean;
    clonarConfiguracao(): Partial<Atendente>;
}
//# sourceMappingURL=atendente.entity.d.ts.map