# 📨 Scripts de Envio de Mensagens - RabbitMQ

Este diretório contém scripts JavaScript para enviar mensagens de teste para o sistema de Message Queue RabbitMQ.

## 📋 Scripts Disponíveis

### 1. `send-message.js` - Script Completo
Script principal com múltiplas funcionalidades.

**Uso:**
```bash
# Mostrar ajuda
node send-message.js help

# Enviar mensagens de teste
node send-message.js test

# Enviar mensagem personalizada (interativo)
node send-message.js custom
```

**Funcionalidades:**
- ✅ Envio de mensagens de teste pré-definidas
- ✅ Envio de mensagens personalizadas (interativo)
- ✅ Suporte a todos os tipos: text, image, audio
- ✅ Logs detalhados
- ✅ Tratamento de erros
- ✅ Configuração via variáveis de ambiente

### 2. `send-quick-message.js` - Envio Rápido
Script simples para envio rápido de uma mensagem de texto.

**Uso:**
```bash
node send-quick-message.js
```

**Funcionalidades:**
- ✅ Envio rápido de mensagem de texto
- ✅ Configuração fixa
- ✅ Logs básicos

### 3. `test-messages.js` - Testes Automatizados
Script para enviar múltiplas mensagens de teste de diferentes tipos.

**Uso:**
```bash
node test-messages.js
```

**Funcionalidades:**
- ✅ Envio de 4 mensagens de teste
- ✅ Diferentes tipos: text, image, audio
- ✅ Diferentes números de telefone
- ✅ Delay entre mensagens

### 4. `test-audio-transcription.js` ⭐ **NOVO** - Teste de Transcrição de Áudio
Script para testar a transcrição de áudio com aguardo de resposta.

**Uso:**
```bash
node test-audio-transcription.js
```

**Funcionalidades:**
- ✅ Envia mensagem de áudio para transcrição
- ✅ Aguarda automaticamente a resposta da farmácia
- ✅ Exibe o texto transcrito e status do processamento
- ✅ Timeout de 30 segundos para resposta
- ✅ Cria automaticamente arquivo de teste se não existir

**Requisitos:**
- Arquivo `cpm22.mp3` no diretório do script (será criado automaticamente se não existir)
- Para testes reais, substitua o arquivo simulado por um arquivo MP3 válido

### 5. `test-audio-with-choice.js` ⭐ **NOVO** - Teste Interativo
Script interativo para testar transcrição de áudio com escolha de arquivo.

**Uso:**
```bash
node test-audio-with-choice.js
```

**Funcionalidades:**
- ✅ Interface interativa para escolher arquivo de áudio
- ✅ Opção 1: Usar arquivo existente (cpm22.mp3)
- ✅ Opção 2: Criar arquivo de teste
- ✅ Opção 3: Especificar caminho personalizado
- ✅ Aguarda automaticamente a resposta da farmácia
- ✅ Cria arquivos automaticamente se não existirem

### 6. `test-pharmacy-response-consumer.js` ⭐ **NOVO** - Consumidor Contínuo
Script para consumir respostas da farmácia continuamente.

**Uso:**
```bash
node test-pharmacy-response-consumer.js
```

**Funcionalidades:**
- ✅ Monitora continuamente as respostas da farmácia
- ✅ Exibe detalhes completos das respostas
- ✅ Pode ser usado em paralelo com outros testes
- ✅ Para com Ctrl+C
- ✅ Formatação detalhada das respostas

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# URL de conexão com o RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

### Configurações Padrão
- **RabbitMQ URL:** `amqp://localhost:5672`
- **Queue:** `consumer_messages`
- **Mensagens persistentes:** `true`

## 📨 Estrutura da Mensagem

```javascript
{
  message: "Conteúdo da mensagem",
  type: "text|image|audio",
  timestamp: "2024-01-01T12:00:00.000Z",
  pharmacy_phone: "+5511999999999",
  consumer_phone: "+5511888888888"
}
```

## 🚀 Como Usar

### 1. Preparação
Certifique-se de que o RabbitMQ está rodando:
```bash
# Se usando Docker
docker-compose up -d rabbitmq

# Ou se instalado localmente
# Certifique-se de que o RabbitMQ está rodando na porta 5672
```

### 2. Instalar Dependências
```bash
npm install amqplib
```

### 3. Executar Scripts

**Envio rápido:**
```bash
node send-quick-message.js
```

**Testes completos:**
```bash
node test-messages.js
```

**Script interativo:**
```bash
node send-message.js custom
```

**Teste de transcrição de áudio:**
```bash
# Terminal 1: Iniciar consumidor de respostas (opcional)
node test-pharmacy-response-consumer.js

# Terminal 2: Executar teste de transcrição
node test-audio-transcription.js

# Terminal 3: Teste interativo (opcional)
node test-audio-with-choice.js
```

## 🎵 Fluxo de Transcrição de Áudio

### Como Funciona
1. **Envio:** Script envia mensagem de áudio para queue principal
2. **Roteamento:** ConsumerMessages roteia para queue de áudio via Topic Exchange
3. **Processamento:** ConsumerAudioMessage processa e transcreve o áudio
4. **Resposta:** PharmacyResponseProducer envia resultado para farmácia
5. **Recebimento:** Script aguarda e exibe a resposta

### Estrutura da Mensagem de Áudio
```javascript
{
  message: "Arquivo de áudio: /path/to/audio.mp3",
  type: "audio",
  timestamp: "2024-01-01T12:00:00.000Z",
  pharmacy_phone: "+5511999999999",
  consumer_phone: "+5511888888888",
  audio_file_path: "/path/to/audio.mp3"
}
```

### Estrutura da Resposta
```javascript
{
  success: true,
  message: "Áudio transcrito com sucesso",
  data: {
    transcribedText: "Texto transcrito do áudio...",
    originalAudioFile: "/path/to/audio.mp3",
    originalRequest: { ... }
  },
  originalMessage: { ... },
  timestamp: "2024-01-01T12:00:00.000Z"
}
```

## 📊 Exemplos de Saída

### Envio Bem-sucedido
```
🔄 Conectando ao RabbitMQ...
✅ Conectado ao RabbitMQ!
📋 Queue 'consumer_messages' verificada
✅ Mensagem enviada com sucesso!
📨 Conteúdo da mensagem:
{
  "message": "Olá! Preciso de ajuda com um medicamento para dor de cabeça.",
  "type": "text",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "pharmacy_phone": "+5511999999999",
  "consumer_phone": "+5511888888888"
}
🔌 Conexões fechadas
```

### Erro de Conexão
```
🔄 Conectando ao RabbitMQ...
❌ Erro: connect ECONNREFUSED 127.0.0.1:5672
```

### Teste de Transcrição de Áudio
```
🎵 Testando transcrição de áudio...

📁 Arquivo de áudio não encontrado: /path/to/cpm22.mp3
🔧 Criando arquivo de teste...
✅ Arquivo de teste criado: /path/to/cpm22.mp3
⚠️  Nota: Este é um arquivo simulado. Para testes reais, substitua por um arquivo MP3 válido.

📁 Arquivo de áudio encontrado: /path/to/cpm22.mp3

🔄 Iniciando consumidor de resposta...
🏥 Aguardando resposta da farmácia...
📋 Consumindo da queue: pharmacy:+5511999999999:text

sendAudioMessage: 245.67ms
⏳ Aguardando resposta da transcrição...

📨 Resposta da farmácia recebida:
✅ Status: Sucesso
📝 Mensagem: Áudio transcrito com sucesso
📊 Dados: {
  "transcribedText": "Olá, preciso de ajuda com um medicamento para dor de cabeça",
  "originalAudioFile": "/path/to/cpm22.mp3"
}
🕐 Timestamp: 2024-01-01T12:00:00.000Z

🎉 Teste de transcrição de áudio concluído com sucesso!

📊 Resumo do teste:
   ✅ Status: Sucesso
   📝 Mensagem: Áudio transcrito com sucesso
   🎵 Texto transcrito: "Olá, preciso de ajuda com um medicamento para dor de cabeça"
```

### Teste Interativo de Transcrição de Áudio
```
🎵 Testando transcrição de áudio com escolha...

📁 Opções para arquivo de áudio:
1. Usar arquivo existente (cpm22.mp3)
2. Criar arquivo de teste
3. Especificar caminho personalizado

Escolha uma opção (1-3): 2
🔧 Criando arquivo de teste...
✅ Arquivo de teste criado: /path/to/cpm22.mp3
⚠️  Nota: Este é um arquivo simulado. Para testes reais, substitua por um arquivo MP3 válido.

🔄 Iniciando consumidor de resposta...
🏥 Aguardando resposta da farmácia...
📋 Consumindo da queue: pharmacy:+5511999999999:text

sendAudioMessage: 198.45ms
⏳ Aguardando resposta da transcrição...

📨 Resposta da farmácia recebida:
✅ Status: Sucesso
📝 Mensagem: Áudio transcrito com sucesso
📊 Dados: {
  "transcribedText": "Este é um arquivo de teste para simular um áudio MP3",
  "originalAudioFile": "/path/to/cpm22.mp3"
}
🕐 Timestamp: 2024-01-01T12:00:00.000Z

🎉 Teste de transcrição de áudio concluído com sucesso!

📊 Resumo do teste:
   ✅ Status: Sucesso
   📝 Mensagem: Áudio transcrito com sucesso
   🎵 Texto transcrito: "Este é um arquivo de teste para simular um áudio MP3"
```

## 🔍 Monitoramento

### RabbitMQ Management UI
Acesse o painel de gerenciamento do RabbitMQ:
- **URL:** http://localhost:15672
- **Usuário:** guest
- **Senha:** guest

### Logs do Sistema
Monitore os logs do sistema principal para ver o processamento das mensagens:
```bash
# Se o servidor estiver rodando
# As mensagens aparecerão nos logs do console
```

## 🛠️ Solução de Problemas

### Erro de Conexão
```bash
❌ Erro: connect ECONNREFUSED 127.0.0.1:5672
```

**Soluções:**
1. Verifique se o RabbitMQ está rodando
2. Verifique a URL de conexão
3. Verifique se a porta 5672 está disponível

### Erro de Queue
```bash
❌ Erro: Channel closed by server
```

**Soluções:**
1. Verifique as permissões do usuário RabbitMQ
2. Verifique se a queue pode ser criada
3. Reinicie o RabbitMQ

### Mensagem Não Processada
Se a mensagem foi enviada mas não processada:
1. Verifique se o servidor principal está rodando
2. Verifique se os consumers estão ativos
3. Verifique os logs do servidor

## 📝 Personalização

### Modificar Mensagens de Teste
Edite o arquivo `test-messages.js` para alterar as mensagens de teste:

```javascript
const testMessages = [
    {
        message: 'Sua mensagem personalizada aqui',
        type: 'text',
        pharmacy_phone: '+5511999999999',
        consumer_phone: '+5511888888888'
    }
    // Adicione mais mensagens...
];
```

### Modificar Configurações
Edite as constantes no início dos scripts:

```javascript
const RABBITMQ_URL = 'amqp://seu-rabbitmq:5672';
const QUEUE_NAME = 'sua-queue';
```

## 🔗 Links Úteis

- [Documentação RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [amqplib Library](https://github.com/amqplib/amqplib)
- [AMQP Concepts](https://www.rabbitmq.com/tutorials/amqp-concepts.html)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs de erro
2. Consulte a documentação do RabbitMQ
3. Verifique se todas as dependências estão instaladas
4. Certifique-se de que o RabbitMQ está rodando corretamente 