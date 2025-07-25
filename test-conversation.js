const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testConversation() {
  try {
    console.log('🤖 Testando rota de conversa com o cliente...\n');

    // Teste 1: Saudação inicial
    console.log('📝 Teste 1: Saudação inicial');
    const greetingResponse = await axios.post(`${API_BASE_URL}/attendances/query`, {
      query: 'Olá, boa tarde!'
    });
    console.log('✅ Resposta:', greetingResponse.data);
    console.log('');

    // Aguardar um pouco antes do próximo teste
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Teste 2: Pergunta sobre remédio
    console.log('📝 Teste 2: Pergunta sobre remédio');
    const medicineResponse = await axios.post(`${API_BASE_URL}/attendances/query`, {
      query: 'Você tem Dipirona 500 mg?'
    });
    console.log('✅ Resposta:', medicineResponse.data);
    console.log('');

    // Aguardar um pouco antes do próximo teste
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Teste 3: Confirmação de compra
    console.log('📝 Teste 3: Confirmação de compra');
    const purchaseResponse = await axios.post(`${API_BASE_URL}/attendances/query`, {
      query: 'Sim, quero comprar o Dipirona'
    });
    console.log('✅ Resposta:', purchaseResponse.data);
    console.log('');

    console.log('🎉 Todos os testes de conversa concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao testar conversa:', error.response?.data || error.message);
  }
}

// Executar o teste
testConversation(); 