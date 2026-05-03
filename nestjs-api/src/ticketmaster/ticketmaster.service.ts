import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { TicketmasterEventDto } from './dto/create-ticketmaster-event';

@Injectable()
export class TicketmasterService {
  private readonly logger = new Logger(TicketmasterService.name);
  private readonly apiKey = process.env.TICKETMASTER_API_KEY;
  private readonly baseUrl = 'https://app.ticketmaster.com/discovery/v2';

  constructor(private eventsService: EventsService) {}

  async getEventsFromTicketmaster(city: string  , state: string, country: string) {
    
    if (!this.apiKey) {
      this.logger.warn('Ticketmaster API Key não configurada.');
      return [];
    }

    const countryCode = country.toLowerCase() === 'brasil' ? 'BR' : 'US';
    const url = `${this.baseUrl}/events.json?city=${encodeURIComponent(city)}&countryCode=${countryCode}&apikey=${this.apiKey}&size=5`;

    this.logger.log(`Buscando eventos no Ticketmaster para: ${city}, ${state}, ${country}`);
    this.logger.log(`URL da requisição: ${url.replace(this.apiKey, '***')}`); // Mascarando API KEY por segurança

    try {
      const response = await fetch(url);
      this.logger.log(`Status da resposta do Ticketmaster: ${response.status}`);
      
      const data = await response.json();

      if (!data._embedded || !data._embedded.events) {
        this.logger.warn(`Nenhum evento encontrado no Ticketmaster. Resposta da API: ${JSON.stringify(data).substring(0, 500)}`);
        return [];
      }

      const rawEvents = data._embedded.events;
      this.logger.log(`Encontrados ${rawEvents.length} eventos no Ticketmaster.`);
      
      const processedEvents = [];

      for (const tmEvent of rawEvents) {
        try {
          // Verifica duplicidade usando o id do TM
          const existingEvent = await this.eventsService.findByExternalId(tmEvent.id);
          if (existingEvent) {
            this.logger.debug(`Evento ${tmEvent.id} já existe no banco. Pulando...`);
            continue;
          }

          // Mapper
          const venue = tmEvent._embedded?.venues?.[0];
          
          const eventData = {
            title: tmEvent.name,
            description: tmEvent.info || tmEvent.pleaseNote || 'Evento importado via Ticketmaster.',
            date: tmEvent.dates.start.dateTime || new Date().toISOString(),
            price: tmEvent.priceRanges ? tmEvent.priceRanges[0].min : 0,
            maxAttendees: 500,
            address: JSON.stringify({
              street: venue?.address?.line1 || 'Endereço não informado',
              city: venue?.city?.name || city,
              state: venue?.state?.stateCode || state,
              country: venue?.country?.name || country,
              neighborhood: venue?.name || '',
              zipCode: venue?.postalCode || '',
            }),
          };

          const imageUrl = tmEvent.images.find(img => img.ratio === '16_9')?.url || tmEvent.images[0].url;
          const systemCreatorId = 'c7309829-6500-445b-a3b5-bc48db4cd8e3';

          const newEvent = await this.eventsService.create(eventData as any, systemCreatorId, imageUrl, tmEvent.id);
          processedEvents.push(newEvent);
        } catch (err) {
          this.logger.error(`Erro ao processar evento individual do TM: ${err.message}`);
        }
      }

      return processedEvents;
    } catch (error) {
      this.logger.error(`Falha ao consultar Ticketmaster: ${error.message}`);
      return [];
    }
  }
}
