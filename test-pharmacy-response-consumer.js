const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const PHARMACY_PHONE = '+5511999999999';

// Função para consumir respostas da farmácia
async function consumePharmacyResponses() {
  try {
    console.log('🏥 Iniciando consumidor de respostas da farmácia...');
    console.log(`📞 Telefone da farmácia: ${PHARMACY_PHONE}`);
    console.log('');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    const pharmacyQueueName = `pharmacy:${PHARMACY_PHONE}:text`;
    
    // Verificar se a queue existe
    await channel.assertQueue(pharmacyQueueName, { durable: true });
    
    console.log(`📋 Consumindo da queue: ${pharmacyQueueName}`);
    console.log('⏳ Aguardando respostas... (Ctrl+C para parar)');
    console.log('');
    
    // Consumir mensagens continuamente
    await channel.consume(pharmacyQueueName, (msg) => {
      if (msg) {
        try {
          const response = JSON.parse(msg.content.toString());
          
          console.log('📨 Resposta da farmácia recebida:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`✅ Status: ${response.success ? 'Sucesso' : 'Erro'}`);
          console.log(`📝 Mensagem: ${response.message}`);
          console.log(`🕐 Timestamp: ${response.timestamp}`);
          
          if (response.data) {
            console.log('📊 Dados:');
            if (response.data.transcribedText) {
              console.log(`   🎵 Texto transcrito: "${response.data.transcribedText}"`);
            }
            if (response.data.originalAudioFile) {
              console.log(`   📁 Arquivo original: ${response.data.originalAudioFile}`);
            }
            if (response.data.error) {
              console.log(`   ❌ Erro: ${response.data.error}`);
            }
          }
          
          if (response.originalMessage) {
            console.log('📤 Mensagem original:');
            console.log(`   📞 De: ${response.originalMessage.consumer_phone}`);
            console.log(`   🎵 Tipo: ${response.originalMessage.type}`);
            console.log(`   📝 Conteúdo: ${response.originalMessage.message}`);
          }
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('');
          
          // Acknowledge da mensagem
          channel.ack(msg);
          
        } catch (error) {
          console.error('❌ Erro ao processar resposta:', error);
          channel.nack(msg, false, false);
        }
      }
    });
    
    // Manter o processo ativo
    process.on('SIGINT', async () => {
      console.log('');
      console.log('🛑 Parando consumidor...');
      await channel.close();
      await connection.close();
      console.log('👋 Consumidor parado');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Erro ao consumir respostas da farmácia:', error);
    process.exit(1);
  }
}

// Executar consumidor
consumePharmacyResponses(); 