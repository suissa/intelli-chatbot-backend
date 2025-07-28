import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import { Container } from './shared/container';
import { TYPES } from './shared/types';
import { swaggerConfig, swaggerUiConfig } from './shared/swagger.config';
import { initializeDatabase, closeDatabase } from './infrastructure/database/typeorm.config';
// import { DrugsController } from './application/controllers/drugs.controller';
// import { AttendantController } from './application/controllers/attendant.controller';
import { PharmacyController } from './application/controllers/pharmacy.controller';
// import { AttendanceController } from './application/controllers/attendance.controller';
// import { MessageQueueController } from './application/controllers/message-queue.controller';
// import { RabbitMQConnection } from './infrastructure/messaging/rabbitmq-connection';
// import { MessageQueueManager } from './infrastructure/messaging/message-queue-manager';
// import { MessageProcessorService } from './domain/services/message-processor.service';

const fastify = Fastify({
  logger: false
});

// Registrar rotas do Drugs
async function registerDrugsRoutes() {
  // const drugsController = Container.get<DrugsController>(TYPES.DrugsController);

  // // GET /api/drugs - Listar todos os remédios
  // fastify.get('/api/drugs', {
  //   schema: {
  //     tags: ['Drugs'],
  //     summary: 'Listar todos os medicamentos',
  //     description: 'Retorna uma lista de todos os medicamentos cadastrados',
  //     response: {
  //       200: {
  //         description: 'Lista de medicamentos',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: { type: 'array' },
  //           count: { type: 'number' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await drugsController.getAllDrugs(request, reply);
  // });

  // // GET /api/drugs/:id - Buscar remédio por ID
  // fastify.get('/api/drugs/:id', async (request, reply) => {
  //   await drugsController.getDrugById(request as any, reply);
  // });

  // // GET /api/drugs/search?q=termo - Buscar remédios
  // fastify.get('/api/drugs/search', async (request, reply) => {
  //   await drugsController.searchDrugs(request as any, reply);
  // });

  // // GET /api/drugs/active - Remédios ativos
  // fastify.get('/api/drugs/active', async (request, reply) => {
  //   await drugsController.getActiveDrugs(request, reply);
  // });
}

// Registrar rotas do Attendant
async function registerAttendantRoutes() {
  // const attendantController = Container.get<AttendantController>(TYPES.AttendantController);

  // // GET /api/attendants - Listar todos os atendentes
  // fastify.get('/api/attendants', {
  //   schema: {
  //     tags: ['Attendants'],
  //     summary: 'Listar todos os atendentes',
  //     description: 'Retorna uma lista de todos os atendentes cadastrados',
  //     response: {
  //       200: {
  //         description: 'Lista de atendentes',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: { type: 'array' },
  //           count: { type: 'number' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendantController.getAllAttendants(request, reply);
  // });

  // // GET /api/attendants/:id - Buscar atendente por ID
  // fastify.get('/api/attendants/:id', async (request, reply) => {
  //   await attendantController.getAttendantById(request as any, reply);
  // });

  // // GET /api/attendants/pharmacy/:pharmacyId - Atendentes por farmácia
  // fastify.get('/api/attendants/pharmacy/:pharmacyId', async (request, reply) => {
  //   await attendantController.getAttendantsByPharmacy(request as any, reply);
  // });

  // // GET /api/attendants/active - Atendentes ativos
  // fastify.get('/api/attendants/active', async (request, reply) => {
  //   await attendantController.getActiveAttendants(request, reply);
  // });

  // // GET /api/attendants/voice/:voice - Atendentes por voz
  // fastify.get('/api/attendants/voice/:voice', async (request, reply) => {
  //   await attendantController.getAttendantsByVoice(request as any, reply);
  // });

  // // GET /api/attendants/profile/:profile - Atendentes por perfil
  // fastify.get('/api/attendants/profile/:profile', async (request, reply) => {
  //   await attendantController.getAttendantsByProfile(request as any, reply);
  // });

  // // POST /api/attendants - Criar atendente
  // fastify.post('/api/attendants', async (request, reply) => {
  //   await attendantController.createAttendant(request, reply);
  // });

  // // PUT /api/attendants/:id - Atualizar atendente
  // fastify.put('/api/attendants/:id', async (request, reply) => {
  //   await attendantController.updateAttendant(request as any, reply);
  // });

  // // DELETE /api/attendants/:id - Deletar atendente
  // fastify.delete('/api/attendants/:id', async (request, reply) => {
  //   await attendantController.deleteAttendant(request as any, reply);
  // });

  // // PATCH /api/attendants/:id/activate - Ativar atendente
  // fastify.patch('/api/attendants/:id/activate', async (request, reply) => {
  //   await attendantController.activateAttendant(request as any, reply);
  // });

  // // PATCH /api/attendants/:id/deactivate - Desativar atendente
  // fastify.patch('/api/attendants/:id/deactivate', async (request, reply) => {
  //   await attendantController.deactivateAttendant(request as any, reply);
  // });
}

// Registrar rotas do Pharmacy
async function registerPharmacyRoutes() {
  const pharmacyController = Container.get<PharmacyController>(TYPES.PharmacyController);

  // GET /api/pharmacies - Listar todas as farmácias
  fastify.get('/api/pharmacies', {
    schema: {
      tags: ['Pharmacies'],
      summary: 'Listar todas as farmácias',
      description: 'Retorna uma lista de todas as farmácias cadastradas',
      response: {
        200: {
          description: 'Lista de farmácias',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
            count: { type: 'number' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    await pharmacyController.getAllPharmacies(request, reply);
  });
  // GET /api/pharmacies/cnpj/:cnpj - Buscar farmácia por CNPJ
  fastify.get('/api/pharmacies/cnpj/:cnpj', async (request, reply) => {
    await pharmacyController.getPharmacyByCNPJ(request as any, reply);
  });

  fastify.post('/api/pharmacies/set-webhook', async (request, reply) => {
    await pharmacyController.setWebhook(request as any, reply);
  });

  fastify.post('/api/pharmacies/webhook', async (request, reply) => {
    await pharmacyController.webhook(request as any, reply);
  });

  // GET /api/pharmacies/active - Farmácias ativas
  fastify.get('/api/pharmacies/active', async (request, reply) => {
    await pharmacyController.getActivePharmacies(request, reply);
  });

  // GET /api/pharmacies/city/:city - Farmácias por cidade
  fastify.get('/api/pharmacies/city/:city', async (request, reply) => {
    await pharmacyController.getPharmaciesByCity(request as any, reply);
  });

  // GET /api/pharmacies/state/:state - Farmácias por estado
  fastify.get('/api/pharmacies/state/:state', async (request, reply) => {
    await pharmacyController.getPharmaciesByState(request as any, reply);
  });

  // GET /api/pharmacies/search?q=termo - Buscar farmácias
  fastify.get('/api/pharmacies/search', async (request, reply) => {
    await pharmacyController.searchPharmacies(request as any, reply);
  });


  // GET /api/pharmacies/:id - Buscar farmácia por ID
  fastify.get('/api/pharmacies/:id', async (request, reply) => {
    await pharmacyController.getPharmacyById(request as any, reply);
  });

  // POST /api/pharmacies - Criar farmácia
  fastify.post('/api/pharmacies', async (request, reply) => {
    await pharmacyController.createPharmacy(request, reply);
  });

  // PUT /api/pharmacies/:id - Atualizar farmácia
  fastify.put('/api/pharmacies/:id', async (request, reply) => {
    await pharmacyController.updatePharmacy(request as any, reply);
  });

  // DELETE /api/pharmacies/:id - Deletar farmácia
  fastify.delete('/api/pharmacies/:id', async (request, reply) => {
    await pharmacyController.deletePharmacy(request as any, reply);
  });

  // PATCH /api/pharmacies/:id/activate - Ativar farmácia
  fastify.patch('/api/pharmacies/:id/activate', async (request, reply) => {
    await pharmacyController.activatePharmacy(request as any, reply);
  });

  // PATCH /api/pharmacies/:id/deactivate - Desativar farmácia
  fastify.patch('/api/pharmacies/:id/deactivate', async (request, reply) => {
    await pharmacyController.deactivatePharmacy(request as any, reply);
  });
}

// Registrar rotas do Attendance
async function registerAttendanceRoutes() {
  // const attendanceController = Container.get<AttendanceController>(TYPES.AttendanceController);

  // // GET /api/attendances - Listar todos os atendimentos
  // fastify.get('/api/attendances', {
  //   schema: {
  //     tags: ['Attendances'],
  //     summary: 'Listar todos os atendimentos',
  //     description: 'Retorna uma lista de todos os atendimentos cadastrados',
  //     response: {
  //       200: {
  //         description: 'Lista de atendimentos',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: { type: 'array' },
  //           count: { type: 'number' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendanceController.getAllAttendances(request, reply);
  // });

  // // GET /api/attendances/:id - Buscar atendimento por ID
  // fastify.get('/api/attendances/:id', async (request, reply) => {
  //   await attendanceController.getAttendanceById(request as any, reply);
  // });

  // // GET /api/attendances/pharmacy/:pharmacyId - Atendimentos por farmácia
  // fastify.get('/api/attendances/pharmacy/:pharmacyId', async (request, reply) => {
  //   await attendanceController.getAttendancesByPharmacy(request as any, reply);
  // });

  // // GET /api/attendances/attendant/:attendantId - Atendimentos por atendente
  // fastify.get('/api/attendances/attendant/:attendantId', async (request, reply) => {
  //   await attendanceController.getAttendancesByAttendant(request as any, reply);
  // });

  // // GET /api/attendances/status/:status - Atendimentos por status
  // fastify.get('/api/attendances/status/:status', async (request, reply) => {
  //   await attendanceController.getAttendancesByStatus(request as any, reply);
  // });

  // // GET /api/attendances/type/:type - Atendimentos por tipo
  // fastify.get('/api/attendances/type/:type', async (request, reply) => {
  //   await attendanceController.getAttendancesByType(request as any, reply);
  // });

  // // GET /api/attendances/pending - Atendimentos pendentes
  // fastify.get('/api/attendances/pending', async (request, reply) => {
  //   await attendanceController.getPendingAttendances(request, reply);
  // });

  // // GET /api/attendances/active - Atendimentos ativos
  // fastify.get('/api/attendances/active', async (request, reply) => {
  //   await attendanceController.getActiveAttendances(request, reply);
  // });

  // // GET /api/attendances/completed - Atendimentos finalizados
  // fastify.get('/api/attendances/completed', async (request, reply) => {
  //   await attendanceController.getCompletedAttendances(request, reply);
  // });

  // // GET /api/attendances/date-range?startDate=2024-01-01&endDate=2024-12-31 - Atendimentos por período
  // fastify.get('/api/attendances/date-range', async (request, reply) => {
  //   await attendanceController.getAttendancesByDateRange(request as any, reply);
  // });

  // // POST /api/attendances - Criar atendimento
  // fastify.post('/api/attendances', {
  //   schema: {
  //     tags: ['Attendances'],
  //     summary: 'Criar novo atendimento com processamento de remédios',
  //     description: 'Cria um novo atendimento e processa o texto para identificar remédios automaticamente',
  //     body: {
  //       type: 'object',
  //       properties: {
  //         nome: { type: 'string', description: 'Nome do cliente' },
  //         telefone_cliente: { type: 'string', description: 'Telefone do cliente' },
  //         telefone_farmacia: { type: 'string', description: 'Telefone da farmácia' },
  //         data_hora: { type: 'string', format: 'date-time', description: 'Data e hora do atendimento' },
  //         tipo: { type: 'string', enum: ['ia', 'humano'], description: 'Tipo de atendimento' },
  //         pergunta: { type: 'string', description: 'Pergunta ou descrição do cliente (será processada para identificar remédios)' },
  //         resposta: { type: 'string', description: 'Resposta do atendimento' },
  //         farmacia_id: { type: 'string', format: 'uuid', description: 'ID da farmácia' },
  //         atendente_id: { type: 'string', format: 'uuid', description: 'ID do atendente' }
  //       },
  //       required: ['nome', 'telefone_cliente', 'telefone_farmacia', 'data_hora', 'pergunta']
  //     },
  //     response: {
  //       201: {
  //         description: 'Atendimento criado com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: {
  //             type: 'object',
  //             properties: {
  //               attendance: { type: 'object' },
  //               drugInfo: { type: 'object' },
  //               presentation: { type: 'string' }
  //             }
  //           },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         description: 'Erro interno',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendanceController.createAttendance(request, reply);
  // });

  // // POST /api/attendances/process-drug-image - Processar imagem de remédio
  // fastify.post('/api/attendances/process-drug-image', {
  //   schema: {
  //     tags: ['Attendances'],
  //     summary: 'Processar imagem de remédio com OCR e IA',
  //     description: 'Recebe uma imagem de remédio, extrai texto com OCR, busca no banco e gera apresentação com OpenAI',
  //     consumes: ['multipart/form-data'],
  //     response: {
  //       200: {
  //         description: 'Remédio processado com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: {
  //             type: 'object',
  //             properties: {
  //               drugInfo: { type: 'object' },
  //               presentation: { type: 'string' }
  //             }
  //           },
  //           message: { type: 'string' }
  //         }
  //       },
  //       400: {
  //         description: 'Erro na requisição',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       404: {
  //         description: 'Remédio não encontrado',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         description: 'Erro interno',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendanceController.processDrugImage(request, reply);
  // });

  // // GET /api/attendances/search-product - Pesquisar produto e correlações
  // fastify.get<{
  //   Querystring: { productName: string }
  // }>('/api/attendances/search-product', {
  //   schema: {
  //     tags: ['Attendances'],
  //     summary: 'Pesquisar produto e suas correlações',
  //     description: 'Recebe o nome de um produto, busca suas características e produtos correlacionados',
  //     querystring: {
  //       type: 'object',
  //       properties: {
  //         productName: { type: 'string', description: 'Nome do produto a ser pesquisado' }
  //       },
  //       required: ['productName']
  //     },
  //     response: {
  //       200: {
  //         description: 'Produto e correlações encontrados com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: {
  //             type: 'object',
  //             properties: {
  //               product: {
  //                 type: 'object',
  //                 properties: {
  //                   name: { type: 'string' },
  //                   caracteristicasDoProduto: { type: 'string' },
  //                   produtosCorrelacionados: { type: 'string' },
  //                   textoDeVenda: { type: 'string' }
  //                 },
  //                 required: ['name', 'textoDeVenda']
  //               },
  //               analysis: { type: 'string' },
  //               availableProducts: { type: 'number' }
  //             },
  //             required: ['product']
  //           },
  //           message: { type: 'string' }
  //         }
  //       },
  //       400: {
  //         description: 'Erro na requisição',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       404: {
  //         description: 'Produto não encontrado',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         description: 'Erro interno',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendanceController.searchProductAndCorrelations(request, reply);
  // });
  
  // // PUT /api/attendances/:id - Atualizar atendimento
  // fastify.put('/api/attendances/:id', async (request, reply) => {
  //   await attendanceController.updateAttendance(request as any, reply);
  // });

  // // DELETE /api/attendances/:id - Deletar atendimento
  // fastify.delete('/api/attendances/:id', async (request, reply) => {
  //   await attendanceController.deleteAttendance(request as any, reply);
  // });

  // // PATCH /api/attendances/:id/start - Iniciar atendimento
  // fastify.patch('/api/attendances/:id/start', async (request, reply) => {
  //   await attendanceController.startAttendance(request as any, reply);
  // });

  // // PATCH /api/attendances/:id/complete - Finalizar atendimento
  // fastify.patch('/api/attendances/:id/complete', async (request, reply) => {
  //   await attendanceController.completeAttendance(request as any, reply);
  // });

  // // PATCH /api/attendances/:id/cancel - Cancelar atendimento
  // fastify.patch('/api/attendances/:id/cancel', async (request, reply) => {
  //   await attendanceController.cancelAttendance(request as any, reply);
  // });

  // // POST /api/attendances/query - Rota principal de conversa com o cliente
  // fastify.post('/api/attendances/query', {
  //   schema: {
  //     tags: ['Attendances'],
  //     summary: 'Rota principal de conversa com o cliente',
  //     description: 'Recebe uma mensagem do cliente e processa usando OpenAI para gerar resposta contextualizada',
  //     body: {
  //       type: 'object',
  //       properties: {
  //         query: { type: 'string', description: 'Mensagem/query do cliente' }
  //       },
  //       required: ['query']
  //     },
  //     response: {
  //       200: {
  //         description: 'Query processada com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           data: { type: 'object' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       400: {
  //         description: 'Erro na requisição',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       },
  //       500: {
  //         description: 'Erro interno',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           error: { type: 'string' },
  //           message: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await attendanceController.query(request as any, reply);
  // });
}

// Rota de health check
fastify.get('/health', {
  schema: {
    tags: ['Health'],
    summary: 'Health Check',
    description: 'Verifica se a API está funcionando corretamente',
    response: {
      200: {
        description: 'API funcionando',
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          timestamp: { type: 'string', format: 'date-time' },
          service: { type: 'string', example: 'Fastify Atendimento API' },
          version: { type: 'string', example: '1.0.0' }
        }
      }
    }
  }
}, async (request, reply) => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Fastify Atendimento API',
    version: '1.0.0'
  };
});

// Rota raiz
fastify.get('/', async (request, reply) => {
  return {
    message: 'Fastify Atendimento API',
    version: '1.0.0',
    documentation: '/documentation',
    endpoints: {
      health: '/health',
      drugs: {
        all: '/api/drugs',
        byId: '/api/drugs/:id',
        search: '/api/drugs/search?q=termo',
        byCategory: '/api/drugs/category/:category',
        active: '/api/drugs/active',
        stock: '/api/drugs/stock',
        expired: '/api/drugs/expired',
        expiring: '/api/drugs/expiring?days=30'
      },
      attendants: {
        all: '/api/attendants',
        byId: '/api/attendants/:id',
        byPharmacy: '/api/attendants/pharmacy/:pharmacyId',
        active: '/api/attendants/active',
        byVoice: '/api/attendants/voice/:voice',
        byProfile: '/api/attendants/profile/:profile',
        create: 'POST /api/attendants',
        update: 'PUT /api/attendants/:id',
        delete: 'DELETE /api/attendants/:id',
        activate: 'PATCH /api/attendants/:id/activate',
        deactivate: 'PATCH /api/attendants/:id/deactivate'
      },
      pharmacies: {
        all: '/api/pharmacies',
        byId: '/api/pharmacies/:id',
        byCNPJ: '/api/pharmacies/cnpj/:cnpj',
        active: '/api/pharmacies/active',
        byCity: '/api/pharmacies/city/:city',
        byState: '/api/pharmacies/state/:state',
        search: '/api/pharmacies/search?q=termo',
        create: 'POST /api/pharmacies',
        update: 'PUT /api/pharmacies/:id',
        delete: 'DELETE /api/pharmacies/:id',
        activate: 'PATCH /api/pharmacies/:id/activate',
        deactivate: 'PATCH /api/pharmacies/:id/deactivate'
      },
      attendances: {
        all: '/api/attendances',
        byId: '/api/attendances/:id',
        byPharmacy: '/api/attendances/pharmacy/:pharmacyId',
        byAttendant: '/api/attendances/attendant/:attendantId',
        byStatus: '/api/attendances/status/:status',
        byType: '/api/attendances/type/:type',
        pending: '/api/attendances/pending',
        active: '/api/attendances/active',
        completed: '/api/attendances/completed',
        byDateRange: '/api/attendances/date-range?startDate=2024-01-01&endDate=2024-12-31',
        processDrugImage: 'POST /api/attendances/process-drug-image',
        query: 'POST /api/attendances/query',
        create: 'POST /api/attendances',
        update: 'PUT /api/attendances/:id',
        delete: 'DELETE /api/attendances/:id',
        start: 'PATCH /api/attendances/:id/start',
        complete: 'PATCH /api/attendances/:id/complete',
        cancel: 'PATCH /api/attendances/:id/cancel'
      }
    }
  };
});

// Registrar rotas do Message Queue
async function registerMessageQueueRoutes() {
  // const messageQueueController = Container.get<MessageQueueController>(TYPES.MessageQueueController);

  // GET /api/message-queue/status - Status do sistema
  // fastify.get('/api/message-queue/status', {
  //   schema: {
  //     tags: ['Message Queue'],
  //     summary: 'Status do sistema de Message Queue',
  //     description: 'Retorna o status atual do sistema de Message Queue',
  //     response: {
  //       200: {
  //         description: 'Status do sistema',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           message: { type: 'string' },
  //           timestamp: { type: 'string' },
  //           queues: { type: 'object' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await messageQueueController.getStatus(request, reply);
  // });

  // // POST /api/message-queue/text - Enviar mensagem de texto
  // fastify.post('/api/message-queue/text', {
  //   schema: {
  //     tags: ['Message Queue'],
  //     summary: 'Enviar mensagem de texto',
  //     description: 'Envia uma mensagem de texto para processamento',
  //     body: {
  //       type: 'object',
  //       required: ['message', 'pharmacy_phone', 'consumer_phone'],
  //       properties: {
  //         message: { type: 'string' },
  //         pharmacy_phone: { type: 'string' },
  //         consumer_phone: { type: 'string' }
  //       }
  //     },
  //     response: {
  //       200: {
  //         description: 'Mensagem enviada com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           message: { type: 'string' },
  //           data: { type: 'object' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await messageQueueController.sendTextMessage(request, reply);
  // });

  // // POST /api/message-queue/image - Enviar mensagem de imagem
  // fastify.post('/api/message-queue/image', {
  //   schema: {
  //     tags: ['Message Queue'],
  //     summary: 'Enviar mensagem de imagem',
  //     description: 'Envia uma mensagem de imagem para processamento',
  //     body: {
  //       type: 'object',
  //       required: ['message', 'pharmacy_phone', 'consumer_phone'],
  //       properties: {
  //         message: { type: 'string' },
  //         pharmacy_phone: { type: 'string' },
  //         consumer_phone: { type: 'string' }
  //       }
  //     },
  //     response: {
  //       200: {
  //         description: 'Mensagem enviada com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           message: { type: 'string' },
  //           data: { type: 'object' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await messageQueueController.sendImageMessage(request, reply);
  // });

  // // POST /api/message-queue/audio - Enviar mensagem de áudio
  // fastify.post('/api/message-queue/audio', {
  //   schema: {
  //     tags: ['Message Queue'],
  //     summary: 'Enviar mensagem de áudio',
  //     description: 'Envia uma mensagem de áudio para processamento',
  //     body: {
  //       type: 'object',
  //       required: ['message', 'pharmacy_phone', 'consumer_phone'],
  //       properties: {
  //         message: { type: 'string' },
  //         pharmacy_phone: { type: 'string' },
  //         consumer_phone: { type: 'string' }
  //       }
  //     },
  //     response: {
  //       200: {
  //         description: 'Mensagem enviada com sucesso',
  //         type: 'object',
  //         properties: {
  //           success: { type: 'boolean' },
  //           message: { type: 'string' },
  //           data: { type: 'object' }
  //         }
  //       }
  //     }
  //   }
  // }, async (request, reply) => {
  //   await messageQueueController.sendAudioMessage(request, reply);
  // });
}

// cheio de roleffffff

// Inicializar servidor
async function start() {
  try {
    console.log('🚀 Iniciando Fastify Atendimento API...');
    
    // Inicializar banco de dados PostgreSQL
    console.log('🔍 Inicializando banco de dados...');
    await initializeDatabase();
    
    // Inicializar RabbitMQ
    // console.log('🐰 Inicializando RabbitMQ...');
    // const rabbitMQConnection = Container.get<RabbitMQConnection>(TYPES.RabbitMQConnection);
    // await rabbitMQConnection.connect();
    
    // Inicializar Message Queue Manager
    // console.log('📨 Inicializando Message Queue Manager...');
    // try {
    //   const messageQueueManager = Container.get<MessageQueueManager>(TYPES.MessageQueueManager);
    //   console.log('✅ MessageQueueManager obtido do container');
      
    //   console.log('🔄 Inicializando consumers...');
    //   await messageQueueManager.initializeConsumers();
    //   console.log('✅ Consumers inicializados');
      
    //   console.log('🔄 Inicializando producers...');
    //   await messageQueueManager.initializeProducers();
    //   console.log('✅ Producers inicializados');
    // } catch (error) {
    //   console.error('❌ Erro ao inicializar Message Queue Manager:', error);
    //   throw error;
    // }
    
    // Registrar CORS
    await fastify.register(cors, {
      origin: true
    });

    // Registrar Multipart para upload de arquivos
    await fastify.register(multipart);

    // Registrar Swagger
    await fastify.register(swagger, swaggerConfig);
    await fastify.register(swaggerUi, swaggerUiConfig);
    
    // Registrar rotas
    // await registerDrugsRoutes();
    // await registerAttendantRoutes();
    await registerPharmacyRoutes();
    // await registerAttendanceRoutes();
    // await registerMessageQueueRoutes();
    
    // Iniciar servidor
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📚 API Documentation disponível em http://localhost:${port}/documentation`);
    console.log(`💊 Drugs API disponível em http://localhost:${port}/api/drugs`);
    console.log(`👥 Attendants API disponível em http://localhost:${port}/api/attendants`);
    console.log(`🏥 Pharmacies API disponível em http://localhost:${port}/api/pharmacies`);
    console.log(`📞 Attendances API disponível em http://localhost:${port}/api/attendances`);
    console.log(`📨 Message Queue API disponível em http://localhost:${port}/api/message-queue`);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Recebido SIGINT, fechando servidor...');
      await closeDatabase();
      // await rabbitMQConnection.disconnect();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Recebido SIGTERM, fechando servidor...');
      await closeDatabase();
      // await rabbitMQConnection.disconnect();
      process.exit(0);
    });
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start(); 