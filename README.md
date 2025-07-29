# Pharma Intelli Chat Bot


## Extração de Texto de Imagem - OCR

![](https://github.com/JaidedAI/EasyOCR/blob/master/examples/easyocr_framework.jpeg?raw=true)

## Algoritmos de Matching

Tendo em vista que a interação textual é nossa fonte da verdade, precisamos de mecanismos de entendimento textual mesmo ele não estando corretamente escrito, não podemos ficar questionando o cliente apenas por um erro simples.

E para aumentar acurácia da busca por um remédio/produto
precisamos implementar certos algoritmos que consigam achar o termo correto mesmo
escrito de diferentes formas, assim garanbtimos uma resiliência a erros não barrando o fluxo das interações (que é o mais importante).

Para isso eu defini 4 formas difentes de encontra palavras similares, podemos encontrar por uma parte dela (similaridade mínima), pelo trabalho necessário em transformar uma string em outra (similaridade por transformação), encontrar mesmo com erros de digitação (similariedade heurística) e encontrar pelo fonética da palavra (similaridade fonética).

- Threshold-Based Similarity Matching: faz a busca pela porcentagem mínima de similaridade, ex: 75%. Se eu enviar BEPAN vai retornar BEPANTRIZ (ele é utilizado pelo ElasticSeach)
- Matching Fuzzy: mede a distância entre as strings e calcula número mínimo de edições (inserções, exclusões ou substituições) necessárias para transformar uma string em outra. 
- Damerau-Levenshtein Distance: faz a , iremos utilizar ele para deduplicar dados da base das conversas dos clientes para unificar palavras iguais escritas diferente, graças a operação de transposição podemos até dar pesos diferentes para erros como: nas bordas onde pe mais difícil ter erros o peso deve ser mais alto
- Soundex

Um algoritmo usado pelo ElasticSearch e chatbots é o Threshold-Based Similarity Matching. E implementeio o Matching Fuzzy, que a faz a busca aproximada e também pode ser usado para deduplicação dos dados, algo deveras para a normalização das palavbras aumentando assim sua correlação semântica, pois a correlação se dá pela distância dos vetores, a mesma palavra escrita de formas diferentes geram vetores diferentes. Para sermos mais tolerantes a erros precisamos de forma obrigatória implementar um algoritmo que leva em conta erros de digitação, parecido com os que existem nos teclados de celular, nesse projeto escolhi o , que faz a busca "eliminado" erros de digitação. E o que eu gosto muito de usar o Soundex. 

Até reusei um código que eu forkei em JS, de um amigo meu, de 13 anos atrás, que usava muito por ele ser deveras elegante, tanto sua implementação com REGEX que pode ser reusada em qualquer linguagem de programação, com o algorítmo em si:
https://gist.github.com/suissa/2493801

Só tive adicionar uma função de normalização de acentos e equivalentes fonéticos, pois
ele não entende que farmácia é a mesma coisa de farmácia, 

Com isso cobrimos as formas mais comuns de erros de escrita digital.

Eu costumo utilizar o Soundex há um bom tempo já, por sinal 

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