import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class AiSeedService {
  private readonly apiKey = process.env.GEMINI_API_KEY;

  private readonly PROVEN_MODELS = [
    'gemini-2.5-flash', // Principal: Melhor equilíbrio entre inteligência e velocidade
    'gemini-2.5-flash-lite', // Fallback 1: Otimizado para latência e volume
    'gemini-2.0-flash', // Fallback 2: Versão estável anterior
    'gemini-2.0-flash-lite', // Fallback 3: Ultra-rápido
  ];

  private readonly STATIC_FALLBACKS = [
    {
      title: 'Juiz de Fora Tech Meetup',
      description:
        'Networking e palestras sobre o ecossistema de tecnologia em MG.',
      street: 'Rua Halfeld',
    },
    {
      title: 'Samba na Praça',
      description:
        'Evento cultural gratuito com músicos locais e gastronomia típica.',
      street: 'Praça da Estação',
    },
    {
      title: 'Workshop de Gastronomia Mineira',
      description: 'Aprenda os segredos do pão de queijo e doces tradicionais.',
      street: 'Avenida Rio Branco',
    },
  ];

  constructor(
    private eventsService: EventsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async listAvailableModels() {
    console.log('[DEBUG] Consultando modelos disponíveis via ListModels...');
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
        console.log(`[SEED] Tentando modelo: ${modelId}...`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const result = await response.json();

        if (response.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log(`[SEED] Sucesso com o modelo: ${modelId}`);
          return result.candidates[0].content.parts[0].text;
        }

        console.warn(
          `[SEED] Modelo ${modelId} falhou:`,
          result.error?.message || 'Erro de resposta',
        );
      } catch (e) {
        console.error(
          `[SEED] Erro de rede com o modelo ${modelId}:`,
          e.message,
        );
        continue;
      }
    }
    throw new Error(
      'Nenhum modelo compatível da lista PROVEN_MODELS aceitou a requisição.',
    );
  }

  async seedEventsForLocation(city: string, state: string, country: string) {
    let eventsData;

    try {
      const prompt = `Gere um array JSON com 3 eventos fictícios realistas para ${city}, ${state}.
      Use nomes de ruas reais. Formato: [{"title": "...", "description": "...", "street": "..."}]
      Retorne APENAS o JSON puro dentro de blocos de código markdown.`;

      const rawResponse = await this.tryGenerateWithFallbackModels(prompt);

      const jsonMatch =
        rawResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
        rawResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
      const cleanJson = jsonMatch
        ? Array.isArray(jsonMatch)
          ? jsonMatch[1] || jsonMatch[0]
          : jsonMatch
        : rawResponse;

      eventsData = JSON.parse(cleanJson.trim());
    } catch (error) {
      console.error(
        `[SEED] Falha total na IA: ${error.message}. Usando dados estáticos.`,
      );
      eventsData = this.STATIC_FALLBACKS;
    }

    const createdEvents = [];

    for (const eventInfo of eventsData) {
      try {
        const keywords = encodeURIComponent(`${eventInfo.title},party,event`);
        const randomSeed = Math.floor(Math.random() * 1000);
        const imageUrl = `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=${randomSeed}&keywords=${keywords}`;

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
        console.log(`[SEED] Evento criado com sucesso: ${eventInfo.title}`);
      } catch (error) {
        console.error(
          `[SEED] Erro ao salvar evento no banco: ${error.message}`,
        );
      }
    }

    return createdEvents;
  }
}
