const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configurações
const RABBITMQ_URL = 'amqp://localhost:5672';
const QUEUE_NAME = 'consumer_messages';
const PHARMACY_PHONE = '+5511999999999';

// Interface para leitura de input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer pergunta ao usuário
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Função para criar arquivo de teste
function createTestAudioFile(filePath) {
  console.log('🔧 Criando arquivo de teste...');
  
  const testContent = 'Este é um arquivo de teste para simular um áudio MP3. Em um ambiente real, este seria um arquivo de áudio válido.';
  fs.writeFileSync(filePath, testContent);
  
  console.log(`✅ Arquivo de teste criado: ${filePath}`);
  console.log('⚠️  Nota: Este é um arquivo simulado. Para testes reais, substitua por um arquivo MP3 válido.');
  console.log('');
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
      
      // Verificar se a queue existe
      await channel.assertQueue(pharmacyQueueName, { durable: true });
      
      console.log(`📋 Consumindo da queue: ${pharmacyQueueName}`);
      
      // Configurar timeout de 30 segundos
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout: Nenhuma resposta recebida em 30 segundos');
        channel.close();
        connection.close();
        resolve(null);
      }, 30000);
      
      // Consumir mensagem
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
            
            // Acknowledge da mensagem
            channel.ack(msg);
            
            // Fechar conexão
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
async function testAudioTranscriptionWithChoice() {
  try {
    console.log('🎵 Testando transcrição de áudio com escolha...');
    console.log('');
    
    const defaultAudioPath = path.join(__dirname, 'cpm22.mp3');
    
    // Perguntar ao usuário sobre o arquivo de áudio
    console.log('📁 Opções para arquivo de áudio:');
    console.log('1. Usar arquivo existente (cpm22.mp3)');
    console.log('2. Criar arquivo de teste');
    console.log('3. Especificar caminho personalizado');
    console.log('');
    
    const choice = await askQuestion('Escolha uma opção (1-3): ');
    
    let audioFilePath;
    
    switch (choice.trim()) {
      case '1':
        if (fs.existsSync(defaultAudioPath)) {
          audioFilePath = defaultAudioPath;
          console.log(`📁 Usando arquivo existente: ${audioFilePath}`);
        } else {
          console.log('❌ Arquivo cpm22.mp3 não encontrado');
          console.log('🔧 Criando arquivo de teste...');
          createTestAudioFile(defaultAudioPath);
          audioFilePath = defaultAudioPath;
        }
        break;
        
      case '2':
        createTestAudioFile(defaultAudioPath);
        audioFilePath = defaultAudioPath;
        break;
        
      case '3':
        const customPath = await askQuestion('Digite o caminho completo do arquivo de áudio: ');
        audioFilePath = customPath.trim();
        
        if (!fs.existsSync(audioFilePath)) {
          console.log(`❌ Arquivo não encontrado: ${audioFilePath}`);
          console.log('🔧 Criando arquivo de teste no caminho especificado...');
          createTestAudioFile(audioFilePath);
        } else {
          console.log(`📁 Arquivo encontrado: ${audioFilePath}`);
        }
        break;
        
      default:
        console.log('❌ Opção inválida. Usando arquivo padrão...');
        if (fs.existsSync(defaultAudioPath)) {
          audioFilePath = defaultAudioPath;
        } else {
          createTestAudioFile(defaultAudioPath);
          audioFilePath = defaultAudioPath;
        }
    }
    
    console.log('');
    
    // Iniciar consumidor de resposta ANTES de enviar a mensagem
    console.log('🔄 Iniciando consumidor de resposta...');
    const responsePromise = consumePharmacyResponse();
    
    // Aguardar um pouco para garantir que o consumidor está pronto
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.time('sendAudioMessage');
    // Enviar mensagem de áudio
    await sendAudioMessage(audioFilePath);
    console.timeEnd('sendAudioMessage');
    console.log('');
    
    // Aguardar resposta da farmácia
    console.log('⏳ Aguardando resposta da transcrição...');
    const response = await responsePromise;
    
    if (response) {
      console.log('');
      console.log('🎉 Teste de transcrição de áudio concluído com sucesso!');
      console.log('');
      console.log('📊 Resumo do teste:');
      console.log(`   ✅ Status: ${response.success ? 'Sucesso' : 'Erro'}`);
      console.log(`   📝 Mensagem: ${response.message}`);
      if (response.data && response.data.transcribedText) {
        console.log(`   🎵 Texto transcrito: "${response.data.transcribedText}"`);
      }
    } else {
      console.log('');
      console.log('⚠️ Teste concluído, mas nenhuma resposta foi recebida');
      console.log('📋 Verifique os logs do servidor para mais detalhes');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de transcrição de áudio:', error);
  } finally {
    rl.close();
  }
}

// Executar teste
testAudioTranscriptionWithChoice(); 