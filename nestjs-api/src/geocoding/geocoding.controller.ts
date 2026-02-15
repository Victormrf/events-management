import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { AiSeedService } from 'src/seed/seed.service';
import { EventsService } from 'src/events/events.service';

@Controller('geocoding')
export class GeocodingController {
  constructor(
    private readonly geocodingService: GeocodingService,
    private readonly aiSeedService: AiSeedService,
    private readonly eventsService: EventsService,
  ) {}

  @Get('search')
  async searchCoordinates(
    @Query('street') street: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('country') country: string,
  ) {
    if (!street || !city || !state || !country) {
      throw new BadRequestException(
        'Todos os campos de endereço são obrigatórios para a busca.',
      );
    }

    const coords = await this.geocodingService.getCoordinates({
      street,
      city,
      state,
      country,
    });

    if (!coords) {
      throw new BadRequestException(
        'Não foi possível encontrar as coordenadas para este endereço.',
      );
    }

    return coords;
  }

  @Get('search-by-query')
  async searchCoordinatesByQuery(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException(
        'O campo de consulta é obrigatório para a busca.',
      );
    }

    const coords = await this.geocodingService.getCoordinatesByQuery(query);

    if (!coords) {
      throw new BadRequestException(
        'Não foi possível encontrar as coordenadas para esta consulta.',
      );
    }

    return coords;
  }

  @Get('nearby')
  async getNearbyEvents(
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('country') country: string,
  ) {
    const events = await this.eventsService.findAllByCity(city);

    if (events.length === 0) {
      return this.aiSeedService.seedEventsForLocation(city, state, country);
    }

    return events;
  }
}
