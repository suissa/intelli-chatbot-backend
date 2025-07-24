import * as amqp from 'amqplib';
import { RabbitMQConfig } from '../rabbitmq.config';
import { MessageQueuePayload } from '../../../domain/entities/message-queue.entity';
import { IMessageConsumer } from '../../../domain/services/message-queue.service';

export class ConsumerImageMessage implements IMessageConsumer {
  private channel: amqp.Channel;

  constructor(channel: amqp.Channel) {
    this.channel = channel;
  }

  async consume(queueName: string, callback: (message: MessageQueuePayload) => Promise<void>): Promise<void> {
    try {
      console.log(`🖼️ Iniciando ConsumerImageMessage na queue: ${queueName}`);
      
      await this.channel.consume(queueName, async (msg) => {
        if (!msg) {
          console.log('❌ Mensagem nula recebida');
          return;
        }

        try {
          const messageContent = JSON.parse(msg.content.toString()) as MessageQueuePayload;
          console.log(`📨 Mensagem de imagem recebida:`, messageContent);

          // Processar mensagem de imagem
          await this.processImageMessage(messageContent);
          
          // Acknowledge da mensagem
          this.acknowledge(msg);
          
          // Executar callback se fornecido
          if (callback) {
            await callback(messageContent);
          }
        } catch (error) {
          console.error('❌ Erro ao processar mensagem de imagem:', error);
          this.reject(msg, false);
        }
      });

      console.log(`✅ ConsumerImageMessage iniciado com sucesso na queue: ${queueName}`);
    } catch (error) {
      console.error('❌ Erro ao iniciar ConsumerImageMessage:', error);
      throw error;
    }
  }

  private async processImageMessage(message: MessageQueuePayload): Promise<void> {
    try {
      console.log(`🔍 Processando mensagem de imagem:`);
      console.log(`   - Mensagem: ${message.message}`);
      console.log(`   - De: ${message.consumer_phone}`);
      console.log(`   - Para: ${message.pharmacy_phone}`);
      console.log(`   - Timestamp: ${message.timestamp}`);
      
      // Aqui você pode implementar a lógica específica para processar mensagens de imagem
      // Por exemplo: OCR, análise de imagem, extração de texto, etc.
      
      console.log(`✅ Mensagem de imagem processada com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem de imagem:', error);
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