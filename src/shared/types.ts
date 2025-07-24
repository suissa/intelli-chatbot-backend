// Types para InversifyJS
export const TYPES = {
  // Database
  DataSource: Symbol.for('DataSource'),
  
  // Repositories
  AtendenteRepository: Symbol.for('AtendenteRepository'),
  FarmaciaRepository: Symbol.for('FarmaciaRepository'),
  AtendimentoRepository: Symbol.for('AtendimentoRepository'),
  RemedioRepository: Symbol.for('RemedioRepository'),
  DrugsRepository: Symbol.for('DrugsRepository'),
  MessageQueueRepository: Symbol.for('MessageQueueRepository'),
  OutboxRepository: Symbol.for('OutboxRepository'),
  AttendantRepository: Symbol.for('AttendantRepository'),
  PharmacyRepository: Symbol.for('PharmacyRepository'),
  AttendanceRepository: Symbol.for('AttendanceRepository'),
  
  // Services
  AtendenteService: Symbol.for('AtendenteService'),
  FarmaciaService: Symbol.for('FarmaciaService'),
  AtendimentoService: Symbol.for('AtendimentoService'),
  RemedioService: Symbol.for('RemedioService'),
  MessageQueueService: Symbol.for('MessageQueueService'),
  OutboxService: Symbol.for('OutboxService'),
  IAAtendimentoService: Symbol.for('IAAtendimentoService'),
  OpenAIService: Symbol.for('OpenAIService'),
  DrugImageProcessorService: Symbol.for('DrugImageProcessorService'),
  TextProcessorService: Symbol.for('TextProcessorService'),
  OCRService: Symbol.for('OCRService'),
  MessageProcessorService: Symbol.for('MessageProcessorService'),
  
  // Controllers
  AtendenteController: Symbol.for('AtendenteController'),
  FarmaciaController: Symbol.for('FarmaciaController'),
  AtendimentoController: Symbol.for('AtendimentoController'),
  RemedioController: Symbol.for('RemedioController'),
  DrugsController: Symbol.for('DrugsController'),
  MessageQueueController: Symbol.for('MessageQueueController'),
  OutboxController: Symbol.for('OutboxController'),
  AttendantController: Symbol.for('AttendantController'),
  PharmacyController: Symbol.for('PharmacyController'),
  AttendanceController: Symbol.for('AttendanceController'),
  
  // Infrastructure
  RabbitMQConnection: Symbol.for('RabbitMQConnection'),
  MessageQueueProducer: Symbol.for('MessageQueueProducer'),
  MessageQueueConsumer: Symbol.for('MessageQueueConsumer'),
  MessageQueueManager: Symbol.for('MessageQueueManager'),
  
  // Utils
  Logger: Symbol.for('Logger'),
  Validator: Symbol.for('Validator'),
  
  // Config
  Environment: Symbol.for('Environment'),
} as const; 