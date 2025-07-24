const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';

// Função para criar um arquivo de áudio de teste (simulado)
function createTestAudioFile() {
  const testAudioPath = path.join(__dirname, 'test-audio.mp3');
  
  // Criar um arquivo de teste simples (não é um áudio real, apenas para teste)
  const testContent = 'Este é um arquivo de teste para simular um áudio MP3';
  fs.writeFileSync(testAudioPath, testContent);
  
  console.log(`📁 Arquivo de teste criado: ${testAudioPath}`);
  return testAudioPath;
}

// Função para enviar mensagem de áudio
async function sendAudioMessage(audioFilePath) {
  try {
    console.log('🎵 Enviando mensagem de áudio...');
    
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Verificar se a queue existe
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    const message = {
      message: `Arquivo de áudio: ${audioFilePath}`,
      type: 'audio',
      timestamp: new Date().toISOString(),
      pharmacy_phone: '+5511999999999',
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

// Função principal
async function testAudioTranscription() {
  try {
    console.log('🎵 Testando transcrição de áudio...');
    console.log('');
    
    // Criar arquivo de teste
    const audioFilePath = createTestAudioFile();
    
    // Enviar mensagem de áudio
    await sendAudioMessage(audioFilePath);
    
    console.log('');
    console.log('🎉 Teste de transcrição de áudio concluído!');
    console.log('');
    console.log('📋 Para ver os resultados:');
    console.log('1. Verifique os logs do servidor principal');
    console.log('2. Monitore o console para ver o processamento da mensagem de áudio');
    console.log('3. Verifique se a transcrição foi gerada');
    console.log('4. Confirme que a resposta foi enviada para a farmácia');
    
  } catch (error) {
    console.error('❌ Erro no teste de transcrição de áudio:', error);
  }
}

// Executar teste
testAudioTranscription(); 