import { FastifyRequest, FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { IAttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { DrugImageProcessorService } from '../../domain/services/drug-image-processor.service';
import { TextProcessorService } from '../../domain/services/text-processor.service';
import { TipoAtendimento, StatusAtendimento } from '../../domain/entities';
import path from 'path';
import fs from 'fs';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { OpenAIService } from '../../domain/services/openai.service';

export interface AttendanceController {
  getAllAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAttendanceById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  getAttendancesByPharmacy(request: FastifyRequest<{ Params: { pharmacyId: string } }>, reply: FastifyReply): Promise<void>;
  getAttendancesByAttendant(request: FastifyRequest<{ Params: { attendantId: string } }>, reply: FastifyReply): Promise<void>;
  getAttendancesByStatus(request: FastifyRequest<{ Params: { status: string } }>, reply: FastifyReply): Promise<void>;
  getAttendancesByType(request: FastifyRequest<{ Params: { type: string } }>, reply: FastifyReply): Promise<void>;
  getPendingAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getActiveAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getCompletedAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAttendancesByDateRange(request: FastifyRequest<{ Querystring: { startDate: string; endDate: string } }>, reply: FastifyReply): Promise<void>;
  createAttendance(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  deleteAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  startAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  completeAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  cancelAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  processDrugImage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  searchProductAndCorrelations(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

@injectable()
export class AttendanceControllerImpl implements AttendanceController {
  constructor(
    @inject(TYPES.AttendanceRepository) private attendanceRepository: IAttendanceRepository,
    @inject(TYPES.DrugImageProcessorService) private drugImageProcessorService: DrugImageProcessorService,
    @inject(TYPES.TextProcessorService) private textProcessorService: TextProcessorService,
    @inject(TYPES.DrugsRepository) private drugsRepository: DrugsRepository,
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService
  ) {}

  async getAllAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendances = await this.attendanceRepository.getAllAttendances();
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        message: 'Attendances retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching all attendances:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendances'
      });
    }
  }

  async getAttendanceById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const attendance = await this.attendanceRepository.getAttendanceById(id);
      
      if (!attendance) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: attendance,
        message: 'Attendance found successfully'
      });
    } catch (error) {
      console.error('Error fetching attendance by ID:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendance'
      });
    }
  }

  async getAttendancesByPharmacy(request: FastifyRequest<{ Params: { pharmacyId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { pharmacyId } = request.params;
      const attendances = await this.attendanceRepository.getAttendancesByPharmacy(pharmacyId);
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        pharmacyId,
        message: `Found ${attendances.length} attendances for pharmacy ${pharmacyId}`
      });
    } catch (error) {
      console.error('Error fetching attendances by pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacy attendances'
      });
    }
  }

  async getAttendancesByAttendant(request: FastifyRequest<{ Params: { attendantId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { attendantId } = request.params;
      const attendances = await this.attendanceRepository.getAttendancesByAttendant(attendantId);
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        attendantId,
        message: `Found ${attendances.length} attendances for attendant ${attendantId}`
      });
    } catch (error) {
      console.error('Error fetching attendances by attendant:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendant attendances'
      });
    }
  }

  async getAttendancesByStatus(request: FastifyRequest<{ Params: { status: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { status } = request.params;
      
      if (!Object.values(StatusAtendimento).includes(status as StatusAtendimento)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid status',
          message: 'Status must be one of: pendente, em_andamento, finalizado, cancelado'
        });
        return;
      }

      const attendances = await this.attendanceRepository.getAttendancesByStatus(status as StatusAtendimento);
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        status,
        message: `Found ${attendances.length} attendances with status ${status}`
      });
    } catch (error) {
      console.error('Error fetching attendances by status:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendances by status'
      });
    }
  }

  async getAttendancesByType(request: FastifyRequest<{ Params: { type: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { type } = request.params;
      
      if (!Object.values(TipoAtendimento).includes(type as TipoAtendimento)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid type',
          message: 'Type must be one of: ia, humano'
        });
        return;
      }

      const attendances = await this.attendanceRepository.getAttendancesByType(type as TipoAtendimento);
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        type,
        message: `Found ${attendances.length} attendances with type ${type}`
      });
    } catch (error) {
      console.error('Error fetching attendances by type:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendances by type'
      });
    }
  }

  async getPendingAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendances = await this.attendanceRepository.getPendingAttendances();
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        message: 'Pending attendances retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching pending attendances:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pending attendances'
      });
    }
  }

  async getActiveAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendances = await this.attendanceRepository.getActiveAttendances();
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        message: 'Active attendances retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active attendances:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch active attendances'
      });
    }
  }

  async getCompletedAttendances(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendances = await this.attendanceRepository.getCompletedAttendances();
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        message: 'Completed attendances retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching completed attendances:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch completed attendances'
      });
    }
  }

  async getAttendancesByDateRange(request: FastifyRequest<{ Querystring: { startDate: string; endDate: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { startDate, endDate } = request.query;
      
      if (!startDate || !endDate) {
        reply.status(400).send({
          success: false,
          error: 'Date range required',
          message: 'Please provide both startDate and endDate'
        });
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        reply.status(400).send({
          success: false,
          error: 'Invalid date format',
          message: 'Please provide valid dates in ISO format'
        });
        return;
      }

      const attendances = await this.attendanceRepository.getAttendancesByDateRange(start, end);
      
      reply.send({
        success: true,
        data: attendances,
        count: attendances.length,
        startDate,
        endDate,
        message: `Found ${attendances.length} attendances between ${startDate} and ${endDate}`
      });
    } catch (error) {
      console.error('Error fetching attendances by date range:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch attendances by date range'
      });
    }
  }

  async createAttendance(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const attendanceData = request.body as any;
      
      console.log('📝 Criando novo atendimento...');
      console.log('📋 Dados do atendimento:', attendanceData);
      
      // Criar o atendimento primeiro
      const attendance = await this.attendanceRepository.createAttendance(attendanceData);
      
      // Verificar se há pergunta ou resposta para processar
      const textToProcess = attendanceData.pergunta || attendanceData.resposta || '';
      
      if (textToProcess && textToProcess.trim().length > 0) {
        console.log('🔍 Processando texto para identificar remédios...');
        
        // Processar texto para extrair informações de remédios
        const drugResult = await this.textProcessorService.extractDrugFromText(textToProcess);
        
        if (drugResult.success && drugResult.drugInfo) {
          console.log('💊 Remédio identificado no atendimento:', drugResult.drugInfo.nome);
          
          // Atualizar o atendimento com as informações do remédio
          const updatedAttendance = await this.attendanceRepository.updateAttendance(attendance.id, {
            resposta: `${textToProcess}\n\n💊 Remédio identificado: ${drugResult.drugInfo.nome}\n\n${drugResult.presentation}`,
            remedios_encontrados: [drugResult.drugInfo]
          });
          
          reply.status(201).send({
            success: true,
            data: {
              attendance: updatedAttendance,
              drugInfo: drugResult.drugInfo,
              presentation: drugResult.presentation
            },
            message: 'Attendance created successfully with drug information'
          });
          return;
        } else {
          console.log('❌ Nenhum remédio identificado na descrição');
        }
      }
      
      reply.status(201).send({
        success: true,
        data: attendance,
        message: 'Attendance created successfully'
      });
    } catch (error) {
      console.error('Error creating attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create attendance'
      });
    }
  }

  async updateAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const updates = request.body as any;
      
      const attendance = await this.attendanceRepository.updateAttendance(id, updates);
      
      if (!attendance) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: attendance,
        message: 'Attendance updated successfully'
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update attendance'
      });
    }
  }

  async deleteAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const deleted = await this.attendanceRepository.deleteAttendance(id);
      
      if (!deleted) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendance deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete attendance'
      });
    }
  }

  async startAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const started = await this.attendanceRepository.startAttendance(id);
      
      if (!started) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendance started successfully'
      });
    } catch (error) {
      console.error('Error starting attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to start attendance'
      });
    }
  }

  async completeAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const { response } = request.body as any;
      const completed = await this.attendanceRepository.completeAttendance(id, response);
      
      if (!completed) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendance completed successfully'
      });
    } catch (error) {
      console.error('Error completing attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to complete attendance'
      });
    }
  }

  async cancelAttendance(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const canceled = await this.attendanceRepository.cancelAttendance(id);
      
      if (!canceled) {
        reply.status(404).send({
          success: false,
          error: 'Attendance not found',
          message: `Attendance with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Attendance canceled successfully'
      });
    } catch (error) {
      console.error('Error canceling attendance:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to cancel attendance'
      });
    }
  }
  async setCorrelatedProducts(
    remedioName: string,
    rawText: string
  ): Promise<void> {
    // 1) Quebra por linha e limpa
    const linhas = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => !!l);

      const correlacionados = linhas.map(item => {
        // a) Divide em [nomeMarkdown, preçoBr, categoriaBr]
        const partes = item.split(' - ').map(p => p.trim());
    
        if (partes.length < 1) {
          return null;
        }
        // b) Nome: remove os ** do Markdown
        const name = partes[0]?.replace(/\*\*[0-9]+\.\s*/g, '');
    
        // c) Preço: "R$ 12,00" → "12.00"
        const precoBr = partes[1] ?? ''; // ex: "R$ 12,00"
        const numeroOnly = precoBr
          .replace(/[^0-9,\.]/g, '')    // tira "R$", espaços etc → "12,00"
          .replace(/\./g, '')           // remove possíveis separadores de milhar
          .replace(',', '.');           // vírgula → ponto
        const price = parseFloat(numeroOnly) || 0;
    
        // d) Categoria: terceira parte ou valor original
        const category = partes[2] ?? 'indefinida';
    
        return { name, category, price };
      });
      console.log('🔍 Correlacionados:', correlacionados);
      const correlacionadosFiltrados = correlacionados.filter(item => item !== null);
      console.log('🔍 Correlacionados Filtrados:', correlacionadosFiltrados);
    // preciso buscar o id do produto no banco de dados
    //preciso de uma função getDrugByName
    console.log('🔍 Remédio Name:', remedioName);
    const produtos = await this.drugsRepository.getDrugByName(remedioName);
    console.log('🔍 Produtos:', produtos);
    if (produtos.length === 0) {
      throw new Error('Produto não encontrado');
    }
    await this.drugsRepository.updateCorrelatedProducts(produtos, correlacionadosFiltrados as any);

  }
  async searchProductAndCorrelations(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productName } = request.query as any;
      
      if (!productName || productName.trim().length < 2) {
        reply.status(400).send({
          success: false,
          error: 'Nome do produto é obrigatório e deve ter pelo menos 2 caracteres',
          message: 'Please provide a valid product name'
        });
        return;
      }

      console.log('🔍 Pesquisando produto e correlações:', productName);


      // 2. Gerar análise com OpenAI usando apenas o produto encontrado
      const analysis = await this.openaiService.searchProductAndCorrelations(productName);
      console.log('🔍 Análise:', analysis); 
      // const textoDeVenda = analysis.textoDeVenda;
      console.log('✅ Análise de produto e correlações gerada com sucesso');

      console.log('🔍 Características do produto:', analysis.caracteristicasDoProduto);
      console.log('🔍 Produtos correlacionados:', analysis.produtosCorrelacionados);
      console.log('🔍 Texto de venda:', analysis.textoDeVenda);

      await this.setCorrelatedProducts(productName, analysis.produtosCorrelacionados);
      const analysisParsed = JSON.parse(JSON.stringify(analysis));  
      console.log('🔍IMPORTANTE analysis:', analysisParsed);

      const product = {
        name: productName,
        caracteristicasDoProduto: analysis.caracteristicasDoProduto,
        produtosCorrelacionados: analysis.produtosCorrelacionados,
        textoDeVenda: analysis.textoDeVenda
      };
      console.log('🔑 product literal:', product);
      reply.send({
        success: true,
        data: {
          "product": {
            "name": product.name,
            "caracteristicasDoProduto": product.caracteristicasDoProduto,
            "produtosCorrelacionados": product.produtosCorrelacionados,
            "textoDeVenda": product.textoDeVenda
          }
        },
        analysis: product.textoDeVenda,
        message: 'Product analysis and correlations generated successfully'
      });

    } catch (error) {
      console.error('❌ Erro ao pesquisar produto e correlações:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    }
  }

  async processDrugImage(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      console.log('📸 Processando imagem de remédio...');
      
      // Verificar se há arquivo enviado
      const data = await request.file();
      
      if (!data) {
        reply.status(400).send({
          success: false,
          error: 'No image file provided',
          message: 'Please upload an image file'
        });
        return;
      }

      // Verificar tipo de arquivo
      if (!data.mimetype.startsWith('image/')) {
        reply.status(400).send({
          success: false,
          error: 'Invalid file type',
          message: 'Please upload an image file (JPEG, PNG, etc.)'
        });
        return;
      }

      // Ler o buffer da imagem diretamente
      const chunks: Buffer[] = [];
      for await (const chunk of data.file) {
        chunks.push(chunk);
      }
      const imageBuffer = Buffer.concat(chunks);

      console.log('💾 Imagem carregada em buffer:', imageBuffer.length, 'bytes');

      // Processar imagem diretamente do buffer
      const result = await this.drugImageProcessorService.processDrugImageBuffer(imageBuffer);

      if (!result.success) {
        reply.status(404).send({
          success: false,
          error: 'Drug not found',
          message: result.error || 'No drug found in the image'
        });
        return;
      }

      reply.send({
        success: true,
        data: {
          drugInfo: result.drugInfo,
          presentation: result.presentation
        },
        message: 'Drug image processed successfully'
      });

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    }
  }
} 