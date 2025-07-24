import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { RabbitMQConnection } from './rabbitmq-connection';
import { ConsumerMessages } from './consumers/consumer-messages';
import { ConsumerTextMessage } from './consumers/consumer-text-message';
import { ConsumerImageMessage } from './consumers/consumer-image-message';
import { ConsumerAudioMessage } from './consumers/consumer-audio-message';
import { MessageProducer } from './producers/message-producer';
import { RabbitMQConfig } from './rabbitmq.config';
import { MessageQueuePayload, MessageType } from '../../domain/entities/message-queue.entity';
import { IMessageQueueManager } from '../../domain/services/message-queue.service';
import { MessageProcessorService } from '../../domain/services/message-processor.service';

@injectable()
export class MessageQueueManager implements IMessageQueueManager {
  private connection: RabbitMQConnection;
  private messageProcessor: MessageProcessorService;
  private producer!: MessageProducer;
  private consumerMessages!: ConsumerMessages;
  private consumerText!: ConsumerTextMessage;
  private consumerImage!: ConsumerImageMessage;
  private consumerAudio!: ConsumerAudioMessage;

  constructor(
    @inject(TYPES.RabbitMQConnection) connection: RabbitMQConnection,
    @inject(TYPES.MessageProcessorService) messageProcessor: MessageProcessorService
  ) {
    this.connection = connection;
    this.messageProcessor = messageProcessor;
    
    console.log('🔧 MessageQueueManager construído com sucesso');
  }

  async initializeConsumers(): Promise<void> {
    try {
      console.log('🚀 Inicializando todos os consumers...');
      console.log('🔍 Verificando connection antes de getChannel()');
      console.log('📊 connection existe:', !!this.connection);

      // Obter canal da conexão
      console.log('🔄 Chamando connection.getChannel()...');
      const channel = this.connection.getChannel();
      console.log('✅ Canal obtido:', !!channel);
      
      // Inicializar producer e consumers
      console.log('🔧 Criando producer...');
      this.producer = new MessageProducer(channel);
      console.log('🔧 Criando consumers...');
      this.consumerMessages = new ConsumerMessages(channel, this.producer);
      this.consumerText = new ConsumerTextMessage(channel, this.messageProcessor);
      this.consumerImage = new ConsumerImageMessage(channel);
      this.consumerAudio = new ConsumerAudioMessage(channel);
      
      console.log('🔧 Producers e consumers criados');

      // Criar todas as queues necessárias
      console.log('🔧 Criando queues...');
      
      await channel.assertQueue(RabbitMQConfig.queues.consumerMessages, { durable: true });
      console.log(`✅ Queue criada: ${RabbitMQConfig.queues.consumerMessages}`);
      
      await channel.assertQueue(RabbitMQConfig.queues.textMessages, { durable: true });
      console.log(`✅ Queue criada: ${RabbitMQConfig.queues.textMessages}`);
      
      await channel.assertQueue(RabbitMQConfig.queues.imageMessages, { durable: true });
      console.log(`✅ Queue criada: ${RabbitMQConfig.queues.imageMessages}`);
      
      await channel.assertQueue(RabbitMQConfig.queues.audioMessages, { durable: true });
      console.log(`✅ Queue criada: ${RabbitMQConfig.queues.audioMessages}`);

      // Inicializar consumer principal
      console.log('🔄 Inicializando ConsumerMessages...');
      await this.consumerMessages.consume(RabbitMQConfig.queues.consumerMessages, async (message) => {
        console.log('📨 Mensagem processada pelo ConsumerMessages');
      });
      console.log('✅ ConsumerMessages inicializado');

      // Inicializar consumers específicos
      console.log('🔄 Inicializando ConsumerText...');
      await this.consumerText.consume(RabbitMQConfig.queues.textMessages, async (message) => {
        console.log('📝 Mensagem de texto processada');
      });
      console.log('✅ ConsumerText inicializado');

      console.log('🔄 Inicializando ConsumerImage...');
      await this.consumerImage.consume(RabbitMQConfig.queues.imageMessages, async (message) => {
        console.log('🖼️ Mensagem de imagem processada');
      });
      console.log('✅ ConsumerImage inicializado');

      console.log('🔄 Inicializando ConsumerAudio...');
      await this.consumerAudio.consume(RabbitMQConfig.queues.audioMessages, async (message) => {
        console.log('🎵 Mensagem de áudio processada');
      });
      console.log('✅ ConsumerAudio inicializado');

      console.log('✅ Todos os consumers inicializados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao inicializar consumers:', error);
      throw error;
    }
  }

  async initializeProducers(): Promise<void> {
    try {
      console.log('🚀 Inicializando producers...');
      // O producer já está inicializado no construtor
      console.log('✅ Producers inicializados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao inicializar producers:', error);
      throw error;
    }
  }

  async routeMessage(message: MessageQueuePayload): Promise<void> {
    try {
      console.log('🔄 Roteando mensagem...');
      
      // Enviar mensagem para o consumer principal
      await this.producer.publish(RabbitMQConfig.queues.consumerMessages, message);
      
      console.log('✅ Mensagem roteada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao rotear mensagem:', error);
      throw error;
    }
  }

  async sendTextMessage(message: MessageQueuePayload): Promise<void> {
    try {
      message.type = MessageType.TEXT;
      await this.routeMessage(message);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de texto:', error);
      throw error;
    }
  }

  async sendImageMessage(message: MessageQueuePayload): Promise<void> {
    try {
      message.type = MessageType.IMAGE;
      await this.routeMessage(message);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de imagem:', error);
      throw error;
    }
  }

  async sendAudioMessage(message: MessageQueuePayload): Promise<void> {
    try {
      message.type = MessageType.AUDIO;
      await this.routeMessage(message);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de áudio:', error);
      throw error;
    }
  }
} 