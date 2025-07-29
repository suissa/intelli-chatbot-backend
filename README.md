# Pharma Intelli Chat Bot


## Algoritmos de Matching

Como já possuímos milhares de produtos, para aumentar acurácia da busca por um remédio/produto
precisamos implementar certos algoritmos que consigam achar o termo correto mesmo
escrito de formas erradas (muito comum), para sermos tolerantes a erros.

Um algoritmo usado pelo ElasticSearch e chatbots é o Threshold-Based Similarity Matching, além dele
achei interessante implementar o Soundex, o Matching Fuzzy e Damerau-Levenshtein Distance. 

Com isso cobrimos as formas mais comuns de erros de escrita digital.

Eu costumo utilizar o Soundex há um bom tempo já, por sinal tenho um código em JS de 13 anos atrás:
https://gist.github.com/suissa/2493801

Threshold-Based Similarity Matching
Você define um threshold (ex: 0.85 = 85%) e só retorna pares cuja similaridade com o termo de entrada seja igual ou superior


Melhor sequência recomendada:
1. Soundex (agrupamento fonético inicial)
📌 Objetivo: restringir o universo de busca às palavras com som parecido
🔍 Por quê:

Reduz drasticamente o número de comparações.

Captura variações fonéticas como “depyrona” → “dipirona”.

Elimina termos não relacionados mas ortograficamente próximos.

2. QWERTY-aware Damerau-Levenshtein (keyboardDistance)
📌 Objetivo: identificar digitações erradas comuns
🧠 Por quê:

Captura transposições (ex: “dpiriona” → “dipirona”)

Penaliza menos erros plausíveis (ex: i no lugar de o)

Mais realista que Levenshtein puro em interfaces humanas (ex: WhatsApp)

3. Thresholded Similarity (similarityPercent ≥ 0.85)
📌 Objetivo: filtrar apenas palavras suficientemente próximas
📏 Por quê:

Garante que apenas candidatos bons avancem para sugestões.

Elimina “falsos positivos” que passam pelo Soundex mas são diferentes demais.

4. (Opcional) matchSmart()
📌 Objetivo: unifica fonético + fuzzy, priorizando os que passam pelos dois
📦 Por quê:

Funciona como fallback ideal quando entrada está muito distorcida.

Garante ordenação otimizada de candidatos.

Retorna os top N melhores, balanceando som + digitação.

5. (Opcional) RAG com contexto de frase (em casos ambíguos)
📌 Objetivo: resolver ambiguidade contextual com modelo de linguagem ou base vetorial
📖 Exemplo: “algo para febre” pode ativar busca semântica para “antitérmicos”
## Fluxos

### Texto

- pesquisa por algum produto em promoção irá retornar os mais baratos encontrados


###