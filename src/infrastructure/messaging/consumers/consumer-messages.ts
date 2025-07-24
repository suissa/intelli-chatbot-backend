import * as amqp from 'amqplib';
import { RabbitMQConfig } from '../rabbitmq.config';
import { MessageQueuePayload, MessageType } from '../../../domain/entities/message-queue.entity';
import { IMessageConsumer, IMessageProducer } from '../../../domain/services/message-queue.service';

export class ConsumerMessages implements IMessageConsumer {
  private channel: amqp.Channel;
  private producer: IMessageProducer;

  constructor(channel: amqp.Channel, producer: IMessageProducer) {
    this.channel = channel;
    this.producer = producer;
  }

  async consume(queueName: string, callback: (message: MessageQueuePayload) => Promise<void>): Promise<void> {
    try {
      console.log(`🎧 Iniciando ConsumerMessages na queue: ${queueName}`);
      
      await this.channel.consume(queueName, async (msg) => {
        if (!msg) {
          console.log('❌ Mensagem nula recebida');
          return;
        }

        try {
          const messageContent = JSON.parse(msg.content.toString()) as MessageQueuePayload;
          console.log(`📨 Mensagem recebida:`, messageContent);

          // Publicar no Topic Exchange com routing key baseada no tipo
          await this.publishToTopicExchange(messageContent);
          
          // Acknowledge da mensagem
          this.acknowledge(msg);
          
          // Executar callback se fornecido
          if (callback) {
            await callback(messageContent);
          }
        } catch (error) {
          console.error('❌ Erro ao processar mensagem:', error);
          this.reject(msg, false);
        }
      });

      console.log(`✅ ConsumerMessages iniciado com sucesso na queue: ${queueName}`);
    } catch (error) {
      console.error('❌ Erro ao iniciar ConsumerMessages:', error);
      throw error;
    }
  }

  private async publishToTopicExchange(message: MessageQueuePayload): Promise<void> {
    try {
      const { type } = message;
      
      // Criar routing key baseada no tipo da mensagem
      const routingKey = `message.${type}`;
      
      // Publicar no Topic Exchange
      await this.producer.publishToExchange(
        RabbitMQConfig.exchanges.messageRouter,
        routingKey,
        message
      );
      
      console.log(`📤 Mensagem publicada no Topic Exchange com routing key: ${routingKey}`);
    } catch (error) {
      console.error('❌ Erro ao publicar no Topic Exchange:', error);
      throw error;
    }
  }

  acknowledge(message: amqp.Message): void {
    this.channel.ack(message);
  }

  reject(message: amqp.Message, requeue: boolean = false): void {
    this.channel.nack(message, false, requeue);
  }
} 