const amqp = require('amqplib');

// Configurações do RabbitMQ
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';
const QUEUE_NAME = 'vai:messag:send';

// Interface da mensagem
const MessageType = {
    TEXT: 'text',
    IMAGE: 'image',
    AUDIO: 'audio'
};

/**
 * Função para enviar uma mensagem de texto para o RabbitMQ
 * @param {string} message - Conteúdo da mensagem
 * @param {string} pharmacyPhone - Telefone da farmácia
 * @param {string} consumerPhone - Telefone do consumidor
 * @param {string} type - Tipo da mensagem (text, image, audio)
 */
async function sendMessage(message, pharmacyPhone, consumerPhone, type = MessageType.TEXT) {
    let connection;
    let channel;

    try {
        console.log('🔄 Conectando ao RabbitMQ...');
        
        // Conectar ao RabbitMQ
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        console.log('✅ Conectado ao RabbitMQ com sucesso!');

        // Criar a queue se não existir
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`📋 Queue '${QUEUE_NAME}' verificada/criada`);

        // Preparar a mensagem
        const messagePayload = {
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            pharmacy_phone: pharmacyPhone,
            consumer_phone: consumerPhone
        };

        console.log('📨 Preparando mensagem:', messagePayload);

        // Enviar a mensagem
        const messageBuffer = Buffer.from(JSON.stringify(messagePayload));
        const success = channel.sendToQueue(QUEUE_NAME, messageBuffer, {
            persistent: true,
            timestamp: Date.now()
        });

        if (success) {
            console.log('✅ Mensagem enviada com sucesso!');
            console.log('📊 Detalhes da mensagem:');
            console.log(`   - Tipo: ${type}`);
            console.log(`   - Mensagem: ${message}`);
            console.log(`   - Farmácia: ${pharmacyPhone}`);
            console.log(`   - Consumidor: ${consumerPhone}`);
            console.log(`   - Timestamp: ${messagePayload.timestamp}`);
        } else {
            throw new Error('Falha ao enviar mensagem para a queue');
        }

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message);
        throw error;
    } finally {
        // Fechar conexões
        if (channel) {
            await channel.close();
            console.log('🔌 Canal fechado');
        }
        if (connection) {
            await connection.close();
            console.log('🔌 Conexão fechada');
        }
    }
}

/**
 * Função para enviar múltiplas mensagens de teste
 */
async function sendTestMessages() {
    console.log('🚀 Iniciando envio de mensagens de teste...\n');

    const testMessages = [
        {
            message: 'Olá! Preciso de ajuda com um medicamento para dor de cabeça.',
            pharmacyPhone: '+5511999999999',
            consumerPhone: '+5511888888888',
            type: MessageType.TEXT
        },
        {
            message: 'Tenho uma receita médica, vocês podem me ajudar?',
            pharmacyPhone: '+5511999999999',
            consumerPhone: '+5511777777777',
            type: MessageType.TEXT
        },
        {
            message: 'https://exemplo.com/imagem-remedio.jpg',
            pharmacyPhone: '+5511999999999',
            consumerPhone: '+5511666666666',
            type: MessageType.IMAGE
        },
        {
            message: 'https://exemplo.com/audio-mensagem.mp3',
            pharmacyPhone: '+5511999999999',
            consumerPhone: '+5511555555555',
            type: MessageType.AUDIO
        }
    ];

    for (let i = 0; i < testMessages.length; i++) {
        const msg = testMessages[i];
        console.log(`📤 Enviando mensagem ${i + 1}/${testMessages.length}...`);
        
        try {
            await sendMessage(msg.message, msg.pharmacyPhone, msg.consumerPhone, msg.type);
            console.log(`✅ Mensagem ${i + 1} enviada com sucesso!\n`);
            
            // Aguardar 1 segundo entre as mensagens
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Erro ao enviar mensagem ${i + 1}:`, error.message);
        }
    }

    console.log('🎉 Envio de mensagens de teste concluído!');
}

/**
 * Função para enviar uma mensagem personalizada
 */
async function sendCustomMessage() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    try {
        console.log('📝 Envio de mensagem personalizada\n');
        
        const message = await question('Digite a mensagem: ');
        const pharmacyPhone = await question('Telefone da farmácia (+5511999999999): ') || '+5511999999999';
        const consumerPhone = await question('Telefone do consumidor (+5511888888888): ') || '+5511888888888';
        const typeInput = await question('Tipo da mensagem (text/image/audio) [text]: ') || 'text';
        
        const type = typeInput.toLowerCase();
        if (!Object.values(MessageType).includes(type)) {
            throw new Error('Tipo de mensagem inválido. Use: text, image ou audio');
        }

        console.log('\n📤 Enviando mensagem personalizada...');
        await sendMessage(message, pharmacyPhone, consumerPhone, type);
        console.log('✅ Mensagem personalizada enviada com sucesso!');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        rl.close();
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('🐰 RabbitMQ Message Sender');
    console.log('==========================\n');

    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'test':
                await sendTestMessages();
                break;
            case 'custom':
                await sendCustomMessage();
                break;
            case 'help':
            default:
                console.log('📖 Uso do script:');
                console.log('  node send-message.js test     - Enviar mensagens de teste');
                console.log('  node send-message.js custom   - Enviar mensagem personalizada');
                console.log('  node send-message.js help     - Mostrar esta ajuda');
                console.log('\n📋 Configurações:');
                console.log(`  RabbitMQ URL: ${RABBITMQ_URL}`);
                console.log(`  Queue: ${QUEUE_NAME}`);
                console.log('\n🔧 Variáveis de ambiente:');
                console.log('  RABBITMQ_URL - URL de conexão com o RabbitMQ');
                break;
        }
    } catch (error) {
        console.error('❌ Erro fatal:', error.message);
        process.exit(1);
    }
}

// Executar o script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendMessage,
    sendTestMessages,
    sendCustomMessage,
    MessageType
}; 