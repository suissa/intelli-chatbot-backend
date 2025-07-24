const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const PHARMACY_PHONE = '+5511999999999';

async function checkQueueMessages() {
  try {
    console.log('🔍 Verificando mensagens na fila da farmácia...');
    console.log('');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    const pharmacyQueueName = `pharmacy:${PHARMACY_PHONE}:text`;
    
    console.log(`📋 Verificando fila: ${pharmacyQueueName}`);
    
    // Verificar informações da fila
    const queueInfo = await channel.checkQueue(pharmacyQueueName);
    console.log(`📊 Total de mensagens na fila: ${queueInfo.messageCount}`);
    console.log('');
    
    if (queueInfo.messageCount > 0) {
      console.log('📨 Mensagens encontradas:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      let messageCount = 0;
      const maxMessages = Math.min(queueInfo.messageCount, 10); // Máximo 10 mensagens
      
      for (let i = 0; i < maxMessages; i++) {
        const msg = await channel.get(pharmacyQueueName, { noAck: false });
        
        if (msg) {
          messageCount++;
          try {
            const response = JSON.parse(msg.content.toString());
            console.log(`📨 Mensagem ${messageCount}:`);
            console.log(`   ✅ Status: ${response.success ? 'Sucesso' : 'Erro'}`);
            console.log(`   📝 Mensagem: ${response.message}`);
            console.log(`   🕐 Timestamp: ${response.timestamp}`);
            
            if (response.data && response.data.error) {
              console.log(`   ❌ Erro: ${response.data.error}`);
            }
            
            if (response.data && response.data.transcribedText) {
              console.log(`   🎵 Texto transcrito: "${response.data.transcribedText.substring(0, 50)}..."`);
            }
            
            console.log('');
            
            // Recolocar a mensagem na fila (não consumir)
            channel.nack(msg, false, true);
          } catch (error) {
            console.log(`   ❌ Erro ao processar mensagem: ${error.message}`);
            channel.nack(msg, false, true);
          }
        } else {
          break;
        }
      }
      
      console.log(`📊 Verificadas ${messageCount} mensagens`);
    } else {
      console.log('📭 Nenhuma mensagem na fila');
    }
    
    await channel.close();
    await connection.close();
    
  } catch (error) {
    console.error('❌ Erro ao verificar mensagens:', error);
  }
}

checkQueueMessages(); 