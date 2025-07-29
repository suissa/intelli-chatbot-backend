import { SpeechEstimator } from "../services/speech-estimator";
import path from "path";
import fs from "fs";
import { DrugImageProcessorServiceImpl } from "../services/drug-image-processor.service";
import { DrugsRepository } from "../../infrastructure/repositories/drugs.repository";
import { TYPES } from "../../shared/types";
import { inject } from "inversify";
import { OCRService } from "../services/ocr";
import { OpenAIService } from "../services/openai.service";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";

const drugImageProcessorService = new DrugImageProcessorServiceImpl(
  new DrugsRepository(), new OCRService(), new OpenAIService(new DrugsRepository()));

export function getNumber(request: any) {
  return request.body?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '');
}

export function getFrom(request: any) {
  return request.body?.data?.key?.remoteJid;
}

export function getSender(request: any) {
  return request.body?.sender;
}

export function getFromMe(request: any) {
  return request.body?.data?.key?.fromMe;
}

export function getMessage(request: any) {
  return request.body?.data?.message;
}
export function getMessageType(request: any) {
  return request.body?.data?.messageType;
}
export function getBase64(request: any) {
  return request.body?.data?.message?.base64;
}
export function getCaption(request: any) {
  return request.body?.data?.message?.imageMessage?.caption;
}
export async function handleImageMessage(request: any, 
  client: any, 
  history: Array<any>,
  chatHistoryMap: ChatCompletionMessageParam[] | undefined,
  pharmacyClient: any) {
  const number = getNumber(request);
  const from = getFrom(request);
  await client.chats.updatePresence({
    number: number,
    presence: "composing",
    duration: 10000,
    delay: 10000,
  });
  // console.log("request.body?.data?.message", request.body?.data?.message);
  const image = request.body?.data?.message?.base64;
  // console.log("request.body?.data?.message?.imageMessage", request.body?.data?.message?.imageMessage);
  // console.log("image", image);
  // salve a img com Date.now convertemndo uma string base64 em jpg
  const imageBuffer = Buffer.from(image, "base64");
  const caption = request.body?.data?.message?.imageMessage?.caption || '';
  const imagePath = path.join(process.cwd(), "temp", `${Date.now()}.jpg`);
  fs.writeFileSync(imagePath, imageBuffer); // fs é o módulo de sistema de arquivos do Node.js



  //precisa pegar a ultima mensagem do assistant
  const assistantMessage = history.some(
    msg =>
      msg.role === 'assistant' &&
      typeof msg.content === 'string' &&
      msg.content.toLowerCase().includes('basta enviar o pix para a chave')
  );
  
  console.log("assistantMessage", assistantMessage);
  if (assistantMessage) {
    
    const pix = await  drugImageProcessorService.processPixImage(imagePath);
    console.log("pix", pix);
    console.log("pix.pixInfo.valor", pix.pixInfo.valor);
    const pixValueImage = (pharmacyClient[number].pixValue && typeof pharmacyClient[number].pixValue === 'number') ? pharmacyClient[number].pixValue : Number(pharmacyClient[number].pixValue?.toString().replace(',', '.'));
    console.log("pixValueImage", pixValueImage);
    if (Number(pixValueImage) === Number(pharmacyClient[number].pixValue)) {
      console.log("PIX PAGO CARAIIIII");
      // history.push({ role: 'user', content: pixInfo.valor, name: 'user' }); // ✅ adiciona input do usuário
      
      // dar baixa no estoque

      
      await client.messages.sendText({
        number: from,
        text: '👩🏻‍🦰 Pagamento confirmado! Valor: R$ ' + pix.pixInfo.valor + '. Muito obrigado.',
      });
      return;
    }

    await client.messages.sendText({
      number: from,
      text: '👩🏻‍🦰 Não foi possível identificar o pagamento. Tente novamente.',
    });
    return;
  } else {
    
    const drugInfo = await this.drugImageProcessorService.processDrugImage(imagePath);
    console.log("drugInfo", drugInfo);
    // console.log("history user", history);
    // fs.unlinkSync(imagePath);
    const response = await this.openaiService.queryProduct(drugInfo.drugInfo || '', history);
    console.log("response da image", response);
    


    if (response && 'content' in response) {
      history.push({ role: 'user', content: drugInfo.drugInfo || 'sem informação da imagem', name: 'user' }); // ✅ adiciona input do usuário
    
      history.push({ role: 'assistant', content: response?.content || '', name: 'assistant' }); // ✅ adiciona input do usuário
      // console.log("history image", history);
      
      chatHistoryMap[number] = history;
        await client.messages.sendText({
          number: from,
          text: "👩🏻‍🦰 " + response?.content,
        });
      }
      
    }
    return;
  }



export async function handleTextMessage(request: any, client: any, history: Array<any>) {
  const number = request.body?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '');
  const from = request.body?.data?.key?.remoteJid;
  const message = request.body?.data?.message?.text;
  console.log("message", message);
}

export async function handleAudioMessage(request: any, 
  client: any, 
  history: Array<any>,
  chatHistoryMap: ChatCompletionMessageParam[] | undefined,
  pharmacyClient: any) {
  
  if (this.lastBase64Audio === request.body?.data?.message?.base64) {
    return;
  }
  // console.log("request.body?.data?.message", request.body?.data?.message);
  const image = request.body?.data?.message?.base64;
  this.lastBase64Audio = image;
  // console.log("request.body?.data?.message?.imageMessage", request.body?.data?.message?.imageMessage);
  // console.log("image", image);
  // salve a img com Date.now convertemndo uma string base64 em jpg
  const oggPath = await this.saveOggFile(image);
  // const caption = request.body?.data?.message?.imageMessage?.caption || '';
  // const imagePath = path.join(process.cwd(), "temp", `${Date.now()}.jpg`);
  // const transcription = await this.openaiService.transcribeAudio(oggPath);
  // console.log("transcription", transcription);
  // fs.writeFileSync(imagePath, imageBuffer);
  const audioConverter = new AudioConverter();
  const mp3Path = await audioConverter.convertToMp3(oggPath);
  const drugInfo = await this.openaiService.transcribeAudio(mp3Path.convertedPath);
  console.log("audioMessage drugInfo", drugInfo);
  // fs.unlinkSync(imagePath);
  const response = await this.openaiService.queryProduct(drugInfo || '', history);
  console.log("response da audio", response);// ✅ adiciona input do usuário
  // console.log("response da image", response);
  if (response && 'content' in response) {
    
    history.push({ role: 'user', content: drugInfo || 'sem informação da imagem', name: 'user' }); 
    history.push({ role: 'assistant', content: response?.content || '', name: 'assistant' }); // ✅ adiciona input do usuário
    // console.log("history audio", history);
    const hasChavePix = response?.content?.toLowerCase().includes('chave pix');
    
    console.log("hasChavePix", hasChavePix);
    if (hasChavePix) {
      const regexValorPix = /(?:R\$|reais)?\s?([\d,.]{2,})/gi;
      const match = response?.content?.match(regexValorPix);
      if (match) {
        pharmacyClient[number].pixValue = Number(match[0].replace('R$', '').replace('reais', '').replace(',', '.'));
      }
      await client.chats.updatePresence({
        number: number,
        presence: "composing",
        duration: 5000,
        delay: 5000,
      });
      await client.messages.sendText({
        number: from, // || request.body?.data?.key.remoteJid,
        text: "👩🏻‍🦰 " + response?.content,
      });
      return;
    }

    const delayOfSpeech = SpeechEstimator.estimateTranscriptionTime(response?.content || '', 'gpt-4o-transcribe');
    console.log("delayOfSpeech", delayOfSpeech);

    await client.chats.updatePresence({
      number: number,
      presence: "recording",
      duration: delayOfSpeech*1000,
      delay: delayOfSpeech*1000,
    }); 
    const speech = await this.openaiService.createSpeech(response?.content || '');
    console.log("speech", speech.substring(0, 100));
    this.chatHistoryMap[number] = history;
    await client.messages.sendVoice({
      number: from,
      audio: speech,
      encoding: true,
    });
  }
}