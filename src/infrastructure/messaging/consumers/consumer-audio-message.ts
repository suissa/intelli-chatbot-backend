import * as amqp from 'amqplib';
import { RabbitMQConfig } from '../rabbitmq.config';
import { MessageQueuePayload } from '../../../domain/entities/message-queue.entity';
import { IMessageConsumer } from '../../../domain/services/message-queue.service';
import { OpenAIService } from '../../../domain/services/openai.service';
import { PharmacyResponseProducer } from '../producers/pharmacy-response-producer';

export class ConsumerAudioMessage implements IMessageConsumer {
  private channel: amqp.Channel;
  private openaiService: OpenAIService;
  private pharmacyResponseProducer: PharmacyResponseProducer;

  constructor(channel: amqp.Channel) {
    this.channel = channel;
    this.openaiService = new OpenAIService();
    this.pharmacyResponseProducer = new PharmacyResponseProducer(channel);
  }

  async consume(queueName: string, callback: (message: MessageQueuePayload) => Promise<void>): Promise<void> {
    try {
      console.log(`🎵 Iniciando ConsumerAudioMessage na queue: ${queueName}`);
      
      await this.channel.consume(queueName, async (msg) => {
        if (!msg) {
          console.log('❌ Mensagem nula recebida');
          return;
        }

        try {
          const messageContent = JSON.parse(msg.content.toString()) as MessageQueuePayload;
          console.log(`📨 Mensagem de áudio recebida:`, messageContent);

          // Processar mensagem de áudio
          await this.processAudioMessage(messageContent);
          
          // Acknowledge da mensagem
          this.acknowledge(msg);
          
          // Executar callback se fornecido
          if (callback) {
            await callback(messageContent);
          }
        } catch (error) {
          console.error('❌ Erro ao processar mensagem de áudio:', error);
          this.reject(msg, false);
        }
      });

      console.log(`✅ ConsumerAudioMessage iniciado com sucesso na queue: ${queueName}`);
    } catch (error) {
      console.error('❌ Erro ao iniciar ConsumerAudioMessage:', error);
      throw error;
    }
  }

  private async processAudioMessage(message: MessageQueuePayload): Promise<void> {
    try {
      console.log(`🔍 Processando mensagem de áudio:`);
      console.log(`   - Mensagem: ${message.message}`);
      console.log(`   - De: ${message.consumer_phone}`);
      console.log(`   - Para: ${message.pharmacy_phone}`);
      console.log(`   - Timestamp: ${message.timestamp}`);
      
      // Extrair caminho do arquivo de áudio da mensagem
      const audioFilePath = (message as any).audio_file_path;
      
      if (!audioFilePath) {
        throw new Error('Caminho do arquivo de áudio não encontrado na mensagem');
      }
      
      console.log(`🎵 Arquivo de áudio: ${audioFilePath}`);
      
      // Transcrever áudio usando OpenAI
      const transcribedText = await this.openaiService.transcribeAudio(audioFilePath);
      
      console.log(`📝 Texto transcrito: ${transcribedText}`);
      
      // Processar o texto transcrito usando o MessageProcessorService
      // Aqui você pode implementar a lógica para processar o texto transcrito
      // Por exemplo, extrair informações de produtos, etc.
      
      // Enviar resposta para a farmácia
      await this.pharmacyResponseProducer.sendResponseToPharmacy(message.pharmacy_phone, {
        success: true,
        message: 'Áudio transcrito com sucesso',
        data: {
          transcribedText,
          originalAudioFile: audioFilePath,
          originalRequest: {
            message: message.message,
            consumerPhone: message.consumer_phone,
            timestamp: message.timestamp
          }
        },
        originalMessage: message,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📤 Resposta enviada para farmácia: ${message.pharmacy_phone}`);
      console.log(`✅ Mensagem de áudio processada com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem de áudio:', error);
      
      // Enviar resposta de erro para a farmácia
      try {
        await this.pharmacyResponseProducer.sendResponseToPharmacy(message.pharmacy_phone, {
          success: false,
          message: 'Erro ao processar áudio',
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