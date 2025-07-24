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