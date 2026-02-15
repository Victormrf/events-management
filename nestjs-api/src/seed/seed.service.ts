import { Injectable } from '@nestjs/common';
import { CloudinaryStorageService } from 'src/events/cloudinary-storage.service';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiSeedService {
  private readonly apiKey = process.env.GEMINI_API_KEY;

  constructor(
    private prisma: PrismaService,
    private geocodingService: GeocodingService,
    private cloudinaryService: CloudinaryStorageService,
  ) {}

  async seedEventsForLocation(city: string, state: string, country: string) {
    // 1. Gerar Dados dos Eventos com Gemini
    const eventsData = await this.generateEventData(city, state, country);
    const createdEvents = [];
    for (const eventInfo of eventsData) {
      try {
        // 2. Gerar Imagem para o Evento com Imagen 4.0
        const imageBase64 = await this.generateImage(eventInfo.title);
        // 3. Upload para Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImageFromBase64(
          imageBase64,
          'events_ai_seeded',
        );
        // 4. Obter Coordenadas da rua sugerida pela AI
        const coords = await this.geocodingService.getCoordinates({
          street: eventInfo.street,
          city,
          state,
          country,
        });
        // 5. Salvar no Banco (Assumindo um usuário 'System' ou o próprio Admin)
        const newEvent = await this.prisma.event.create({
          data: {
            title: eventInfo.title,
            description: eventInfo.description,
            date: new Date(Date.now() + Math.random() * 1000000000), // Data futura aleatória
            price: (Math.random() * 100).toFixed(2),
            maxAttendees: Math.floor(Math.random() * 100) + 20,
            image: uploadResult.secure_url,
            creator: {
              connect: { email: 'admin@xplorehub.com' }, // Certifique-se que este usuário existe
            },
            address: {
              create: {
                street: eventInfo.street,
                city,
                state,
                country,
                lat: coords?.lat || null,
                lng: coords?.lng || null,
              },
            },
          },
        });
        createdEvents.push(newEvent);
      } catch (error) {
        console.error(`Erro ao gerar evento seed: ${eventInfo.title}`, error);
      }
    }
    return createdEvents;
  }
  private async generateEventData(
    city: string,
    state: string,
    country: string,
  ) {
    const prompt = `Gere 5 eventos fictícios mas realistas para a cidade de ${city}, ${state}, ${country}.
      Retorne APENAS um JSON seguindo este formato:
      [{"title": "Nome do Evento", "description": "Descrição chamativa", "street": "Nome de uma rua real nesta cidade"}]`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  private async generateImage(eventTitle: string) {
    const prompt = `A high-quality, professional event banner for an event titled "${eventTitle}". Modern aesthetic, vibrant colors, wide angle.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        instances: { prompt },
        parameters: { sampleCount: 1 },
      }),
    });
    const result = await response.json();
    return result.predictions[0].bytesBase64Encoded;
  }
}
