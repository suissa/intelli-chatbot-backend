import { FastifyRequest, FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { MessageQueueManager } from '../../infrastructure/messaging/message-queue-manager';
import { MessageQueuePayload, MessageType } from '../../domain/entities/message-queue.entity';

@injectable()
export class MessageQueueController {
  constructor(
    @inject(TYPES.MessageQueueManager) private messageQueueManager: MessageQueueManager
  ) {}

  async sendTextMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { message, pharmacy_phone, consumer_phone } = request.body as any;
      
      const messagePayload: MessageQueuePayload = {
        message,
        type: MessageType.TEXT,
        timestamp: new Date().toISOString(),
        pharmacy_phone,
        consumer_phone
      };

      await this.messageQueueManager.sendTextMessage(messagePayload);

      return reply.status(200).send({
        success: true,
        message: 'Mensagem de texto enviada com sucesso',
        data: messagePayload
      });
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de texto:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro ao enviar mensagem de texto',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async sendImageMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { message, pharmacy_phone, consumer_phone } = request.body as any;
      
      const messagePayload: MessageQueuePayload = {
        message,
        type: MessageType.IMAGE,
        timestamp: new Date().toISOString(),
        pharmacy_phone,
        consumer_phone
      };

      await this.messageQueueManager.sendImageMessage(messagePayload);

      return reply.status(200).send({
        success: true,
        message: 'Mensagem de imagem enviada com sucesso',
        data: messagePayload
      });
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de imagem:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro ao enviar mensagem de imagem',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async sendAudioMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { message, pharmacy_phone, consumer_phone } = request.body as any;
      
      const messagePayload: MessageQueuePayload = {
        message,
        type: MessageType.AUDIO,
        timestamp: new Date().toISOString(),
        pharmacy_phone,
        consumer_phone
      };

      await this.messageQueueManager.sendAudioMessage(messagePayload);

      return reply.status(200).send({
        success: true,
        message: 'Mensagem de áudio enviada com sucesso',
        data: messagePayload
      });
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de áudio:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro ao enviar mensagem de áudio',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.status(200).send({
        success: true,
        message: 'Sistema de Message Queue funcionando',
        timestamp: new Date().toISOString(),
        queues: {
          consumerMessages: 'consumer_messages',
          textMessages: 'text_messages',
          imageMessages: 'image_messages',
          audioMessages: 'audio_messages'
        }
      });
    } catch (error) {
      console.error('❌ Erro ao obter status:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro ao obter status',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 