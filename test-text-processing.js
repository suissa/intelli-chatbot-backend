const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';

// Mensagens de teste para processamento de texto
const testTextMessages = [
    {
        message: 'Preciso de ajuda com paracetamol para dor de cabeça',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511888888888'
    },
    {
        message: 'Quero saber sobre dipirona para febre',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511777777777'
    },
    {
        message: 'Busco informações sobre ibuprofeno',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511666666666'
    },
    {
        message: 'Procuro remédio para dor de garganta',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511555555555'
    }
];

async function sendTextMessage(messageData) {
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
            console.log(`✅ Mensagem de texto enviada: "${messageData.message}"`);
            console.log(`   📞 De: ${messageData.consumer_phone}`);
            console.log(`   🏥 Para: ${messageData.pharmacy_phone}\n`);
        } else {
            console.error(`❌ Falha ao enviar mensagem: ${messageData.message}`);
        }

    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem: ${error.message}`);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}

async function runTextProcessingTests() {
    console.log('🚀 Iniciando testes de processamento de texto...\n');

    for (let i = 0; i < testTextMessages.length; i++) {
        const msg = testTextMessages[i];
        console.log(`📤 Enviando mensagem ${i + 1}/${testTextMessages.length}...`);
        await sendTextMessage(msg);
        
        // Aguardar 2 segundos entre as mensagens
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Testes de processamento de texto concluídos!');
    console.log('\n📋 Para ver os resultados:');
    console.log('1. Verifique os logs do servidor principal');
    console.log('2. Monitore o console para ver o processamento das mensagens');
    console.log('3. Verifique se as análises de produtos foram geradas');
}

// Executar testes
runTextProcessingTests().catch(console.error); 