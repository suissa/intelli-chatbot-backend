"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceControllerImpl = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../shared/types");
const entities_1 = require("../../domain/entities");
const drugs_repository_1 = require("../../infrastructure/repositories/drugs.repository");
const openai_service_1 = require("../../domain/services/openai.service");
const message_processor_service_1 = require("../../domain/services/message-processor.service");
let AttendanceControllerImpl = class AttendanceControllerImpl {
    constructor(attendanceRepository, drugImageProcessorService, textProcessorService, drugsRepository, openaiService, messageProcessorService) {
        this.attendanceRepository = attendanceRepository;
        this.drugImageProcessorService = drugImageProcessorService;
        this.textProcessorService = textProcessorService;
        this.drugsRepository = drugsRepository;
        this.openaiService = openaiService;
        this.messageProcessorService = messageProcessorService;
    }
    async getAllAttendances(request, reply) {
        try {
            const attendances = await this.attendanceRepository.getAllAttendances();
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                message: 'Attendances retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching all attendances:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendances'
            });
        }
    }
    async getAttendanceById(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendance by ID:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendance'
            });
        }
    }
    async getAttendancesByPharmacy(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendances by pharmacy:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pharmacy attendances'
            });
        }
    }
    async getAttendancesByAttendant(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendances by attendant:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendant attendances'
            });
        }
    }
    async getAttendancesByStatus(request, reply) {
        try {
            const { status } = request.params;
            if (!Object.values(entities_1.StatusAtendimento).includes(status)) {
                reply.status(400).send({
                    success: false,
                    error: 'Invalid status',
                    message: 'Status must be one of: pendente, em_andamento, finalizado, cancelado'
                });
                return;
            }
            const attendances = await this.attendanceRepository.getAttendancesByStatus(status);
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                status,
                message: `Found ${attendances.length} attendances with status ${status}`
            });
        }
        catch (error) {
            console.error('Error fetching attendances by status:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendances by status'
            });
        }
    }
    async getAttendancesByType(request, reply) {
        try {
            const { type } = request.params;
            if (!Object.values(entities_1.TipoAtendimento).includes(type)) {
                reply.status(400).send({
                    success: false,
                    error: 'Invalid type',
                    message: 'Type must be one of: ia, humano'
                });
                return;
            }
            const attendances = await this.attendanceRepository.getAttendancesByType(type);
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                type,
                message: `Found ${attendances.length} attendances with type ${type}`
            });
        }
        catch (error) {
            console.error('Error fetching attendances by type:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendances by type'
            });
        }
    }
    async getPendingAttendances(request, reply) {
        try {
            const attendances = await this.attendanceRepository.getPendingAttendances();
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                message: 'Pending attendances retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching pending attendances:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch pending attendances'
            });
        }
    }
    async getActiveAttendances(request, reply) {
        try {
            const attendances = await this.attendanceRepository.getActiveAttendances();
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                message: 'Active attendances retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching active attendances:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch active attendances'
            });
        }
    }
    async getCompletedAttendances(request, reply) {
        try {
            const attendances = await this.attendanceRepository.getCompletedAttendances();
            reply.send({
                success: true,
                data: attendances,
                count: attendances.length,
                message: 'Completed attendances retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error fetching completed attendances:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch completed attendances'
            });
        }
    }
    async getAttendancesByDateRange(request, reply) {
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
        }
        catch (error) {
            console.error('Error fetching attendances by date range:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch attendances by date range'
            });
        }
    }
    async createAttendance(request, reply) {
        try {
            const attendanceData = request.body;
            console.log('📝 Criando novo atendimento...');
            console.log('📋 Dados do atendimento:', attendanceData);
            const attendance = await this.attendanceRepository.createAttendance(attendanceData);
            const textToProcess = attendanceData.pergunta || attendanceData.resposta || '';
            if (textToProcess && textToProcess.trim().length > 0) {
                console.log('🔍 Processando texto para identificar remédios...');
                const drugResult = await this.textProcessorService.extractDrugFromText(textToProcess);
                if (drugResult.success && drugResult.drugInfo) {
                    console.log('💊 Remédio identificado no atendimento:', drugResult.drugInfo.nome);
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
                }
                else {
                    console.log('❌ Nenhum remédio identificado na descrição');
                }
            }
            reply.status(201).send({
                success: true,
                data: attendance,
                message: 'Attendance created successfully'
            });
        }
        catch (error) {
            console.error('Error creating attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to create attendance'
            });
        }
    }
    async updateAttendance(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;
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
        }
        catch (error) {
            console.error('Error updating attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update attendance'
            });
        }
    }
    async deleteAttendance(request, reply) {
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
        }
        catch (error) {
            console.error('Error deleting attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete attendance'
            });
        }
    }
    async startAttendance(request, reply) {
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
        }
        catch (error) {
            console.error('Error starting attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to start attendance'
            });
        }
    }
    async completeAttendance(request, reply) {
        try {
            const { id } = request.params;
            const { response } = request.body;
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
        }
        catch (error) {
            console.error('Error completing attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to complete attendance'
            });
        }
    }
    async cancelAttendance(request, reply) {
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
        }
        catch (error) {
            console.error('Error canceling attendance:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: 'Failed to cancel attendance'
            });
        }
    }
    async setCorrelatedProducts(remedioName, rawText) {
        const linhas = rawText
            .split('\n')
            .map(l => l.trim())
            .filter(l => !!l);
        const correlacionados = linhas.map(item => {
            const partes = item.split(' - ').map(p => p.trim());
            if (partes.length < 1) {
                return null;
            }
            const name = partes[0]?.replace(/\*\*[0-9]+\.\s*/g, '');
            const precoBr = partes[1] ?? '';
            const numeroOnly = precoBr
                .replace(/[^0-9,\.]/g, '')
                .replace(/\./g, '')
                .replace(',', '.');
            const price = parseFloat(numeroOnly) || 0;
            const category = partes[2] ?? 'indefinida';
            return { name, category, price };
        });
        console.log('🔍 Correlacionados:', correlacionados);
        const correlacionadosFiltrados = correlacionados.filter(item => item !== null);
        console.log('🔍 Correlacionados Filtrados:', correlacionadosFiltrados);
        console.log('🔍 Remédio Name:', remedioName);
        const produtos = await this.drugsRepository.getDrugByName(remedioName);
        console.log('🔍 Produtos:', produtos);
        if (produtos.length === 0) {
            throw new Error('Produto não encontrado');
        }
        await this.drugsRepository.updateCorrelatedProducts(produtos, correlacionadosFiltrados);
    }
    async searchProductAndCorrelations(request, reply) {
        try {
            const { productName } = request.query;
            if (!productName || productName.trim().length < 2) {
                reply.status(400).send({
                    success: false,
                    error: 'Nome do produto é obrigatório e deve ter pelo menos 2 caracteres',
                    message: 'Please provide a valid product name'
                });
                return;
            }
            console.log('🔍 Pesquisando produto e correlações:', productName);
            const productAnalysis = await this.messageProcessorService.searchProductAndCorrelations(productName);
            reply.send({
                success: true,
                data: {
                    "product": {
                        "name": productAnalysis.name,
                        "caracteristicasDoProduto": productAnalysis.caracteristicasDoProduto,
                        "produtosCorrelacionados": productAnalysis.produtosCorrelacionados,
                        "textoDeVenda": productAnalysis.textoDeVenda
                    }
                },
                analysis: productAnalysis.textoDeVenda,
                message: 'Product analysis and correlations generated successfully'
            });
        }
        catch (error) {
            console.error('❌ Erro ao pesquisar produto e correlações:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }
    async processDrugImage(request, reply) {
        try {
            console.log('📸 Processando imagem de remédio...');
            const data = await request.file();
            if (!data) {
                reply.status(400).send({
                    success: false,
                    error: 'No image file provided',
                    message: 'Please upload an image file'
                });
                return;
            }
            if (!data.mimetype.startsWith('image/')) {
                reply.status(400).send({
                    success: false,
                    error: 'Invalid file type',
                    message: 'Please upload an image file (JPEG, PNG, etc.)'
                });
                return;
            }
            const chunks = [];
            for await (const chunk of data.file) {
                chunks.push(chunk);
            }
            const imageBuffer = Buffer.concat(chunks);
            console.log('💾 Imagem carregada em buffer:', imageBuffer.length, 'bytes');
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
        }
        catch (error) {
            console.error('❌ Erro ao processar imagem:', error);
            reply.status(500).send({
                success: false,
                error: 'Internal server error',
                message: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }
};
exports.AttendanceControllerImpl = AttendanceControllerImpl;
exports.AttendanceControllerImpl = AttendanceControllerImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AttendanceRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DrugImageProcessorService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.TextProcessorService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.DrugsRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.OpenAIService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.MessageProcessorService)),
    __metadata("design:paramtypes", [Object, Object, Object, drugs_repository_1.DrugsRepository,
        openai_service_1.OpenAIService,
        message_processor_service_1.MessageProcessorService])
], AttendanceControllerImpl);
//# sourceMappingURL=attendance.controller.js.map