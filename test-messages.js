const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';

// Mensagens de teste
const testMessages = [
    {
        message: 'Olá! Preciso de ajuda com um medicamento para dor de cabeça.',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511888888888'
    },
    {
        message: 'Tenho uma receita médica, vocês podem me ajudar?',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511777777777'
    },
    {
        message: 'https://exemplo.com/imagem-remedio.jpg',
        type: 'image',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511666666666'
    },
    {
        message: 'https://exemplo.com/audio-mensagem.mp3',
        type: 'audio',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511555555555'
    }
];

async function sendMessage(messageData) {
    let connection;
    let channel;

    try {
        // Conectar ao RabbitMQ
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Criar a queue
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        // Preparar mensagem
        const message = {
            ...messageData,
            timestamp: new Date().toISOString()
        };

        // Enviar mensagem
        const messageBuffer = Buffer.from(JSON.stringify(message));
        const success = channel.sendToQueue(QUEUE_NAME, messageBuffer, {
            persistent: true
        });

        if (success) {
            console.log(`✅ Mensagem ${message.type} enviada com sucesso!`);
            console.log(`   📝 Conteúdo: ${message.message.substring(0, 50)}...`);
            console.log(`   📞 De: ${message.consumer_phone}`);
            console.log(`   🏥 Para: ${message.pharmacy_phone}\n`);
        } else {
            console.error(`❌ Falha ao enviar mensagem ${message.type}`);
        }

    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem ${messageData.type}:`, error.message);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}

async function runTests() {
    console.log('🚀 Iniciando testes de mensagens...\n');

    for (let i = 0; i < testMessages.length; i++) {
        const msg = testMessages[i];
        console.log(`📤 Enviando mensagem ${i + 1}/${testMessages.length} (${msg.type})...`);
        await sendMessage(msg);
        
        // Aguardar 1 segundo entre as mensagens
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('🎉 Testes concluídos!');
}

// Executar testes
runTests().catch(console.error); 