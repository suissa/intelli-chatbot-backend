# Pharma Intelli Chat Bot

Esse projeto foi criado para ser um serviço autonomo que vocês só precisem configurar o nome das filas, o .env e subir os Dockers


## Fluxos

Esse chat bot possui 1 fluxo síncrono e 1 assíncrono, pronto para vocês utilizarem tanto agora como na nova arquitetura.

- REST API (síncrono)
- Mensageria RabbitMQ (assíncrono)

## REST API

- recebe a requisição e envia para um Controller
- o Controller pode chamar um Repository ou um Service
- o Service pode chamar outro Service ou um Repository
- se chamar o Repository só pode ler os dados, nenhuma informação do Banco de Dados pode ser alterada pelo Service
- o Service deve sempre retornar um valor para o Controller
- o Controller é o responsável por retornar a resposta na rota.

## RabbitMQ

- ConsumerMessages fica ouvindo o tópico consumer.messages que
utiliza o valor type da message como routingKey
- Ou o ConsumerAudioMessage ou o ConsumerImageMessage ou o ConsumerTextMessage irão receber
- cada consumer possui uma função de Processor
- ao final do seu processamento ela envia o resultado para o PharmacyResponseProducer que irá enviar o resultado na fila pharmacy:{telefone_farmacia}:text

Finalizando o fluxo assíncrono

## Possíveis Melhorias

- Graph RAG
- Cache RAG
- Ranking global de medicamentos requisitados
  - estratégia de cache
  - previsão de demanda

- STORAGE (separar em 1 serviço autonomo e em um servidor diferente)
  - API REST
  - RabbitMQ

- CQRS:
  - leitura: MongoDB (com replicação, se crescer muito sharding)
  - escrita Postgres (com replicação)
  - cache: Redis (cluster com Redis Sentinel)

- Event Sourcing
  - MongoDB

- WebCrawler 
  - busca imagens
  - busca dados do remédio

- Small Model Language
  - Fine tuning focado em atendimento (economia brutal)

- NER (Reconhecimento de Entidade Nomeada)
  - ensinar a IA a reconhecer o nome de um remédio
  - padrão dos sufixos farmaceuticos
  - active learning
  - open source (único modelo de reconhecimento de medicamentos do Brasil)