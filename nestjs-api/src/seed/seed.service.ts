/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class AiSeedService {
  private readonly apiKey = process.env.GEMINI_API_KEY;

  private readonly PROVEN_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
  ];

  private readonly CATEGORY_IMAGES = {
    tech: [
      'photo-1518770660439-4636190af475', // Circuitos
      'photo-1550751827-4bd374c3f58b', // Segurança Digital
      'photo-1519389950473-47ba0277781c', // Trabalho em equipe Tech
    ],
    music: [
      'photo-1514525253361-bee87184919a', // Concerto/Show
      'photo-1470225620780-dba8ba36b745', // DJ/Música Eletrônica
      'photo-1511671782779-c97d3d27a1d4', // Microfone/Jazz
    ],
    food: [
      'photo-1504674900247-0877df9cc836', // Prato Gourmet
      'photo-1555939594-58d7cb561ad1', // Churrasco/Grelha
      'photo-1414235077428-338989a2e8c0', // Restaurante Fino
    ],
    party: [
      'photo-1492684223066-81342ee5ff30', // Celebração
      'photo-1516450360452-9312f5e86fc7', // Balada/Luzes
      'photo-1533174072545-7a4b6ad7a6c3', // Noite de festa
    ],
    culture: [
      'photo-1460661419201-fd4cecdf8a8b', // Arte/Pintura
      'photo-1533105079780-92b9be482077', // Festival de Rua
      'photo-1533551268962-824e232f7ee1', // Arquitetura/História
    ],
  };

  constructor(private eventsService: EventsService) {}

  async listAvailableModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.models) {
        console.log('--- MODELOS DISPONÍVEIS ---');
        data.models.forEach((model) => {
          console.log(
            `ID: ${model.name} | Métodos: ${model.supportedGenerationMethods.join(', ')}`,
          );
        });
        console.log('---------------------------');
      } else {
        console.error('[DEBUG] Erro ao listar modelos:', data);
      }
    } catch (error) {
      console.error('[DEBUG] Erro de rede ao listar modelos:', error.message);
    }
  }

  private async tryGenerateWithFallbackModels(prompt: string) {
    for (const modelId of this.PROVEN_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        const result = await response.json();
        if (response.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
          return result.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        continue;
      }
    }
    throw new Error('Nenhum modelo disponível aceitou a requisição.');
  }

  async seedEventsForLocation(city: string, state: string, country: string) {
    let eventsData;

    try {
      const prompt = `Gere um array JSON com 5 eventos fictícios realistas para ${city}, ${state}, ${country}.
      Use nomes de ruas reais. Retorne um JSON puro: [{"title": "...", "description": "...", "street": "...", "category": "tech ou music ou food ou party ou culture"}]`;

      const rawResponse = await this.tryGenerateWithFallbackModels(prompt);
      const jsonMatch =
        rawResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
        rawResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
      const jsonString = Array.isArray(jsonMatch)
        ? jsonMatch[1] || jsonMatch[0]
        : rawResponse;
      eventsData = JSON.parse(jsonString.trim());
    } catch (error) {
      console.error(
        `[SEED] Erro na geração automatica de eventos: ${error.message}`,
      );
    }

    const createdEvents = [];

    for (const eventInfo of eventsData) {
      try {
        const categoryKey = (eventInfo.category || 'party').toLowerCase();
        const availableImages =
          this.CATEGORY_IMAGES[categoryKey] || this.CATEGORY_IMAGES.party;

        const imageId =
          availableImages[Math.floor(Math.random() * availableImages.length)];

        const imageUrl = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1200&q=80`;

        const creatorId = 'c7309829-6500-445b-a3b5-bc48db4cd8e3';

        const newEventData = {
          title: eventInfo.title,
          description: eventInfo.description,
          date: new Date(
            Date.now() + (Math.random() * 15 + 2) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          price: parseFloat((Math.random() * 60).toFixed(2)),
          maxAttendees: Math.floor(Math.random() * 100) + 50,
          address: JSON.stringify({
            street: eventInfo.street,
            city,
            state,
            country,
            zipCode: '',
            neighborhood: '',
          }),
        };

        const newEvent = await this.eventsService.create(
          newEventData as any,
          creatorId,
          imageUrl,
        );
        createdEvents.push(newEvent);
        console.log(
          `[SEED] Sucesso: Evento "${eventInfo.title}" criado com imagem curada da categoria ${categoryKey}.`,
        );
      } catch (error) {
        console.error(`[SEED] Erro ao salvar: ${error.message}`);
      }
    }

    return createdEvents;
  }
}
