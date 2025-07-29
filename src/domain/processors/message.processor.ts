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
import { AudioConverter } from '../services/audio.converter.service';
import { EvolutionClient } from "evolution-api-sdk";


export const clientEvo = new EvolutionClient({
  serverUrl: "http://193.203.183.175:8080/",
  token: "429683C4C977415CAAFCCE10F7D57E11",
  instance: "suissera", // optional
});

const drugImageProcessorService = new DrugImageProcessorServiceImpl(
  new DrugsRepository(), new OCRService(), new OpenAIService(new DrugsRepository()));
const openaiService = new OpenAIService(new DrugsRepository());
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
  history: Array<any>,
  chatHistoryMap: ChatCompletionMessageParam[] | undefined,
  pharmacyClient: any) {
  const number = getNumber(request);
  const from = getFrom(request);
  await clientEvo.chats.updatePresence(number, {
    presence: "composing",
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
    const pixValueImage = (pharmacyClient.pixValue && typeof pharmacyClient.pixValue === 'number') ? pharmacyClient.pixValue : Number(pharmacyClient.pixValue?.toString().replace(',', '.'));
    console.log("pixValueImage", pixValueImage);
    if (Number(pixValueImage) === Number(pharmacyClient.pixValue)) {
      console.log("PIX PAGO CARAIIIII");
      // history.push({ role: 'user', content: pixInfo.valor, name: 'user' }); // ✅ adiciona input do usuário
      
      // dar baixa no estoque

      
      await clientEvo.messages.sendText({
        number: from,
        text: '👩🏻‍🦰 Pagamento confirmado! Valor: R$ ' + pix.pixInfo.valor + '. Muito obrigado.',
      });
      return;
    }

    await clientEvo.messages.sendText({
      number: from,
      text: '👩🏻‍🦰 Não foi possível identificar o pagamento. Tente novamente.',
    });
    return;
  } else {
    
    const drugInfo = await drugImageProcessorService.processDrugImage(imagePath);
    console.log("drugInfo", drugInfo);
    // console.log("history user", history);
    // fs.unlinkSync(imagePath);
    const response = await openaiService.queryProduct(drugInfo.drugInfo || '', history);
    console.log("response da image", response);
    


    if (response && 'content' in response) {
      history.push({ role: 'user', content: drugInfo.drugInfo || 'sem informação da imagem', name: 'user' }); // ✅ adiciona input do usuário
    
      history.push({ role: 'assistant', content: response?.content || '', name: 'assistant' }); // ✅ adiciona input do usuário
      // console.log("history image", history);
      
      if (chatHistoryMap) {
          chatHistoryMap = history as ChatCompletionMessageParam[];
      }
        await clientEvo.messages.sendText({
          number: from,
          text: "👩🏻‍🦰 " + response?.content,
        });
      }
      
    }
    return;
  }



export async function handleTextMessage(request: any, 
  history: Array<any>,
  chatHistoryMap: ChatCompletionMessageParam[] | undefined,
  pharmacyClient: any) {
  const number = getNumber(request);
  const from = getFrom(request);
  const message = getMessage(request);
  console.log("message", message);
  await clientEvo.chats.updatePresence(number, {
      presence: "composing",
    delay: 10000,
  });
  const messageText = getMessage(request);
  console.log("messageText", messageText);

  if (messageText == '') {
    console.log("messageText vazio");
    return;
  }
  const response = await openaiService.queryProduct(messageText || '', history);
  console.log("response da messageText", response);

  if (response === false) {
    console.log("textMessage response false");
    return;
  }

  let replyText = '';

  if (Array.isArray(response)) {
    // é um array de Remedio
    replyText = '👩🏻‍🦰 Produtos encontrados:\n' + response.map(r => `• ${r.nome}`).join('\n');
  } else if (response && 'content' in response) {
    // é um objeto com campo content
    replyText = response.content;
    
  } else {
    replyText = '👩🏻‍🦰 Desculpe, não consegui entender sua solicitação.';
  }
  history.push({ role: 'user', content: messageText, name: 'user' }); // ✅ adiciona input do usuário
  history.push({ role: 'assistant', content: replyText, name: 'assistant' });
  // console.log("history", history);
  console.log("replyText", replyText);
  if (chatHistoryMap) {
    chatHistoryMap = history as ChatCompletionMessageParam[];
  }

  
  await clientEvo.messages.sendText({
    number: from, // || request.body?.data?.key.remoteJid,
    text: "👩🏻‍🦰 " + replyText,
  });
}



export async function saveOggFile(base64String: string): Promise<string> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const tempDir = path.join(process.cwd(), 'temp');
    const filename = `${Date.now()}.ogg`;
    // Criar diretório temp se não existir
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, filename);
    

    // Verifique se base64String é uma string válida
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('base64String inválido ou indefinido');
    }

    // Verifique se filePath é uma string válida
    if (!tempFilePath || typeof tempFilePath !== 'string') {
      throw new Error('filePath inválido ou indefinido');
    }


    // Converta a string base64 para Buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Salve o arquivo
    await fs.writeFileSync(tempFilePath, buffer);
    console.log('Arquivo .ogg salvo com sucesso em', tempFilePath);
    return tempFilePath;
  } catch (err) {
    console.error('Erro ao salvar o arquivo:', err);
    return '';
  }
}


export async function handleAudioMessage(request: any, 
  history: Array<any>,
  chatHistoryMap: ChatCompletionMessageParam[] | undefined,
  pharmacyClient: any) {
  
  if (pharmacyClient.lastBase64Audio === request.body?.data?.message?.base64) {
    return;
  }

  const number = getNumber(request);
  const from = getFrom(request);
  // console.log("request.body?.data?.message", request.body?.data?.message);
  const image = request.body?.data?.message?.base64;
  pharmacyClient.lastBase64Audio = image;
  // console.log("request.body?.data?.message?.imageMessage", request.body?.data?.message?.imageMessage);
  // console.log("image", image);
  // salve a img com Date.now convertemndo uma string base64 em jpg
  const oggPath = await saveOggFile(image);
  // const caption = request.body?.data?.message?.imageMessage?.caption || '';
  // const imagePath = path.join(process.cwd(), "temp", `${Date.now()}.jpg`);
  // const transcription = await this.openaiService.transcribeAudio(oggPath);
  // console.log("transcription", transcription);
  // fs.writeFileSync(imagePath, imageBuffer);
  const audioConverter = new AudioConverter();
  const mp3Path = await audioConverter.convertToMp3(oggPath);
  const drugInfo = await openaiService.transcribeAudio(mp3Path.convertedPath);
  console.log("audioMessage drugInfo", drugInfo);
  // fs.unlinkSync(imagePath);
  const response = await openaiService.queryProduct(drugInfo || '', history);
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
        pharmacyClient.pixValue = Number(match[0].replace('R$', '').replace('reais', '').replace(',', '.'));
      }
      await clientEvo.chats.updatePresence(number, {
        presence: "composing",
        delay: 5000,
      });
      await clientEvo.messages.sendText({
        number: from, // || request.body?.data?.key.remoteJid,
        text: "👩🏻‍🦰 " + response?.content,
      });
      return;
    }

    const delayOfSpeech = SpeechEstimator.estimateTranscriptionTime(response?.content || '', 'gpt-4o-transcribe');
    console.log("delayOfSpeech", delayOfSpeech);

    await clientEvo.chats.updatePresence(number,      {
      presence: "recording",
      delay: delayOfSpeech*1000,
    }); 
    const speech = await openaiService.createSpeech(response?.content || '');
    console.log("speech", speech.substring(0, 100));
    if (chatHistoryMap) {
      chatHistoryMap = history as ChatCompletionMessageParam[];
    }
    await clientEvo.messages.sendVoice({
      number: from,
      audio: speech,
      encoding: true,
    });
  }
}