import { MessageQueuePayload, MessageType } from '../entities/message-queue.entity';

export interface IMessageQueueService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface IMessageConsumer {
  consume(queueName: string, callback: (message: MessageQueuePayload) => Promise<void>): Promise<void>;
  acknowledge(message: any): void;
  reject(message: any, requeue?: boolean): void;
}

export interface IMessageProducer {
  publish(queueName: string, message: MessageQueuePayload): Promise<void>;
  publishToExchange(exchangeName: string, routingKey: string, message: MessageQueuePayload): Promise<void>;
}

export interface IMessageQueueManager {
  initializeConsumers(): Promise<void>;
  initializeProducers(): Promise<void>;
  routeMessage(message: MessageQueuePayload): Promise<void>;
} 