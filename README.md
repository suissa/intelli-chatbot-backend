# Pharma Intelli Chat Bot


## TO DO

- [x] Buscar o produto do combo no estoque
  - [x] Aceitar o combo
  - [x] Aceitar apenas o remédio
- [x] Perguntar por outro remédio mais barato
  - [x] Buscar se o produto correlacionado existe em estoque
- [x] Enviar uma imagem de remédio
  - [ ] Melhorar prompt com o caption, testar por ex: Quanto custa?
- [x] Enviar um áudio
  - [x] definir presence: recording
  - [x] definir delay: calcular um tempo médio da fala do texto + processamento da OpenAI 
- [] cache do remédio e suas respostas
- [] perguntar se prefere a coimunicação via texto ou áudio
- [] Responder um áudio com áudio e o remédio + preço por texto
- [x] Validar um comprovante de pagamento de pix
- [ ] Criar um link de pagamento e enviar a url no final

## Possíveis configurações

- quantidade de remédios retornados
- ordem dos remédios retornados
- filtro dos remédios retornados
  - preço mediano
  - maior lucro líquido
  - do menor preço
- tipo de interação
  - todos remédios
  - 1 por vez
    - envia o remédio que cabe por primeiro no filtro anterior
    - pergunta se é esse ou não
    - caso seja não, envia o próximo remédio da lista filtrada
    