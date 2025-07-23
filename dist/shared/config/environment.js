"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000'),
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432'),
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_DATABASE: process.env.DB_DATABASE || 'fastify_atendimento',
    RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
    RABBITMQ_PORT: parseInt(process.env.RABBITMQ_PORT || '5672'),
    RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME || 'guest',
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD || 'guest',
    RABBITMQ_VHOST: process.env.RABBITMQ_VHOST || '/',
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_FORMAT: process.env.LOG_FORMAT || 'combined',
};
//# sourceMappingURL=environment.js.map