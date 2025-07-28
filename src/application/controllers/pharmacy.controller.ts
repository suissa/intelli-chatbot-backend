import { FastifyRequest, FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/types';
import { PharmacyRepository } from '../../infrastructure/repositories/pharmacy.repository';
import { EvolutionClient } from "evolution-api-sdk";
import { DrugImageProcessorService } from '../../domain/services/drug-image-processor.service';
import { TextProcessorService } from '../../domain/services/text-processor.service';
import path from 'path';
import fs from 'fs';
import { OpenAIService } from '../../domain/services/openai.service';
import axios from 'axios';
import { OpenAI } from 'openai';

type ChatCompletionMessageParam = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const client = new EvolutionClient({
  serverUrl: "http://193.203.183.175:8080/",
  token: "429683C4C977415CAAFCCE10F7D57E11",
  instance: "advogados-help-bot", // optional
});

export interface PharmacyController {
  getAllPharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getPharmacyById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  getPharmacyByCNPJ(request: FastifyRequest<{ Params: { cnpj: string } }>, reply: FastifyReply): Promise<void>;
  getActivePharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getPharmaciesByCity(request: FastifyRequest<{ Params: { city: string } }>, reply: FastifyReply): Promise<void>;
  getPharmaciesByState(request: FastifyRequest<{ Params: { state: string } }>, reply: FastifyReply): Promise<void>;
  searchPharmacies(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply): Promise<void>;
  createPharmacy(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  deletePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  activatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  deactivatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>;
  setWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  webhook(request: FastifyRequest, reply: FastifyReply): Promise<void>;

}

@injectable()
export class PharmacyControllerImpl implements PharmacyController {
  private chatHistoryMap: Record<string, ChatCompletionMessageParam[]> = {}; // ✅ aqui

  constructor(
    @inject(TYPES.PharmacyRepository) private pharmacyRepository: PharmacyRepository,
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService,
    @inject(TYPES.DrugImageProcessorService) private drugImageProcessorService: DrugImageProcessorService,
    @inject(TYPES.TextProcessorService) private textProcessorService: TextProcessorService
  ) {}

  
  async setWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await client.webhook.set({
        url: "http://193.203.183.175:3000/api/pharmacies/webhook",
        webhook_by_events: false,
        events: [
          "MESSAGES_UPSERT",
          "MESSAGES_UPDATE",
          "CONNECTION_UPDATE",
          "CONTACTS_UPSERT",
        ],
        enabled: true,
      });
      reply.status(200).send({
        success: true,
        message: 'Webhook set successfully'
      });
    } catch (error) {
      console.error('Error setting webhook:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to set webhook'
      });
    }
  }

  async getAllPharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const pharmacies = await this.pharmacyRepository.getAllPharmacies();
      
      reply.send({
        success: true,
        data: pharmacies,
        count: pharmacies.length,
        message: 'Pharmacies retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching all pharmacies:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacies'
      });
    }
  }

  async getPharmacyById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const pharmacy = await this.pharmacyRepository.getPharmacyById(id);
      
      if (!pharmacy) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: pharmacy,
        message: 'Pharmacy found successfully'
      });
    } catch (error) {
      console.error('Error fetching pharmacy by ID:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacy'
      });
    }
  }


  async webhook(
    request: FastifyRequest<{ Body: Record<string, any> }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // console.log(request.body);
      // const pharmacy = await this.pharmacyRepository.getPharmacyByCNPJ(cnpj);
    
      if (request.body?.event === "messages.upsert") {
        // console.log("request.body", request.body);
        // if (request.body?.data?.key?.fromMe === true) {
        //   return;
        // }
        // console.log("request.body?.data", request.body?.data);
        // console.log("request.body?.data?.key", request.body?.data?.key);
        
        // console.log("request.body?.data.message", request.body?.data.message);
        if (request.body?.data?.key?.fromMe === true) {
          const messageType = request.body?.data?.messageType;
          console.log("request.body?.data", request.body?.data);
          console.log("request.body?.data?.key", request.body?.data?.key);
          
          console.log("request.body?.data.message", request.body?.data.message);
          console.log("request.body?.data.messageType", request.body?.data.messageType);

          const number = request.body?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '');
          const history = this.chatHistoryMap[number] || [];

          if (messageType === "imageMessage") {
            const image = request.body?.data?.message?.imageMessage;
            // salve a img com Date.now convertemndo uma string base64 em jpg
            const imageBuffer = Buffer.from(image, "base64");
            const imagePath = path.join(process.cwd(), "temp", `${Date.now()}.jpg`);
            fs.writeFileSync(imagePath, imageBuffer);
            const drugInfo = await this.drugImageProcessorService.processDrugImage(imagePath);
            console.log("drugInfo", drugInfo);
            // fs.unlinkSync(imagePath);
            const response = await this.openaiService.queryProduct(drugInfo.drugInfo || '');
            console.log("response da image", response);

            await client.messages.sendText({
              number: request.body?.data?.message?.from?.id,
              text: 'teste 123 ',
            });
          } 
          
          if (messageType === "conversation") {
            const messageText = request.body?.data?.message?.conversation;
            console.log("messageText", messageText);
            history.push({ role: 'user', content: messageText, name: 'user' }); // ✅ adiciona input do usuário

            const response = await this.openaiService.queryProduct(messageText || '', history);
            console.log("response da messageText", response);

            let replyText = '';

            if (Array.isArray(response)) {
              // é um array de Remedio
              replyText = '📦 Produtos encontrados:\n' + response.map(r => `• ${r.nome}`).join('\n');
            } else if (response && 'content' in response) {
              // é um objeto com campo content
              replyText = response.content || '';
              
            } else {
              replyText = '❌ Desculpe, não consegui entender sua solicitação.';
            }
            history.push({ role: 'assistant', content: replyText, name: 'assistant' });
            console.log("history", history);
            console.log("replyText", replyText);
            await client.messages.sendText({
              number: '5515991957645', // || request.body?.data?.key.remoteJid,
              text: replyText || 'teste 123 ',
            });
          }
          // else {
            
          //   console.log(request.body?.data?.message);
          //   let messageText = request.body?.data?.message?.conversation ||
          //     request.body?.data?.message?.extendedTextMessage?.text ||
          //     request.body?.data?.message?.ephemeralMessage?.message?.extendedTextMessage?.text;
          //   console.log(messageText);
            
          //   const response = await this.openaiService.queryProduct(messageText || '');
          //   console.log("response da messageText", response);

          //   await client.messages.sendText({
          //     number: request.body?.data?.message?.from?.id,
          //     text: 'teste 123 ',
          //   });
          // }
        }
        // if (messageType === "textMessage") {
        //   const text = request.body?.data?.message?.textMessage;
        //   console.log(text);
        // }
        // const message = request.body?.data?.message;
        // const pharmacy = await this.pharmacyRepository.getPharmacyByCNPJ(message?.from?.id);
        // if (pharmacy) {
        //   await this.pharmacyRepository.updatePharmacy(pharmacy.id, { lastMessage: message } as any);
        // }
      }
    } catch (error) {
      console.error('Error webhook:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacy'
      });
    }
  }

  async getPharmacyByCNPJ(request: FastifyRequest<{ Params: { cnpj: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { cnpj } = request.params;
      const pharmacy = await this.pharmacyRepository.getPharmacyByCNPJ(cnpj);
      
      if (!pharmacy) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with CNPJ ${cnpj} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: pharmacy,
        message: 'Pharmacy found successfully'
      });
    } catch (error) {
      console.error('Error fetching pharmacy by CNPJ:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacy'
      });
    }
  }

  async getActivePharmacies(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const pharmacies = await this.pharmacyRepository.getActivePharmacies();
      
      reply.send({
        success: true,
        data: pharmacies,
        count: pharmacies.length,
        message: 'Active pharmacies retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active pharmacies:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch active pharmacies'
      });
    }
  }

  async getPharmaciesByCity(request: FastifyRequest<{ Params: { city: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { city } = request.params;
      const pharmacies = await this.pharmacyRepository.getPharmaciesByCity(city);
      
      reply.send({
        success: true,
        data: pharmacies,
        count: pharmacies.length,
        city,
        message: `Found ${pharmacies.length} pharmacies in ${city}`
      });
    } catch (error) {
      console.error('Error fetching pharmacies by city:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacies by city'
      });
    }
  }

  async getPharmaciesByState(request: FastifyRequest<{ Params: { state: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { state } = request.params;
      const pharmacies = await this.pharmacyRepository.getPharmaciesByState(state);
      
      reply.send({
        success: true,
        data: pharmacies,
        count: pharmacies.length,
        state,
        message: `Found ${pharmacies.length} pharmacies in ${state}`
      });
    } catch (error) {
      console.error('Error fetching pharmacies by state:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch pharmacies by state'
      });
    }
  }

  async searchPharmacies(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { q } = request.query;
      
      if (!q || q.trim().length === 0) {
        reply.status(400).send({
          success: false,
          error: 'Search term required',
          message: 'Please provide a search term'
        });
        return;
      }

      const pharmacies = await this.pharmacyRepository.searchPharmacies(q);
      
      reply.send({
        success: true,
        data: pharmacies,
        count: pharmacies.length,
        searchTerm: q,
        message: `Found ${pharmacies.length} pharmacies matching "${q}"`
      });
    } catch (error) {
      console.error('Error searching pharmacies:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search pharmacies'
      });
    }
  }

  async createPharmacy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const pharmacyData = request.body as any;
      const pharmacy = await this.pharmacyRepository.createPharmacy(pharmacyData);
      
      reply.status(201).send({
        success: true,
        data: pharmacy,
        message: 'Pharmacy created successfully'
      });
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create pharmacy'
      });
    }
  }

  async updatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const updates = request.body as any;
      
      const pharmacy = await this.pharmacyRepository.updatePharmacy(id, updates);
      
      if (!pharmacy) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        data: pharmacy,
        message: 'Pharmacy updated successfully'
      });
    } catch (error) {
      console.error('Error updating pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update pharmacy'
      });
    }
  }

  async deletePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const deleted = await this.pharmacyRepository.deletePharmacy(id);
      
      if (!deleted) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Pharmacy deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete pharmacy'
      });
    }
  }

  async activatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const activated = await this.pharmacyRepository.activatePharmacy(id);
      
      if (!activated) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Pharmacy activated successfully'
      });
    } catch (error) {
      console.error('Error activating pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to activate pharmacy'
      });
    }
  }

  async deactivatePharmacy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params;
      const deactivated = await this.pharmacyRepository.deactivatePharmacy(id);
      
      if (!deactivated) {
        reply.status(404).send({
          success: false,
          error: 'Pharmacy not found',
          message: `Pharmacy with ID ${id} not found`
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Pharmacy deactivated successfully'
      });
    } catch (error) {
      console.error('Error deactivating pharmacy:', error);
      reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Failed to deactivate pharmacy'
      });
    }
  }
} 