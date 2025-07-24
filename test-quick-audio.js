const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';
const PHARMACY_PHONE = '+5511999999999';

console.time('testQuickAudio');
// Função para enviar mensagem de áudio
async function sendAudioMessage(audioFilePath) {
  try {
    console.log('🎵 Enviando mensagem de áudio...');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    const message = {
      message: `Arquivo de áudio: ${audioFilePath}`,
      type: 'audio',
      timestamp: new Date().toISOString(),
      pharmacy_phone: PHARMACY_PHONE,
      consumer_phone: '+5511888888888',
      audio_file_path: audioFilePath
    };

    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    const success = channel.sendToQueue(QUEUE_NAME, messageBuffer, {
      persistent: true,
      timestamp: Date.now()
    });

    if (success) {
      console.log('✅ Mensagem de áudio enviada com sucesso!');
      console.log(`📁 Arquivo: ${audioFilePath}`);
      console.log(`📞 De: ${message.consumer_phone}`);
      console.log(`🏥 Para: ${message.pharmacy_phone}`);
      console.log(`🎵 Tipo: ${message.type}`);
    } else {
      throw new Error('Falha ao enviar mensagem de áudio');
    }

    await channel.close();
    await connection.close();
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem de áudio:', error);
    throw error;
  }
}

// Função para consumir resposta da farmácia
async function consumePharmacyResponse() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('🏥 Aguardando resposta da farmácia...');
      
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      
      const pharmacyQueueName = `pharmacy:${PHARMACY_PHONE}:text`;
      
      await channel.assertQueue(pharmacyQueueName, { durable: true });
      
      console.log(`📋 Consumindo da queue: ${pharmacyQueueName}`);
      
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout: Nenhuma resposta recebida em 30 segundos');
        channel.close();
        connection.close();
        resolve(null);
      }, 30000);
      
      await channel.consume(pharmacyQueueName, (msg) => {
        if (msg) {
          clearTimeout(timeout);
          
          try {
            const response = JSON.parse(msg.content.toString());
            console.log('📨 Resposta da farmácia recebida:');
            console.log('✅ Status:', response.success ? 'Sucesso' : 'Erro');
            console.log('📝 Mensagem:', response.message);
            console.log('📊 Dados:', JSON.stringify(response.data, null, 2));
            console.log('🕐 Timestamp:', response.timestamp);
            
            channel.ack(msg);
            channel.close();
            connection.close();
            
            resolve(response);
          } catch (error) {
            console.error('❌ Erro ao processar resposta:', error);
            channel.nack(msg, false, false);
            reject(error);
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao consumir resposta da farmácia:', error);
      reject(error);
    }
  });
}

// Função principal
async function testQuickAudio() {
  try {
    console.log('🎵 Teste rápido de transcrição de áudio...');
    console.log('');
    
    const audioFilePath = path.join(__dirname, 'cpm22.mp3');
    
    if (!fs.existsSync(audioFilePath)) {
      console.log('🔧 Criando arquivo de teste...');
      const testContent = 'Este é um arquivo de teste para simular um áudio MP3.';
      fs.writeFileSync(audioFilePath, testContent);
      console.log(`✅ Arquivo de teste criado: ${audioFilePath}`);
    } else {
      console.log(`📁 Arquivo encontrado: ${audioFilePath}`);
    }
    
    console.log('');
    console.log('🔄 Iniciando consumidor de resposta...');
    const responsePromise = consumePharmacyResponse();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📤 Enviando mensagem...');
    await sendAudioMessage(audioFilePath);
    console.log('');
    
    console.log('⏳ Aguardando resposta...');
    const response = await responsePromise;
    
    if (response) {
      console.log('');
      console.log('🎉 Teste concluído com sucesso!');
      console.log(`✅ Status: ${response.success ? 'Sucesso' : 'Erro'}`);
      console.log(`📝 Mensagem: ${response.message}`);
      if (response.data && response.data.transcribedText) {
        console.log(`🎵 Texto transcrito: "${response.data.transcribedText.substring(0, 100)}..."`);
      }
    } else {
      console.log('');
      console.log('⚠️ Nenhuma resposta recebida');
    }
    
    console.timeEnd('testQuickAudio');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.log(error);
    console.timeEnd('testQuickAudio');
  }
}

testQuickAudio(); 