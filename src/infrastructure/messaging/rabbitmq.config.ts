import { config } from 'dotenv';

config();

export const RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queues: {
    consumerMessages: 'consumer.messages',
    textMessages: 'consumer.messages.text',
    imageMessages: 'consumer.messages.image',
    audioMessages: 'consumer.messages.audio'
  },
  exchanges: {
    messageRouter: 'router.messages'
  }
}; 