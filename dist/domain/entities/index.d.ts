export { Atendente, VozAtendente, PerfilAtendente } from './atendente.entity';
export { Farmacia } from './farmacia.entity';
export { Atendimento, TipoAtendimento, StatusAtendimento } from './atendimento.entity';
export { Remedio } from './remedio.entity';
export { MessageQueue, TipoMensagem, StatusMensagem } from './message-queue.entity';
export { Outbox, OutboxStatus, OutboxType } from './outbox.entity';
export interface HorarioFuncionamento {
    segunda: string;
    terca: string;
    quarta: string;
    quinta: string;
    sexta: string;
    sabado: string;
    domingo: string;
}
//# sourceMappingURL=index.d.ts.map