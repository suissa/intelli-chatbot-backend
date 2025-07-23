import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
export declare const swaggerConfig: {
    swagger: {
        info: {
            title: string;
            description: string;
            version: string;
            contact: {
                name: string;
                email: string;
            };
            license: {
                name: string;
                url: string;
            };
        };
        host: string;
        schemes: string[];
        consumes: string[];
        produces: string[];
        tags: {
            name: string;
            description: string;
        }[];
        definitions: {
            Drug: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    nome: {
                        type: string;
                        description: string;
                    };
                    categoria: {
                        type: string;
                        description: string;
                    };
                    laboratorio: {
                        type: string;
                        description: string;
                    };
                    preco: {
                        type: string;
                        description: string;
                    };
                    estoque: {
                        type: string;
                        description: string;
                    };
                    concentracao: {
                        type: string;
                        description: string;
                    };
                    forma_farmaceutica: {
                        type: string;
                        description: string;
                    };
                    data_fabricacao: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    data_validade: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    requer_receita: {
                        type: string;
                        description: string;
                    };
                    ativo: {
                        type: string;
                        description: string;
                    };
                    principio_ativo: {
                        type: string;
                        description: string;
                    };
                    efeitos_colaterais: {
                        type: string;
                        description: string;
                    };
                    contraindicacoes: {
                        type: string;
                        description: string;
                    };
                    usos: {
                        type: string;
                        description: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    updated_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            Attendant: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    farmacia_id: {
                        type: string;
                        description: string;
                    };
                    voz: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    perfil: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    ativo: {
                        type: string;
                        description: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            Pharmacy: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    nome: {
                        type: string;
                        description: string;
                    };
                    telefone: {
                        type: string;
                        description: string;
                    };
                    endereco: {
                        type: string;
                        description: string;
                    };
                    cidade: {
                        type: string;
                        description: string;
                    };
                    estado: {
                        type: string;
                        description: string;
                    };
                    cep: {
                        type: string;
                        description: string;
                    };
                    cnpj: {
                        type: string;
                        description: string;
                    };
                    email: {
                        type: string;
                        description: string;
                    };
                    website: {
                        type: string;
                        description: string;
                    };
                    descricao: {
                        type: string;
                        description: string;
                    };
                    ativo: {
                        type: string;
                        description: string;
                    };
                    horario_funcionamento: {
                        type: string;
                        properties: {
                            segunda: {
                                type: string;
                            };
                            terca: {
                                type: string;
                            };
                            quarta: {
                                type: string;
                            };
                            quinta: {
                                type: string;
                            };
                            sexta: {
                                type: string;
                            };
                            sabado: {
                                type: string;
                            };
                            domingo: {
                                type: string;
                            };
                        };
                    };
                    created_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    updated_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            Attendance: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    nome: {
                        type: string;
                        description: string;
                    };
                    telefone_cliente: {
                        type: string;
                        description: string;
                    };
                    telefone_farmacia: {
                        type: string;
                        description: string;
                    };
                    data_hora: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    tipo: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    pergunta: {
                        type: string;
                        description: string;
                    };
                    resposta: {
                        type: string;
                        description: string;
                    };
                    remedios_encontrados: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    farmacia_id: {
                        type: string;
                        description: string;
                    };
                    atendente_id: {
                        type: string;
                        description: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    updated_at: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            Error: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    error: {
                        type: string;
                        description: string;
                    };
                    message: {
                        type: string;
                        description: string;
                    };
                };
            };
            Success: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                        description: string;
                    };
                    count: {
                        type: string;
                        description: string;
                    };
                    message: {
                        type: string;
                        description: string;
                    };
                };
            };
        };
    };
};
export declare const swaggerUiConfig: FastifySwaggerUiOptions;
//# sourceMappingURL=swagger.config.d.ts.map