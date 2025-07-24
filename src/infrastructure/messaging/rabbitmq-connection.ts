
import { connect } from 'amqplib';
import { RabbitMQConfig } from './rabbitmq.config';
import { IMessageQueueService } from '../../domain/services/message-queue.service';

export class RabbitMQConnection implements IMessageQueueService {
  private _connection: any = null;
  private _channel: any = null;

  async connect(): Promise<void> {
    try {
      console.log('🔄 Conectando ao RabbitMQ...');
      console.log('📋 URL do RabbitMQ:', RabbitMQConfig.url);
      
      this._connection = await connect(RabbitMQConfig.url);
      console.log('✅ Conexão estabelecida:', !!this._connection);
      
      this._channel = await this._connection.createChannel();
      console.log('✅ Canal criado:', !!this._channel);
      console.log('🔌 Conexão e canal RabbitMQ estabelecidos');
      
      // Configurar exchanges e queues
      await this.setupQueues();
      
      console.log('✅ Conectado ao RabbitMQ com sucesso!');
      console.log('📊 Status final - Connection:', !!this._connection, 'Channel:', !!this._channel);
    } catch (error) {
      console.error('❌ Erro ao conectar ao RabbitMQ:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this._channel) {
        await this._channel.close();
      }
      if (this._connection) {
        await this._connection.close();
      }
      console.log('🔌 Desconectado do RabbitMQ');
    } catch (error) {
      console.error('❌ Erro ao desconectar do RabbitMQ:', error);
      throw error;
    }
  }

  private async setupQueues(): Promise<void> {
    if (!this._channel) {
      throw new Error('Canal não inicializado');
    }

    // Deletar exchange existente se houver (para evitar conflito de tipo)
    try {
      await this._channel.deleteExchange(RabbitMQConfig.exchanges.messageRouter);
      console.log('🗑️ Exchange anterior deletado:', RabbitMQConfig.exchanges.messageRouter);
    } catch (error) {
      console.log('ℹ️ Exchange não existia, criando novo...');
    }

    // Criar Topic Exchange para roteamento inteligente
    await this._channel.assertExchange(RabbitMQConfig.exchanges.messageRouter, 'topic', { durable: true });
    console.log('📋 Topic Exchange criado:', RabbitMQConfig.exchanges.messageRouter);

    // Criar queue principal para receber todas as mensagens
    await this._channel.assertQueue(RabbitMQConfig.queues.consumerMessages, { durable: true });
    console.log('📋 Queue principal criada:', RabbitMQConfig.queues.consumerMessages);

    // Criar queues específicas para cada tipo de mensagem
    await this._channel.assertQueue(RabbitMQConfig.queues.textMessages, { durable: true });
    await this._channel.assertQueue(RabbitMQConfig.queues.imageMessages, { durable: true });
    await this._channel.assertQueue(RabbitMQConfig.queues.audioMessages, { durable: true });
    console.log('📋 Queues específicas criadas');

    // Criar queues de resposta para farmácias (dinâmicas)
    // Estas serão criadas sob demanda quando necessário
    console.log('📋 Queues de resposta para farmácias serão criadas dinamicamente');

    // Configurar bindings com routing keys baseadas no tipo
    await this._channel.bindQueue(RabbitMQConfig.queues.textMessages, RabbitMQConfig.exchanges.messageRouter, 'message.text');
    await this._channel.bindQueue(RabbitMQConfig.queues.imageMessages, RabbitMQConfig.exchanges.messageRouter, 'message.image');
    await this._channel.bindQueue(RabbitMQConfig.queues.audioMessages, RabbitMQConfig.exchanges.messageRouter, 'message.audio');
    console.log('📋 Bindings configurados com routing keys');

    console.log('📋 Queues e Topic Exchange configurados com sucesso!');
  }

  getChannel(): any {
    console.log('🔍 getChannel() chamado');
    console.log('📊 _channel existe:', !!this._channel);
    console.log('📊 _connection existe:', !!this._connection);
    
    if (!this._channel) {
      console.error('❌ Canal não inicializado - _channel é null/undefined');
      throw new Error('Canal não inicializado');
    }
    
    console.log('✅ Canal retornado com sucesso');
    return this._channel;
  }

  getConnection(): any {
    if (!this._connection) {
      throw new Error('Conexão não inicializada');
    }
    return this._connection;
  }
} 