const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';

// Mensagem de exemplo
const message = {
    message: 'Olá! Preciso de ajuda com um medicamento para dor de cabeça.',
    type: 'text',
    timestamp: new Date().toISOString(),
    pharmacy_phone: '+5511999999999',
    consumer_phone: '+5511888888888'
};

async function sendQuickMessage() {
    let connection;
    let channel;

    try {
        console.log('🔄 Conectando ao RabbitMQ...');
        
        // Conectar ao RabbitMQ
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        console.log('✅ Conectado ao RabbitMQ!');

        // Criar a queue
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`📋 Queue '${QUEUE_NAME}' verificada`);

        // Enviar mensagem
        const messageBuffer = Buffer.from(JSON.stringify(message));
        const success = channel.sendToQueue(QUEUE_NAME, messageBuffer, {
            persistent: true
        });

        if (success) {
            console.log('✅ Mensagem enviada com sucesso!');
            console.log('📨 Conteúdo da mensagem:');
            console.log(JSON.stringify(message, null, 2));
        } else {
            console.error('❌ Falha ao enviar mensagem');
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('🔌 Conexões fechadas');
    }
}

// Executar
sendQuickMessage(); 