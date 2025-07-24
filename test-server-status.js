const http = require('http');

function testServer() {
  console.log('🔍 Testando status do servidor...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/message-queue/status',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📨 Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
  });

  req.end();
}

testServer(); 