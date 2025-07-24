const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';

// Testar diferentes formatos de telefone
const phoneNumbers = [
  '5511999999999',
  '+5511999999999',
  '5511999999999',
  '+5511999999999'
];

async function debugQueueNames() {
  try {
    console.log('🔍 Debugando nomes de filas...');
    console.log('');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    for (const phone of phoneNumbers) {
      const queueName = `pharmacy:${phone}:text`;
      console.log(`📋 Testando fila: ${queueName}`);
      
      try {
        // Verificar se a fila existe
        const queueInfo = await channel.checkQueue(queueName);
        console.log(`   ✅ Fila existe com ${queueInfo.messageCount} mensagens`);
        
        // Tentar consumir uma mensagem
        const msg = await channel.get(queueName, { noAck: false });
        if (msg) {
          console.log(`   📨 Mensagem encontrada: ${msg.content.toString().substring(0, 100)}...`);
          channel.nack(msg, false, true); // Recolocar na fila
        } else {
          console.log(`   📭 Nenhuma mensagem na fila`);
        }
      } catch (error) {
        console.log(`   ❌ Erro ao verificar fila: ${error.message}`);
      }
      
      console.log('');
    }
    
    await channel.close();
    await connection.close();
    
  } catch (error) {
    console.error('❌ Erro ao debugar filas:', error);
  }
}

debugQueueNames(); 