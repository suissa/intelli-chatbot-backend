import * as amqp from 'amqplib';
import { MessageQueuePayload } from '../../../domain/entities/message-queue.entity';

export interface PharmacyResponse {
  success: boolean;
  message: string;
  data: any;
  originalMessage: MessageQueuePayload;
  timestamp: string;
}

export class PharmacyResponseProducer {
  private channel: amqp.Channel;

  constructor(channel: amqp.Channel) {
    this.channel = channel;
  }

  async sendResponseToPharmacy(pharmacyPhone: string, response: PharmacyResponse): Promise<void> {
    try {
      const queueName = `pharmacy:${pharmacyPhone}:text`;
      
      console.log(`📤 Enviando resposta para farmácia: ${queueName}`);
      console.log(`📨 Conteúdo da resposta:`, response);

      // Criar queue se não existir
      await this.channel.assertQueue(queueName, { durable: true });
      console.log(`✅ Queue criada/verificada: ${queueName}`);

      const messageBuffer = Buffer.from(JSON.stringify(response));
      
      const success = this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });

      if (success) {
        console.log(`✅ Resposta enviada com sucesso para: ${queueName}`);
      } else {
        throw new Error(`Falha ao enviar resposta para: ${queueName}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao enviar resposta para farmácia ${pharmacyPhone}:`, error);
      throw error;
    }
  }

  async sendProductAnalysisToPharmacy(
    pharmacyPhone: string, 
    originalMessage: MessageQueuePayload, 
    productAnalysis: any
  ): Promise<void> {
    const response: PharmacyResponse = {
      success: true,
      message: 'Análise de produto e correlações gerada com sucesso',
      data: {
        product: productAnalysis,
        originalRequest: {
          message: originalMessage.message,
          consumerPhone: originalMessage.consumer_phone,
          timestamp: originalMessage.timestamp
        }
      },
      originalMessage,
      timestamp: new Date().toISOString()
    };

    await this.sendResponseToPharmacy(pharmacyPhone, response);
  }
} 