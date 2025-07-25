const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
const QUEUE_NAME = 'whatsapp.send.commands';

// Mensagem de exemplo
const message = {
    command: 'send_message',
    instanceId: "vai",
    payload: {
      to: "5515991956759@s.whatsapp.net",
      message: "urrul",
      type: "text"
    },
    timestamp: "2025-07-24T10:00:00Z",
    eventId: "123e4567-e89b-12d3-a456-426614174000"
}

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