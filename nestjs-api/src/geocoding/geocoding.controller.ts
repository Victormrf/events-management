import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

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
}
