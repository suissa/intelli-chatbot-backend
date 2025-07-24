const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const PHARMACY_PHONE = '+5511999999999';

async function clearPharmacyQueue() {
  try {
    console.log('🧹 Limpando fila da farmácia...');
    console.log('');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    const pharmacyQueueName = `pharmacy:${PHARMACY_PHONE}:text`;
    
    console.log(`📋 Limpando fila: ${pharmacyQueueName}`);
    
    // Verificar informações da fila antes
    const queueInfoBefore = await channel.checkQueue(pharmacyQueueName);
    console.log(`📊 Mensagens antes da limpeza: ${queueInfoBefore.messageCount}`);
    
    if (queueInfoBefore.messageCount > 0) {
      // Consumir todas as mensagens
      let clearedCount = 0;
      
      while (true) {
        const msg = await channel.get(pharmacyQueueName, { noAck: true });
        if (msg) {
          clearedCount++;
          console.log(`🗑️ Removida mensagem ${clearedCount}`);
        } else {
          break;
        }
      }
      
      console.log(`✅ Total de mensagens removidas: ${clearedCount}`);
    } else {
      console.log('📭 Fila já estava vazia');
    }
    
    // Verificar informações da fila depois
    const queueInfoAfter = await channel.checkQueue(pharmacyQueueName);
    console.log(`📊 Mensagens depois da limpeza: ${queueInfoAfter.messageCount}`);
    
    await channel.close();
    await connection.close();
    
    console.log('');
    console.log('🎉 Fila limpa com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar fila:', error);
  }
}

clearPharmacyQueue(); 