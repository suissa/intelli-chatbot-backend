const amqp = require('amqplib');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const PHARMACY_PHONE = '+5511999999999';
const QUEUE_NAME = `pharmacy:${PHARMACY_PHONE}:text`;

async function consumePharmacyResponses() {
  try {
    console.log('🏥 Iniciando consumidor de respostas da farmácia...');
    console.log(`📋 Queue: ${QUEUE_NAME}`);
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Criar queue se não existir
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`✅ Queue criada/verificada: ${QUEUE_NAME}`);
    
    console.log('🎧 Aguardando respostas...');
    console.log('📤 Envie mensagens usando: node test-text-only.js');
    console.log('');
    
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg) {
        try {
          const response = JSON.parse(msg.content.toString());
          console.log('📨 Resposta recebida da farmácia:');
          console.log('='.repeat(50));
          console.log(`✅ Sucesso: ${response.success}`);
          console.log(`📝 Mensagem: ${response.message}`);
          console.log(`⏰ Timestamp: ${response.timestamp}`);
          
          if (response.success && response.data && response.data.product) {
            console.log('');
            console.log('📊 Análise do Produto:');
            console.log(`   🏷️ Nome: ${response.data.product.name}`);
            console.log(`   📋 Características: ${response.data.product.caracteristicasDoProduto}`);
            console.log(`   🔗 Produtos Correlacionados: ${response.data.product.produtosCorrelacionados}`);
            console.log(`   💰 Texto de Venda: ${response.data.product.textoDeVenda}`);
          }
          
          if (response.data && response.data.originalRequest) {
            console.log('');
            console.log('📞 Solicitação Original:');
            console.log(`   📝 Mensagem: ${response.data.originalRequest.message}`);
            console.log(`   📱 Cliente: ${response.data.originalRequest.consumerPhone}`);
            console.log(`   ⏰ Timestamp: ${response.data.originalRequest.timestamp}`);
          }
          
          if (response.data && response.data.error) {
            console.log('');
            console.log('❌ Erro:');
            console.log(`   ${response.data.error}`);
          }
          
          console.log('='.repeat(50));
          console.log('');
          
          // Acknowledge da mensagem
          channel.ack(msg);
        } catch (error) {
          console.error('❌ Erro ao processar resposta:', error);
          channel.nack(msg, false, false);
        }
      }
    });
    
    console.log('🔄 Consumidor ativo. Pressione Ctrl+C para parar.');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Parando consumidor...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar consumidor:', error);
    process.exit(1);
  }
}

consumePharmacyResponses(); 