"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiConfig = exports.swaggerConfig = void 0;
exports.swaggerConfig = {
    swagger: {
        info: {
            title: 'Fastify Atendimento API',
            description: 'API completa para sistema de atendimento farmacêutico com IA',
            version: '1.0.0',
            contact: {
                name: 'API Support',
                email: 'support@farmacia.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        host: 'localhost:3000',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Drugs', description: 'Endpoints para gerenciamento de medicamentos' },
            { name: 'Attendants', description: 'Endpoints para gerenciamento de atendentes' },
            { name: 'Pharmacies', description: 'Endpoints para gerenciamento de farmácias' },
            { name: 'Attendances', description: 'Endpoints para gerenciamento de atendimentos' }
        ],
        definitions: {
            Drug: {
                type: 'object',
                properties: {
                    id: { type: 'number', description: 'ID único do medicamento' },
                    nome: { type: 'string', description: 'Nome do medicamento' },
                    categoria: { type: 'string', description: 'Categoria do medicamento' },
                    laboratorio: { type: 'string', description: 'Laboratório fabricante' },
                    preco: { type: 'number', description: 'Preço do medicamento' },
                    estoque: { type: 'number', description: 'Quantidade em estoque' },
                    concentracao: { type: 'string', description: 'Concentração do medicamento' },
                    forma_farmaceutica: { type: 'string', description: 'Forma farmacêutica' },
                    data_fabricacao: { type: 'string', format: 'date', description: 'Data de fabricação' },
                    data_validade: { type: 'string', format: 'date', description: 'Data de validade' },
                    requer_receita: { type: 'boolean', description: 'Se requer receita médica' },
                    ativo: { type: 'boolean', description: 'Se está ativo' },
                    principio_ativo: { type: 'string', description: 'Princípio ativo' },
                    efeitos_colaterais: { type: 'string', description: 'Efeitos colaterais' },
                    contraindicacoes: { type: 'string', description: 'Contraindicações' },
                    usos: { type: 'string', description: 'Indicações de uso' },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação' },
                    updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização' }
                }
            },
            Attendant: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID único do atendente' },
                    farmacia_id: { type: 'string', description: 'ID da farmácia' },
                    voz: {
                        type: 'string',
                        enum: ['masculina', 'feminina', 'neutra'],
                        description: 'Tipo de voz do atendente'
                    },
                    perfil: {
                        type: 'string',
                        enum: ['formal', 'informal', 'amigavel', 'profissional'],
                        description: 'Perfil do atendente'
                    },
                    ativo: { type: 'boolean', description: 'Se está ativo' },
                    createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' }
                }
            },
            Pharmacy: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID único da farmácia' },
                    nome: { type: 'string', description: 'Nome da farmácia' },
                    telefone: { type: 'string', description: 'Telefone da farmácia' },
                    endereco: { type: 'string', description: 'Endereço completo' },
                    cidade: { type: 'string', description: 'Cidade' },
                    estado: { type: 'string', description: 'Estado' },
                    cep: { type: 'string', description: 'CEP' },
                    cnpj: { type: 'string', description: 'CNPJ da farmácia' },
                    email: { type: 'string', description: 'Email da farmácia' },
                    website: { type: 'string', description: 'Website da farmácia' },
                    descricao: { type: 'string', description: 'Descrição da farmácia' },
                    ativo: { type: 'boolean', description: 'Se está ativa' },
                    horario_funcionamento: {
                        type: 'object',
                        properties: {
                            segunda: { type: 'string' },
                            terca: { type: 'string' },
                            quarta: { type: 'string' },
                            quinta: { type: 'string' },
                            sexta: { type: 'string' },
                            sabado: { type: 'string' },
                            domingo: { type: 'string' }
                        }
                    },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação' },
                    updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização' }
                }
            },
            Attendance: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID único do atendimento' },
                    nome: { type: 'string', description: 'Nome do cliente' },
                    telefone_cliente: { type: 'string', description: 'Telefone do cliente' },
                    telefone_farmacia: { type: 'string', description: 'Telefone da farmácia' },
                    data_hora: { type: 'string', format: 'date-time', description: 'Data e hora do atendimento' },
                    tipo: {
                        type: 'string',
                        enum: ['ia', 'humano'],
                        description: 'Tipo de atendimento'
                    },
                    pergunta: { type: 'string', description: 'Pergunta do cliente' },
                    resposta: { type: 'string', description: 'Resposta fornecida' },
                    remedios_encontrados: {
                        type: 'array',
                        items: { type: 'object' },
                        description: 'Medicamentos encontrados'
                    },
                    status: {
                        type: 'string',
                        enum: ['pendente', 'em_andamento', 'finalizado', 'cancelado'],
                        description: 'Status do atendimento'
                    },
                    farmacia_id: { type: 'string', description: 'ID da farmácia' },
                    atendente_id: { type: 'string', description: 'ID do atendente' },
                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação' },
                    updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', description: 'Tipo do erro' },
                    message: { type: 'string', description: 'Mensagem de erro' }
                }
            },
            Success: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object', description: 'Dados da resposta' },
                    count: { type: 'number', description: 'Quantidade de itens' },
                    message: { type: 'string', description: 'Mensagem de sucesso' }
                }
            }
        }
    }
};
exports.swaggerUiConfig = {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
        displayOperationId: false,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next();
        },
        preHandler: function (request, reply, next) {
            next();
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
    },
    transformSpecificationClone: true
};
//# sourceMappingURL=swagger.config.js.map