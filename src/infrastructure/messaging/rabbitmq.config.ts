import { config } from 'dotenv';

config();

export const RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queues: {
    consumerMessages: 'consumer_messages',
    textMessages: 'text_messages',
    imageMessages: 'image_messages',
    audioMessages: 'audio_messages'
  },
  exchanges: {
    messageRouter: 'message_router'
  }
}; 