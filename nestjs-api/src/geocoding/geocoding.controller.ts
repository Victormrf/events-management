import {
  Controller,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GeocodingService } from './geocoding.service';
import { AiSeedService } from 'src/seed/seed.service';
import { EventsService } from 'src/events/events.service';
import { TicketmasterService } from 'src/ticketmaster/ticketmaster.service';

@ApiTags('Geocoding')
@Controller('geocoding')
export class GeocodingController {
  private readonly logger = new Logger(GeocodingController.name);
  private readonly MIN_EVENTS_THRESHOLD = 5;

  constructor(
    private readonly geocodingService: GeocodingService,
    private readonly aiSeedService: AiSeedService,
    private readonly eventsService: EventsService,
    private readonly ticketmasterService: TicketmasterService,
  ) {}

  @ApiOperation({ summary: 'Search coordinates by address components' })
  @ApiQuery({ name: 'street', required: true, description: 'Street name' })
  @ApiQuery({ name: 'city', required: true, description: 'City name' })
  @ApiQuery({ name: 'state', required: true, description: 'State name' })
  @ApiQuery({ name: 'country', required: true, description: 'Country name' })
  @ApiResponse({ status: 200, description: 'Coordinates retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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

  @ApiOperation({ summary: 'Search coordinates by a generic query string' })
  @ApiQuery({ name: 'query', required: true, description: 'The address query string' })
  @ApiResponse({ status: 200, description: 'Coordinates retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
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

  @ApiOperation({ summary: 'Reverse geocode coordinates to an address' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, description: 'Longitude' })
  @ApiResponse({ status: 200, description: 'Address retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  @Get('reverse')
  async reverseGeocoding(@Query('lat') lat: string, @Query('lng') lng: string) {
    this.logger.log(
      `Recebida requisição reverse para lat: ${lat}, lng: ${lng}`,
    );

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException(
        'Latitude e Longitude devem ser números válidos.',
      );
    }

    const locationInfo = await this.geocodingService.getReverseGeocoding(
      latitude,
      longitude,
    );

    if (!locationInfo) {
      this.logger.error(
        `Falha no service para coordenadas: ${latitude}, ${longitude}`,
      );
      throw new NotFoundException(
        'Endereço não identificado para estas coordenadas.',
      );
    }

    return locationInfo;
  }

  @ApiOperation({ summary: 'Get nearby events for a location, automatically seeding if necessary' })
  @ApiQuery({ name: 'city', required: true, description: 'City name' })
  @ApiQuery({ name: 'state', required: false, description: 'State name' })
  @ApiQuery({ name: 'country', required: false, description: 'Country name' })
  @ApiResponse({ status: 200, description: 'Nearby events retrieved successfully.' })
  @Get('nearby')
  async getNearbyEvents(
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('country') country: string,
  ) {
    if (!city) throw new BadRequestException('Cidade é obrigatória.');

    this.logger.log(`[NEARBY] Processando busca agregada para: ${city}`);

    // 1. Tentar Banco de Dados Local (Pega o que já existe, real ou IA)
    let currentEvents = [];
    try {
      currentEvents = await this.eventsService.findAllByCity(city);
    } catch (e) {
      currentEvents = [];
    }

    // 2. Se temos menos que o limite, tentamos o Ticketmaster para buscar eventos REAIS externos
    if (currentEvents.length < this.MIN_EVENTS_THRESHOLD) {
      this.logger.log(`[NEARBY] Poucos eventos (${currentEvents.length}). Buscando no Ticketmaster...`);
      
      const tmEvents = await this.ticketmasterService.getEventsFromTicketmaster(city, state, country);
      
      if (tmEvents.length > 0) {
        currentEvents = await this.eventsService.findAllByCity(city);
      }
    }

    // 3. Se após o Ticketmaster ainda não atingimos o mínimo, a IA entra para completar o gap
    if (currentEvents.length < this.MIN_EVENTS_THRESHOLD) {
      const neededCount = this.MIN_EVENTS_THRESHOLD - currentEvents.length;
      
      this.logger.log(`[NEARBY] Ainda abaixo do limite. IA gerando ${neededCount} eventos para completar.`);
      
      const aiEvents = await this.aiSeedService.seedEventsForLocation(
        city, 
        state, 
        country, 
        neededCount
      );
      
      
      currentEvents = [...currentEvents, ...aiEvents];
    }

    return currentEvents;
  }
}
