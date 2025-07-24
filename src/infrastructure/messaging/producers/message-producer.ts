import * as amqp from 'amqplib';
import { RabbitMQConfig } from '../rabbitmq.config';
import { MessageQueuePayload } from '../../../domain/entities/message-queue.entity';
import { IMessageProducer } from '../../../domain/services/message-queue.service';

export class MessageProducer implements IMessageProducer {
  private channel: amqp.Channel;

  constructor(channel: amqp.Channel) {
    this.channel = channel;
  }

  async publish(queueName: string, message: MessageQueuePayload): Promise<void> {
    try {
      console.log(`📤 Publicando mensagem na queue: ${queueName}`);
      console.log(`📨 Conteúdo da mensagem:`, message);

      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      const success = this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });

      if (success) {
        console.log(`✅ Mensagem publicada com sucesso na queue: ${queueName}`);
      } else {
        throw new Error(`Falha ao publicar mensagem na queue: ${queueName}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao publicar mensagem na queue ${queueName}:`, error);
      throw error;
    }
  }

  async publishToExchange(exchangeName: string, routingKey: string, message: MessageQueuePayload): Promise<void> {
    try {
      console.log(`📤 Publicando mensagem no exchange: ${exchangeName} com routing key: ${routingKey}`);
      console.log(`📨 Conteúdo da mensagem:`, message);

      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      const success = this.channel.publish(exchangeName, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });

      if (success) {
        console.log(`✅ Mensagem publicada com sucesso no exchange: ${exchangeName}`);
      } else {
        throw new Error(`Falha ao publicar mensagem no exchange: ${exchangeName}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao publicar mensagem no exchange ${exchangeName}:`, error);
      throw error;
    }
  }
} 