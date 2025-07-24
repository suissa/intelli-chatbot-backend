import * as amqp from 'amqplib';
import { RabbitMQConfig } from '../rabbitmq.config';
import { MessageQueuePayload } from '../../../domain/entities/message-queue.entity';
import { IMessageConsumer } from '../../../domain/services/message-queue.service';
import { MessageProcessorService } from '../../../domain/services/message-processor.service';
import { PharmacyResponseProducer } from '../producers/pharmacy-response-producer';

export class ConsumerTextMessage implements IMessageConsumer {
  private channel: amqp.Channel;
  private messageProcessor: MessageProcessorService;
  private pharmacyResponseProducer: PharmacyResponseProducer;

  constructor(channel: amqp.Channel, messageProcessor: MessageProcessorService) {
    this.channel = channel;
    this.messageProcessor = messageProcessor;
    this.pharmacyResponseProducer = new PharmacyResponseProducer(channel);
  }

  async consume(queueName: string, callback: (message: MessageQueuePayload) => Promise<void>): Promise<void> {
    try {
      console.log(`📝 Iniciando ConsumerTextMessage na queue: ${queueName}`);
      
      await this.channel.consume(queueName, async (msg) => {
        if (!msg) {
          console.log('❌ Mensagem nula recebida');
          return;
        }

        try {
          const messageContent = JSON.parse(msg.content.toString()) as MessageQueuePayload;
          console.log(`📨 Mensagem de texto recebida:`, messageContent);

          // Processar mensagem de texto
          await this.processTextMessage(messageContent);
          
          // Acknowledge da mensagem
          this.acknowledge(msg);
          
          // Executar callback se fornecido
          if (callback) {
            await callback(messageContent);
          }
        } catch (error) {
          console.error('❌ Erro ao processar mensagem de texto:', error);
          this.reject(msg, false);
        }
      });

      console.log(`✅ ConsumerTextMessage iniciado com sucesso na queue: ${queueName}`);
    } catch (error) {
      console.error('❌ Erro ao iniciar ConsumerTextMessage:', error);
      throw error;
    }
  }

  private async processTextMessage(message: MessageQueuePayload): Promise<void> {
    try {
      console.log(`🔍 Processando mensagem de texto:`);
      console.log(`   - Mensagem: ${message.message}`);
      console.log(`   - De: ${message.consumer_phone}`);
      console.log(`   - Para: ${message.pharmacy_phone}`);
      console.log(`   - Timestamp: ${message.timestamp}`);
      
      // Processar a mensagem usando o MessageProcessorService
      const result = await this.messageProcessor.processTextMessage(message.message);
      
      if (result.success && result.data) {
        console.log(`✅ Análise de produto gerada com sucesso:`);
        console.log(`   - Produto: ${result.data.product.name}`);
        console.log(`   - Características: ${result.data.product.caracteristicasDoProduto.substring(0, 100)}...`);
        console.log(`   - Produtos correlacionados: ${result.data.product.produtosCorrelacionados.substring(0, 100)}...`);
        console.log(`   - Texto de venda: ${result.data.product.textoDeVenda.substring(0, 100)}...`);
        
        // Enviar resposta para a farmácia
        await this.pharmacyResponseProducer.sendProductAnalysisToPharmacy(
          message.pharmacy_phone,
          message,
          result.data.product
        );
        
        console.log(`📤 Resposta enviada para farmácia: ${message.pharmacy_phone}`);
      } else {
        console.log(`⚠️ Não foi possível processar a mensagem: ${result.message}`);
        if (result.error) {
          console.log(`   - Erro: ${result.error}`);
        }
        
        // Enviar resposta de erro para a farmácia
        await this.pharmacyResponseProducer.sendResponseToPharmacy(message.pharmacy_phone, {
          success: false,
          message: result.message || 'Erro ao processar mensagem',
          data: { error: result.error },
          originalMessage: message,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`✅ Mensagem de texto processada com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem de texto:', error);
      
      // Enviar resposta de erro para a farmácia
      try {
        await this.pharmacyResponseProducer.sendResponseToPharmacy(message.pharmacy_phone, {
          success: false,
          message: 'Erro interno ao processar mensagem',
          data: { error: error instanceof Error ? error.message : 'Erro desconhecido' },
          originalMessage: message,
          timestamp: new Date().toISOString()
        });
      } catch (responseError) {
        console.error('❌ Erro ao enviar resposta de erro para farmácia:', responseError);
      }
      
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