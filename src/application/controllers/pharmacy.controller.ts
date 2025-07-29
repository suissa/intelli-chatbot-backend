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
import { SpeechEstimator } from '../../domain/services/speech-estimator';

import { parse } from 'csv-parse/sync';
import { handleImageMessage, handleAudioMessage, handleTextMessage } from '../../domain/processors/message.processor';

type ChatCompletionMessageParam = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const client = new EvolutionClient({
  serverUrl: "http://193.203.183.175:8080/",
  token: "429683C4C977415CAAFCCE10F7D57E11",
  instance: "suissera", // optional
});

console.log("client", client);
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
  private lastBase64Audio: string = '';
  private pixValue: number = 0;
  private testNumbers: string[] = ['5515991957645', '556481178214', '556499238287'];
  private palavraLista: Set<string> = new Set();
  private pharmacyClients: Record<string, any> = {};
  constructor(
    @inject(TYPES.PharmacyRepository) private pharmacyRepository: PharmacyRepository,
    @inject(TYPES.OpenAIService) private openaiService: OpenAIService,
    @inject(TYPES.DrugImageProcessorService) private drugImageProcessorService: DrugImageProcessorService,
    @inject(TYPES.TextProcessorService) private textProcessorService: TextProcessorService
  ) {
    this.pixValue = 20.00;
    this.testNumbers = ['5515991957645', '556481178214', '556499238287'];
    this.palavraLista = new Set(parse(fs.readFileSync('remedios_distinct.csv', 'utf8'), {
      columns: true,
      skip_empty_lines: true,
    }).map((row: any) => row?.nome?.toLowerCase()));
  }

  // async processPixImage(imagePath: string): Promise<void> {
  //   const drugInfo = await this.drugImageProcessorService.processPixImage(imagePath);
  //   console.log("drugInfo", drugInfo);
  // }

  
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
      // const pharmacy = await this.pharmacyRepository.getPharmacyByCNPJ(cnpj);

      // if (from !== '556499238287@s.whatsapp.net'  && from !== '55991957645@s.whatsapp.net') {
      //   return;
      // }
      console.log("1) request.body?.data?.key", request.body?.data?.key);
      // console.log("request.body", request.body);
      console.log("request.body?.event", request.body?.event);
      if (request.body?.event === "messages.upsert") {
        console.log("request.body?.data", request.body?.data);
        const from = request.body?.data?.key?.remoteJid;
        if (from === '55991957645@s.whatsapp.net') {
          this.pharmacyClients[from] = this.pharmacyClients[from] || {
            pixValue: 0,
            history: [],
            chatHistoryMap: [],
            lastBase64Audio: '',
          };
          console.log("ENTREI NJO FONE", request.body);
          // if (request.body?.data?.key?.fromMe === true) {
          //   return;
          // }
          // console.log("request.body?.data", request.body?.data);
          // console.log("request.body?.data?.key", request.body?.data?.key);
          
          // console.log("request.body?.data.message", request.body?.data.message);
          if (request.body?.data?.key?.remoteJid?.includes("@g.us")) {
            console.log("Skipping group message");
            return;
          } 
          console.log("_____________________________________________________");
          const pushName = request.body?.data?.pushName;
          console.log("pushName", pushName);
          const sender = request.body?.sender;
          console.log("sender", sender);
          console.log("from", from);
          if (from === '556499238287@s.whatsapp.net') {
            console.log("MENSAGEM DO CAIO", from);
            const messageType = request.body?.data?.messageType;
            console.log("2) request.body?.data?.key", request.body?.data?.key);

            const number = request.body?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '');
            const history = this.chatHistoryMap[number] || [];
            const historySize = 50;
            if (history.length > historySize) {
              history.splice(0, history.length - historySize);
            }
            
            console.log('🧠 Histórico carregado:', this.chatHistoryMap[number]);
            console.log("messageType:", messageType);
            if (messageType === "imageMessage") {
              await handleImageMessage(request, client, history, this.chatHistoryMap[number], this.pharmacyClients[from]);

            } 
            if (messageType === "audioMessage") {
              
              await handleAudioMessage(request, client, history, this.chatHistoryMap[number], this.pharmacyClients[from]);

           
                  
            } 

            if (messageType === "conversation") {
              console.log("messageType conversation");
              await handleTextMessage(request, client, history, this.chatHistoryMap[number], this.pharmacyClients[from]);
            }
          }
          
        }
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